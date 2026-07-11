using FinancialCoach.Domain.Common;

namespace FinancialCoach.Domain.Entities;

public sealed class InvestmentAllocation : BaseEntity
{
    public Guid MonthlyPlanId { get; set; }
    public MonthlyPlan? MonthlyPlan { get; set; }
    public string Category { get; set; } = string.Empty;
    public decimal Amount { get; set; }
}