using FinancialCoach.Application.DTOs;
using FinancialCoach.Application.Interfaces;

namespace FinancialCoach.Application.Services;

public sealed class DashboardService(IMonthlyPlanRepository monthlyPlanRepository) : IDashboardService
{
    public async Task<DashboardSummaryResponse> GetSummaryAsync(Guid userProfileId, CancellationToken cancellationToken)
    {
        var plan = await monthlyPlanRepository.GetLatestAsync(userProfileId, cancellationToken);
        return ToSummary(plan);
    }

    public async Task<DashboardSummaryResponse> GetSummaryAsync(Guid userProfileId, DateTime planMonth, CancellationToken cancellationToken)
    {
        var normalizedMonth = new DateTime(planMonth.Year, planMonth.Month, 1);
        var plan = await monthlyPlanRepository.GetByMonthAsync(userProfileId, normalizedMonth, cancellationToken);
        return ToSummary(plan);
    }

    private static DashboardSummaryResponse ToSummary(Domain.Entities.MonthlyPlan? plan)
    {
        if (plan is null)
        {
            return new DashboardSummaryResponse(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        }

        var budgetUtilization = plan.TotalVariableBudgets == 0
            ? 0
            : Math.Round((plan.VariableBudgets.Sum(item => item.SpentAmount) / plan.TotalVariableBudgets) * 100, 2);
        var healthScore = CalculateHealthScore(plan.SavingsRate, budgetUtilization, plan.RemainingBalance);

        return new DashboardSummaryResponse(
            plan.TotalIncome,
            plan.TotalRecurringExpenses + plan.VariableBudgets.Sum(item => item.SpentAmount),
            plan.RemainingBalance,
            plan.TotalInvestments,
            plan.TotalInvestments,
            0,
            0,
            0,
            budgetUtilization,
            0,
            healthScore);
    }

    private static int CalculateHealthScore(decimal savingsRate, decimal budgetUtilization, decimal remainingBalance)
    {
        var score = 50;
        score += savingsRate >= 20 ? 25 : savingsRate >= 10 ? 15 : 5;
        score += budgetUtilization <= 80 ? 15 : budgetUtilization <= 100 ? 5 : -10;
        score += remainingBalance >= 0 ? 10 : -15;
        return Math.Clamp(score, 0, 100);
    }
}