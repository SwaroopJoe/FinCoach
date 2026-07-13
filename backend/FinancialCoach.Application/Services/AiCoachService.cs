using System.Net.Http.Json;
using System.Text.Json;
using FinancialCoach.Application.DTOs;
using FinancialCoach.Application.Interfaces;
using Microsoft.Extensions.Configuration;

namespace FinancialCoach.Application.Services;

public sealed class AiCoachService(
    IUserProfileRepository userProfileRepository,
    IMonthlyPlanningService monthlyPlanningService,
    IDashboardService dashboardService,
    IGoalService goalService,
    IInvestmentService investmentService,
    IConfiguration configuration,
    HttpClient httpClient) : IAiCoachService
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);
    private static readonly HashSet<string> Sections = ["incomeItems", "recurringExpenses", "investments", "variableBudgets", "borrowingShortages"];
    private static readonly HashSet<string> Operations = ["add", "update", "remove"];

    public async Task<AiCoachResponse> GetMonthlyCoachAsync(AiCoachRequest request, CancellationToken cancellationToken)
    {
        var profile = await userProfileRepository.GetAsync(request.UserProfileId, cancellationToken);

        if (profile is null)
        {
            throw new InvalidOperationException("Profile was not found.");
        }

        var planMonth = request.Year.HasValue && request.Month.HasValue
            ? new DateTime(request.Year.Value, request.Month.Value, 1, 0, 0, 0, DateTimeKind.Utc)
            : DateTime.UtcNow;
        var plan = request.Year.HasValue && request.Month.HasValue
            ? await monthlyPlanningService.GetByMonthAsync(request.UserProfileId, planMonth, cancellationToken)
            : await monthlyPlanningService.GetCurrentAsync(request.UserProfileId, cancellationToken);
        var dashboard = await dashboardService.GetSummaryAsync(request.UserProfileId, planMonth, cancellationToken);
        var goals = await goalService.GetAllAsync(request.UserProfileId, cancellationToken);
        var investments = await investmentService.GetSummaryAsync(request.UserProfileId, cancellationToken);
        var snapshot = new AiCoachSnapshot(profile.ToResponse(), plan, dashboard, goals, investments, request.Question?.Trim());

        if (string.IsNullOrWhiteSpace(configuration["Gemini:ApiKey"]))
        {
            return CreateFallback(snapshot, "AI coach is running in fallback mode because Gemini is not configured yet.");
        }

        try
        {
            var response = await RequestGeminiAsync(snapshot, cancellationToken);
            return Sanitize(response, snapshot, true);
        }
        catch (Exception exception)
        {
            return CreateFallback(snapshot, $"Gemini was unavailable ({DescribeFailure(exception)}), so Financial Coach generated practical guidance from your saved plan.");
        }
    }

    private async Task<AiCoachResponse> RequestGeminiAsync(AiCoachSnapshot snapshot, CancellationToken cancellationToken)
    {
        Exception? lastException = null;

        foreach (var model in CandidateModels(configuration["Gemini:Model"]))
        {
            try
            {
                return await RequestGeminiModelAsync(snapshot, model, cancellationToken);
            }
            catch (Exception exception) when (exception is HttpRequestException or JsonException or InvalidOperationException)
            {
                lastException = exception;
            }
        }

        throw new InvalidOperationException("Gemini request failed for all configured models.", lastException);
    }

    private async Task<AiCoachResponse> RequestGeminiModelAsync(AiCoachSnapshot snapshot, string model, CancellationToken cancellationToken)
    {
        var apiKey = configuration["Gemini:ApiKey"];
        var baseUrl = configuration["Gemini:BaseUrl"] ?? "https://generativelanguage.googleapis.com/v1beta";
        var url = $"{baseUrl.TrimEnd('/')}/models/{Uri.EscapeDataString(model)}:generateContent?key={Uri.EscapeDataString(apiKey!)}";
        var prompt = BuildPrompt(snapshot);
        var geminiRequest = new
        {
            contents = new[]
            {
                new
                {
                    role = "user",
                    parts = new[] { new { text = prompt } }
                }
            },
            generationConfig = new
            {
                temperature = 0.35,
                responseMimeType = "application/json"
            }
        };

        using var httpResponse = await httpClient.PostAsJsonAsync(url, geminiRequest, JsonOptions, cancellationToken);
        httpResponse.EnsureSuccessStatusCode();
        using var document = await JsonDocument.ParseAsync(await httpResponse.Content.ReadAsStreamAsync(cancellationToken), cancellationToken: cancellationToken);
        var text = document.RootElement
            .GetProperty("candidates")[0]
            .GetProperty("content")
            .GetProperty("parts")[0]
            .GetProperty("text")
            .GetString();

        if (string.IsNullOrWhiteSpace(text))
        {
            throw new InvalidOperationException("Gemini returned an empty response.");
        }

        return JsonSerializer.Deserialize<AiCoachResponse>(text, JsonOptions) ?? throw new InvalidOperationException("Gemini returned invalid JSON.");
    }

    private static IReadOnlyCollection<string> CandidateModels(string? configuredModel)
    {
        var models = new List<string>();

        if (!string.IsNullOrWhiteSpace(configuredModel))
        {
            models.Add(NormalizeModelName(configuredModel));
        }

        models.AddRange(["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash-latest", "gemini-1.5-flash"]);
        return models.Distinct(StringComparer.OrdinalIgnoreCase).ToArray();
    }

    private static string NormalizeModelName(string model) => model.Trim().StartsWith("models/", StringComparison.OrdinalIgnoreCase)
        ? model.Trim()["models/".Length..]
        : model.Trim();

    private static string DescribeFailure(Exception exception)
    {
        var root = exception.GetBaseException();

        if (root is HttpRequestException httpException && httpException.StatusCode.HasValue)
        {
            return $"HTTP {(int)httpException.StatusCode.Value}";
        }

        return root.GetType().Name;
    }

    private static string BuildPrompt(AiCoachSnapshot snapshot) => $$"""
You are Financial Coach's monthly planning assistant for an India-oriented personal-finance app.
Return JSON only. Match this exact response shape:
{
  "headline": "string",
  "summary": "string",
  "generatedAtUtc": "2026-07-13T00:00:00Z",
  "sourceSnapshotMonth": "string",
  "isAiGenerated": true,
  "insights": [{ "title": "string", "message": "string", "priority": "Low|Medium|High", "category": "Budget|Savings|Investment|Goal|Risk|General", "recommendedAction": "string|null", "patches": [] }],
  "actionItems": [{ "title": "string", "message": "string", "priority": "Low|Medium|High", "category": "Budget|Savings|Investment|Goal|Risk|General", "recommendedAction": "string|null", "patches": [] }],
  "riskWarnings": [{ "title": "string", "message": "string", "priority": "Low|Medium|High", "category": "Budget|Savings|Investment|Goal|Risk|General", "recommendedAction": "string|null", "patches": [] }]
}
Patch rules:
- Patches are suggestions only. They will be reviewed by the user before applying and never auto-saved.
- Allowed sections: incomeItems, recurringExpenses, investments, variableBudgets, borrowingShortages.
- Allowed operations: add, update, remove.
- For update/remove, reference existing rows by matchName or matchCategory.
- For add, include name or category.
- Amounts must be non-negative. Do not invent totals. Use only supplied app data.
- Do not recommend credit-card borrowing, guaranteed returns, tax/legal advice, or automatic financial changes.
- Keep response concise for mobile.

Financial snapshot JSON:
{{JsonSerializer.Serialize(snapshot, JsonOptions)}}
""";

    private static AiCoachResponse Sanitize(AiCoachResponse response, AiCoachSnapshot snapshot, bool isAiGenerated)
    {
        var month = snapshot.Plan?.PlanMonth.ToString("yyyy-MM") ?? DateTime.UtcNow.ToString("yyyy-MM");
        return response with
        {
            GeneratedAtUtc = DateTime.UtcNow,
            SourceSnapshotMonth = string.IsNullOrWhiteSpace(response.SourceSnapshotMonth) ? month : response.SourceSnapshotMonth,
            IsAiGenerated = isAiGenerated,
            Insights = SanitizeItems(response.Insights, snapshot),
            ActionItems = SanitizeItems(response.ActionItems, snapshot),
            RiskWarnings = SanitizeItems(response.RiskWarnings, snapshot)
        };
    }

    private static IReadOnlyCollection<AiCoachItemResponse> SanitizeItems(IReadOnlyCollection<AiCoachItemResponse>? items, AiCoachSnapshot snapshot) =>
        (items ?? [])
            .Where(item => !string.IsNullOrWhiteSpace(item.Title) && !string.IsNullOrWhiteSpace(item.Message))
            .Select(item => item with { Patches = SanitizePatches(item.Patches, snapshot) })
            .Take(6)
            .ToArray();

    private static IReadOnlyCollection<AiCoachPatchResponse> SanitizePatches(IReadOnlyCollection<AiCoachPatchResponse>? patches, AiCoachSnapshot snapshot) =>
        (patches ?? [])
            .Where(patch => IsValidPatch(patch, snapshot))
            .Take(4)
            .ToArray();

    private static bool IsValidPatch(AiCoachPatchResponse patch, AiCoachSnapshot snapshot)
    {
        var operation = patch.Operation.Trim().ToLowerInvariant();
        var section = patch.Section.Trim();

        if (!Operations.Contains(operation) || !Sections.Contains(section))
        {
            return false;
        }

        if ((patch.CurrentValue.HasValue && patch.CurrentValue.Value < 0) || (patch.SuggestedValue.HasValue && patch.SuggestedValue.Value < 0))
        {
            return false;
        }

        if (operation == "add")
        {
            return section == "variableBudgets" ? !string.IsNullOrWhiteSpace(patch.Category) : !string.IsNullOrWhiteSpace(patch.Name);
        }

        return section == "variableBudgets" ? HasVariableBudget(snapshot.Plan, patch.MatchCategory) : HasMoneyLine(snapshot.Plan, section, patch.MatchName);
    }

    private static bool HasVariableBudget(MonthlyPlanResponse? plan, string? category) =>
        plan?.VariableBudgets.Any(item => string.Equals(item.Category, category, StringComparison.OrdinalIgnoreCase)) == true;

    private static bool HasMoneyLine(MonthlyPlanResponse? plan, string section, string? name) => section switch
    {
        "incomeItems" => plan?.IncomeItems.Any(item => string.Equals(item.Name, name, StringComparison.OrdinalIgnoreCase)) == true,
        "recurringExpenses" => plan?.RecurringExpenses.Any(item => string.Equals(item.Name, name, StringComparison.OrdinalIgnoreCase)) == true,
        "investments" => plan?.Investments.Any(item => string.Equals(item.Name, name, StringComparison.OrdinalIgnoreCase)) == true,
        "borrowingShortages" => plan?.BorrowingShortages.Any(item => string.Equals(item.Name, name, StringComparison.OrdinalIgnoreCase)) == true,
        _ => false
    };

    private static AiCoachResponse CreateFallback(AiCoachSnapshot snapshot, string summary)
    {
        var plan = snapshot.Plan;
        var insights = new List<AiCoachItemResponse>();
        var actions = new List<AiCoachItemResponse>();
        var warnings = new List<AiCoachItemResponse>();

        if (plan is null)
        {
            return new AiCoachResponse(
                "Create this month's plan first",
                "Add your income, budgets, and allocations so the coach can give useful guidance.",
                DateTime.UtcNow,
                DateTime.UtcNow.ToString("yyyy-MM"),
                false,
                [],
                [new AiCoachItemResponse("Start monthly planning", "Create a monthly plan before applying AI suggestions.", "High", "Budget", "Go to Monthly Plan")],
                []);
        }

        if (plan.RemainingBalance < 0)
        {
            warnings.Add(new AiCoachItemResponse(
                "Plan is over allocated",
                $"Your allocations exceed income by ₹{Math.Abs(plan.RemainingBalance):N0}. Reduce a budget, expense, or investment allocation before relying on this plan.",
                "High",
                "Risk",
                "Reduce over-allocation"));
        }
        else if (plan.RemainingBalance > 0)
        {
            actions.Add(new AiCoachItemResponse(
                "Assign unallocated money",
                $"₹{plan.RemainingBalance:N0} is not assigned yet. Keeping it as a savings buffer can make the plan more resilient.",
                "Medium",
                "Savings",
                "Add savings buffer",
                [new AiCoachPatchResponse("add", "investments", null, null, null, null, plan.RemainingBalance, plan.RemainingBalance, "Assign unallocated money as a buffer.", "Savings buffer")]));
        }

        foreach (var budget in plan.VariableBudgets.Where(item => item.SpentAmount > item.BudgetAmount).Take(2))
        {
            warnings.Add(new AiCoachItemResponse(
                $"{budget.Category} is over budget",
                $"Spent is ₹{budget.SpentAmount:N0} against a ₹{budget.BudgetAmount:N0} budget. If this spend is valid, increase the budget and rebalance elsewhere.",
                "High",
                "Budget",
                "Increase budget to actual spend",
                [new AiCoachPatchResponse("update", "variableBudgets", null, budget.Category, "budgetAmount", budget.BudgetAmount, budget.SpentAmount, budget.SpentAmount - budget.BudgetAmount, "Match budget to real spend.")]));
        }

        insights.Add(new AiCoachItemResponse(
            "Savings rate check",
            $"Your current plan savings rate is {plan.SavingsRate:N1}%. Review investments and buffer after fixed expenses are covered.",
            plan.SavingsRate < 10 ? "High" : "Medium",
            "Savings",
            "Review monthly allocation"));

        return new AiCoachResponse(
            "Monthly coach guidance is ready",
            summary,
            DateTime.UtcNow,
            plan.PlanMonth.ToString("yyyy-MM"),
            false,
            insights,
            actions,
            warnings);
    }

    private sealed record AiCoachSnapshot(
        UserProfileResponse Profile,
        MonthlyPlanResponse? Plan,
        DashboardSummaryResponse Dashboard,
        IReadOnlyCollection<FinancialGoalResponse> Goals,
        InvestmentSummaryResponse Investments,
        string? Question);
}
