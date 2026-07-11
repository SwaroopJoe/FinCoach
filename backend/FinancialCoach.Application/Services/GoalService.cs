using FinancialCoach.Application.DTOs;
using FinancialCoach.Application.Interfaces;
using FinancialCoach.Domain.Entities;

namespace FinancialCoach.Application.Services;

public sealed class GoalService(IGoalRepository repository) : IGoalService
{
    public async Task<IReadOnlyCollection<FinancialGoalResponse>> GetAllAsync(Guid userProfileId, CancellationToken cancellationToken)
    {
        var goals = await repository.GetByUserProfileAsync(userProfileId, cancellationToken);
        return goals.Select(ToResponse).ToArray();
    }

    public async Task<FinancialGoalResponse> CreateAsync(FinancialGoalRequest request, CancellationToken cancellationToken)
    {
        var goal = new FinancialGoal();
        ApplyRequest(goal, request);
        var saved = await repository.AddAsync(goal, cancellationToken);
        return ToResponse(saved);
    }

    public async Task<FinancialGoalResponse?> UpdateAsync(Guid id, FinancialGoalRequest request, CancellationToken cancellationToken)
    {
        var goal = await repository.GetByIdAsync(id, cancellationToken);

        if (goal is null)
        {
            return null;
        }

        ApplyRequest(goal, request);
        var saved = await repository.UpdateAsync(goal, cancellationToken);
        return ToResponse(saved);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var goal = await repository.GetByIdAsync(id, cancellationToken);
        return goal is not null && await repository.DeleteAsync(goal, cancellationToken);
    }

    public async Task<GoalContributionResponse?> AddContributionAsync(Guid goalId, GoalContributionRequest request, CancellationToken cancellationToken)
    {
        var goal = await repository.GetByIdAsync(goalId, cancellationToken);

        if (goal is null)
        {
            return null;
        }

        var contributionMonth = new DateTime(request.ContributionMonth.Year, request.ContributionMonth.Month, 1);
        var contribution = new GoalContribution
        {
            FinancialGoalId = goal.Id,
            ContributionMonth = contributionMonth,
            Amount = request.Amount,
            Description = request.Description.Trim()
        };

        goal.UpdatedAtUtc = DateTime.UtcNow;
        goal.SyncVersion++;

        var saved = await repository.AddContributionAsync(contribution, cancellationToken);
        return ToContributionResponse(saved);
    }

    private static void ApplyRequest(FinancialGoal goal, FinancialGoalRequest request)
    {
        goal.UserProfileId = request.UserProfileId;
        goal.Name = request.Name.Trim();
        goal.Category = request.Category;
        goal.CustomCategory = request.CustomCategory.Trim();
        goal.Priority = request.Priority;
        goal.TargetAmount = request.TargetAmount;
        goal.StartingAmount = request.StartingAmount;
        goal.TargetDate = request.TargetDate;
        goal.Notes = request.Notes.Trim();
    }

    private static FinancialGoalResponse ToResponse(FinancialGoal goal) => new(
        goal.Id,
        goal.UserProfileId,
        goal.Name,
        goal.Category,
        goal.CustomCategory,
        goal.Priority,
        goal.TargetAmount,
        goal.StartingAmount,
        goal.CurrentAmount,
        goal.RemainingAmount,
        goal.ProgressPercent,
        goal.TargetDate,
        goal.IsCompleted,
        goal.Notes,
        goal.Contributions.OrderByDescending(item => item.ContributionMonth).Select(ToContributionResponse).ToArray());

    private static GoalContributionResponse ToContributionResponse(GoalContribution contribution) => new(
        contribution.Id,
        contribution.FinancialGoalId,
        contribution.ContributionMonth,
        contribution.Amount,
        contribution.Description);
}