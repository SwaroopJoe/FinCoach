using FinancialCoach.Domain.Common;

namespace FinancialCoach.Domain.Entities;

public sealed class BorrowingShortage : BaseEntity
{
    public Guid MonthlyPlanId { get; set; }
    public MonthlyPlan? MonthlyPlan { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Reason { get; set; } = string.Empty;
}