namespace FinancialCoach.Application.DTOs;

public sealed record MoneyLineItemRequest(string Name, decimal Amount);

public sealed record VariableBudgetRequest(string Category, decimal BudgetAmount, decimal SpentAmount = 0);

public sealed record MonthlyPlanRequest(
    Guid UserProfileId,
    DateTime PlanMonth,
    IReadOnlyCollection<MoneyLineItemRequest> IncomeItems,
    IReadOnlyCollection<MoneyLineItemRequest> RecurringExpenses,
    IReadOnlyCollection<MoneyLineItemRequest> Investments,
    IReadOnlyCollection<VariableBudgetRequest> VariableBudgets);

public sealed record VariableBudgetResponse(
    Guid Id,
    string Category,
    decimal BudgetAmount,
    decimal SpentAmount,
    decimal RemainingAmount,
    decimal PercentageUsed);

public sealed record MonthlyPlanResponse(
    Guid Id,
    Guid UserProfileId,
    DateTime PlanMonth,
    IReadOnlyCollection<MoneyLineItemResponse> IncomeItems,
    IReadOnlyCollection<MoneyLineItemResponse> RecurringExpenses,
    IReadOnlyCollection<MoneyLineItemResponse> Investments,
    IReadOnlyCollection<VariableBudgetResponse> VariableBudgets,
    decimal TotalIncome,
    decimal TotalAllocation,
    decimal RemainingBalance,
    decimal SavingsRate);

public sealed record MoneyLineItemResponse(Guid Id, string Name, decimal Amount);