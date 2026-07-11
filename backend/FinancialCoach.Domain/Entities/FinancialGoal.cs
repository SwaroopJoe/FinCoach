using FinancialCoach.Domain.Common;
using FinancialCoach.Domain.Enums;

namespace FinancialCoach.Domain.Entities;

public sealed class FinancialGoal : BaseEntity
{
    public Guid UserProfileId { get; set; }
    public UserProfile? UserProfile { get; set; }
    public string Name { get; set; } = string.Empty;
    public GoalCategory Category { get; set; } = GoalCategory.Custom;
    public string CustomCategory { get; set; } = string.Empty;
    public GoalPriority Priority { get; set; } = GoalPriority.Medium;
    public decimal TargetAmount { get; set; }
    public decimal StartingAmount { get; set; }
    public DateTime? TargetDate { get; set; }
    public bool IsCompleted { get; set; }
    public string Notes { get; set; } = string.Empty;
    public List<GoalContribution> Contributions { get; set; } = [];

    public decimal CurrentAmount => StartingAmount + Contributions.Sum(item => item.Amount);
    public decimal RemainingAmount => Math.Max(TargetAmount - CurrentAmount, 0);
    public decimal ProgressPercent => TargetAmount == 0 ? 0 : Math.Min(Math.Round((CurrentAmount / TargetAmount) * 100, 2), 100);
}