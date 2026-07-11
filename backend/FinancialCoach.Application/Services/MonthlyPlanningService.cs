using FinancialCoach.Application.DTOs;
using FinancialCoach.Application.Interfaces;
using FinancialCoach.Domain.Entities;

namespace FinancialCoach.Application.Services;

public sealed class MonthlyPlanningService(IMonthlyPlanRepository repository) : IMonthlyPlanningService
{
    public async Task<MonthlyPlanResponse?> GetCurrentAsync(Guid userProfileId, CancellationToken cancellationToken)
    {
        var currentMonth = NormalizeMonth(DateTime.UtcNow);
        var plan = await repository.GetByMonthAsync(userProfileId, currentMonth, cancellationToken);
        plan ??= await repository.GetLatestAsync(userProfileId, cancellationToken);
        return plan?.ToResponse();
    }

    public async Task<MonthlyPlanResponse?> GetByMonthAsync(Guid userProfileId, DateTime planMonth, CancellationToken cancellationToken)
    {
        var normalizedMonth = NormalizeMonth(planMonth);
        var plan = await repository.GetByMonthAsync(userProfileId, normalizedMonth, cancellationToken);
        return plan?.ToResponse();
    }

    public async Task<MonthlyPlanResponse> UpsertAsync(MonthlyPlanRequest request, CancellationToken cancellationToken)
    {
        var planMonth = NormalizeMonth(request.PlanMonth);
        var existing = await repository.GetByMonthAsync(request.UserProfileId, planMonth, cancellationToken);
        var plan = existing ?? new MonthlyPlan { UserProfileId = request.UserProfileId, PlanMonth = planMonth };

        plan.PlanMonth = planMonth;

        if (existing is not null)
        {
            await repository.RemoveChildRowsAsync(plan, cancellationToken);
        }

        plan.IncomeItems.Clear();
        plan.RecurringExpenses.Clear();
        plan.Investments.Clear();
        plan.VariableBudgets.Clear();
        plan.BorrowingShortages.Clear();

        plan.IncomeItems.AddRange(request.IncomeItems.Select(item => new IncomeItem { Name = item.Name.Trim(), Amount = item.Amount }));
        plan.RecurringExpenses.AddRange(request.RecurringExpenses.Select(item => new RecurringExpense { Category = item.Name.Trim(), Amount = item.Amount }));
        plan.Investments.AddRange(request.Investments.Select(item => new InvestmentAllocation { Category = item.Name.Trim(), Amount = item.Amount }));
        plan.VariableBudgets.AddRange(request.VariableBudgets.Select(item => new VariableBudget { Category = item.Category.Trim(), BudgetAmount = item.BudgetAmount, SpentAmount = item.SpentAmount }));
        plan.BorrowingShortages.AddRange(request.BorrowingShortages.Select(item => new BorrowingShortage { Name = item.Name.Trim(), Amount = item.Amount, Reason = item.Reason.Trim() }));
        plan.UpdatedAtUtc = DateTime.UtcNow;

        var versionNumber = existing is null ? 1 : await repository.GetVersionCountAsync(plan.Id, cancellationToken) + 1;

        plan.Versions.Add(new BudgetVersion
        {
            VersionNumber = versionNumber,
            Reason = existing is null ? "Initial monthly plan" : "Monthly plan updated",
            SnapshotJson = $"{{\"totalIncome\":{plan.TotalIncome},\"totalAllocation\":{plan.TotalAllocation},\"remainingBalance\":{plan.RemainingBalance}}}"
        });

        var saved = await repository.UpsertAsync(plan, cancellationToken);
        return saved.ToResponse();
    }

    public async Task<bool> ResetCurrentAsync(Guid userProfileId, CancellationToken cancellationToken)
    {
        var currentMonth = NormalizeMonth(DateTime.UtcNow);
        var plan = await repository.GetByMonthAsync(userProfileId, currentMonth, cancellationToken)
            ?? await repository.GetLatestAsync(userProfileId, cancellationToken);

        if (plan is null)
        {
            return false;
        }

        await repository.DeleteAsync(plan, cancellationToken);
        return true;
    }

    public async Task<bool> ResetByMonthAsync(Guid userProfileId, DateTime planMonth, CancellationToken cancellationToken)
    {
        var normalizedMonth = NormalizeMonth(planMonth);
        var plan = await repository.GetByMonthAsync(userProfileId, normalizedMonth, cancellationToken);

        if (plan is null)
        {
            return false;
        }

        await repository.DeleteAsync(plan, cancellationToken);
        return true;
    }

    private static DateTime NormalizeMonth(DateTime value) => new(value.Year, value.Month, 1, 0, 0, 0, DateTimeKind.Utc);
}