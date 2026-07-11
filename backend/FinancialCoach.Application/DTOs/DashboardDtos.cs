namespace FinancialCoach.Application.DTOs;

public sealed record DashboardSummaryResponse(
    decimal MonthlyIncome,
    decimal MonthlyExpenses,
    decimal RemainingBudget,
    decimal TotalSavings,
    decimal Investments,
    int ActiveLoans,
    decimal OutstandingLoanAmount,
    decimal MonthlyEmiCommitment,
    decimal BudgetUtilization,
    decimal GoalProgress,
    int FinancialHealthScore);