using FinancialCoach.Domain.Common;

namespace FinancialCoach.Domain.Entities;

public sealed class MonthlyPlan : BaseEntity
{
    public Guid UserProfileId { get; set; }
    public UserProfile? UserProfile { get; set; }
    public DateTime PlanMonth { get; set; }
    public List<IncomeItem> IncomeItems { get; set; } = [];
    public List<RecurringExpense> RecurringExpenses { get; set; } = [];
    public List<InvestmentAllocation> Investments { get; set; } = [];
    public List<VariableBudget> VariableBudgets { get; set; } = [];
    public List<BorrowingShortage> BorrowingShortages { get; set; } = [];
    public List<BudgetVersion> Versions { get; set; } = [];

    public decimal TotalIncome => IncomeItems.Sum(item => item.Amount);
    public decimal TotalRecurringExpenses => RecurringExpenses.Sum(item => item.Amount);
    public decimal TotalInvestments => Investments.Sum(item => item.Amount);
    public decimal TotalVariableBudgets => VariableBudgets.Sum(item => item.BudgetAmount);
    public decimal TotalBorrowingShortage => BorrowingShortages.Sum(item => item.Amount);
    public decimal TotalAllocation => TotalRecurringExpenses + TotalInvestments + TotalVariableBudgets;
    public decimal RemainingBalance => TotalIncome - TotalAllocation;
    public decimal SavingsRate => TotalIncome == 0 ? 0 : Math.Round((TotalInvestments / TotalIncome) * 100, 2);
}