using FinancialCoach.Domain.Common;

namespace FinancialCoach.Domain.Entities;

public sealed class GoalContribution : BaseEntity
{
    public Guid FinancialGoalId { get; set; }
    public FinancialGoal? FinancialGoal { get; set; }
    public Guid? SourceMonthlyPlanId { get; set; }
    public DateTime ContributionMonth { get; set; }
    public decimal Amount { get; set; }
    public string Description { get; set; } = string.Empty;
}