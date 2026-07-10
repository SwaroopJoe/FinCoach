using FinancialCoach.Application.DTOs;
using FinancialCoach.Application.Interfaces;
using FinancialCoach.Domain.Entities;

namespace FinancialCoach.Application.Services;

public sealed class MonthlyPlanningService(IMonthlyPlanRepository repository) : IMonthlyPlanningService
{
    public async Task<MonthlyPlanResponse?> GetCurrentAsync(Guid userProfileId, CancellationToken cancellationToken)
    {
        var currentMonth = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1);
        var plan = await repository.GetByMonthAsync(userProfileId, currentMonth, cancellationToken);
        return plan?.ToResponse();
    }

    public async Task<MonthlyPlanResponse> UpsertAsync(MonthlyPlanRequest request, CancellationToken cancellationToken)
    {
        var planMonth = new DateTime(request.PlanMonth.Year, request.PlanMonth.Month, 1);
        var existing = await repository.GetByMonthAsync(request.UserProfileId, planMonth, cancellationToken);
        var plan = existing ?? new MonthlyPlan { UserProfileId = request.UserProfileId, PlanMonth = planMonth };

        plan.PlanMonth = planMonth;
        plan.IncomeItems = request.IncomeItems.Select(item => new IncomeItem { Name = item.Name.Trim(), Amount = item.Amount }).ToList();
        plan.RecurringExpenses = request.RecurringExpenses.Select(item => new RecurringExpense { Category = item.Name.Trim(), Amount = item.Amount }).ToList();
        plan.Investments = request.Investments.Select(item => new InvestmentAllocation { Category = item.Name.Trim(), Amount = item.Amount }).ToList();
        plan.VariableBudgets = request.VariableBudgets.Select(item => new VariableBudget { Category = item.Category.Trim(), BudgetAmount = item.BudgetAmount, SpentAmount = item.SpentAmount }).ToList();
        plan.UpdatedAtUtc = DateTime.UtcNow;

        plan.Versions.Add(new BudgetVersion
        {
            VersionNumber = plan.Versions.Count + 1,
            Reason = existing is null ? "Initial monthly plan" : "Monthly plan updated",
            SnapshotJson = $"{{\"totalIncome\":{plan.TotalIncome},\"totalAllocation\":{plan.TotalAllocation},\"remainingBalance\":{plan.RemainingBalance}}}"
        });

        var saved = await repository.UpsertAsync(plan, cancellationToken);
        return saved.ToResponse();
    }
}