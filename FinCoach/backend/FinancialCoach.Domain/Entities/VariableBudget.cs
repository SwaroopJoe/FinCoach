using FinancialCoach.Domain.Common;

namespace FinancialCoach.Domain.Entities;

public sealed class VariableBudget : BaseEntity
{
    public Guid MonthlyPlanId { get; set; }
    public MonthlyPlan? MonthlyPlan { get; set; }
    public string Category { get; set; } = string.Empty;
    public decimal BudgetAmount { get; set; }
    public decimal SpentAmount { get; set; }
    public decimal RemainingAmount => BudgetAmount - SpentAmount;
    public decimal PercentageUsed => BudgetAmount == 0 ? 0 : Math.Round((SpentAmount / BudgetAmount) * 100, 2);
}