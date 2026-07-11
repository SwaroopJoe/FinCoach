using FinancialCoach.Domain.Enums;

namespace FinancialCoach.Application.DTOs;

public sealed record FinancialGoalRequest(
    Guid UserProfileId,
    string Name,
    GoalCategory Category,
    string CustomCategory,
    GoalPriority Priority,
    decimal TargetAmount,
    decimal StartingAmount,
    DateTime? TargetDate,
    string Notes);

public sealed record GoalContributionRequest(
    DateTime ContributionMonth,
    decimal Amount,
    string Description);

public sealed record FinancialGoalResponse(
    Guid Id,
    Guid UserProfileId,
    string Name,
    GoalCategory Category,
    string CustomCategory,
    GoalPriority Priority,
    decimal TargetAmount,
    decimal StartingAmount,
    decimal CurrentAmount,
    decimal RemainingAmount,
    decimal ProgressPercent,
    DateTime? TargetDate,
    bool IsCompleted,
    string Notes,
    GoalContributionResponse[] Contributions);

public sealed record GoalContributionResponse(
    Guid Id,
    Guid FinancialGoalId,
    DateTime ContributionMonth,
    decimal Amount,
    string Description);