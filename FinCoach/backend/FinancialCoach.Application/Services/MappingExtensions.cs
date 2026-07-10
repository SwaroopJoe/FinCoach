using FinancialCoach.Application.DTOs;
using FinancialCoach.Domain.Entities;

namespace FinancialCoach.Application.Services;

internal static class MappingExtensions
{
    public static UserProfileResponse ToResponse(this UserProfile profile) => new(
        profile.Id,
        profile.Name,
        profile.Salary,
        profile.SalaryCreditDay,
        profile.PreferredCurrency,
        profile.NotificationTimes.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries),
        profile.FamilySize,
        profile.FinancialPreferences);

    public static MonthlyPlanResponse ToResponse(this MonthlyPlan plan) => new(
        plan.Id,
        plan.UserProfileId,
        plan.PlanMonth,
        plan.IncomeItems.Select(item => new MoneyLineItemResponse(item.Id, item.Name, item.Amount)).ToArray(),
        plan.RecurringExpenses.Select(item => new MoneyLineItemResponse(item.Id, item.Category, item.Amount)).ToArray(),
        plan.Investments.Select(item => new MoneyLineItemResponse(item.Id, item.Category, item.Amount)).ToArray(),
        plan.VariableBudgets.Select(item => new VariableBudgetResponse(item.Id, item.Category, item.BudgetAmount, item.SpentAmount, item.RemainingAmount, item.PercentageUsed)).ToArray(),
        plan.TotalIncome,
        plan.TotalAllocation,
        plan.RemainingBalance,
        plan.SavingsRate);
}