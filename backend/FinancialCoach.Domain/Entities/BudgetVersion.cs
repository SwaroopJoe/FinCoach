using FinancialCoach.Domain.Common;

namespace FinancialCoach.Domain.Entities;

public sealed class BudgetVersion : BaseEntity
{
    public Guid MonthlyPlanId { get; set; }
    public MonthlyPlan? MonthlyPlan { get; set; }
    public int VersionNumber { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string SnapshotJson { get; set; } = string.Empty;
}