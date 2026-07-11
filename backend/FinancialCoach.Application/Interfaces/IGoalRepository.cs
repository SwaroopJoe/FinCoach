using FinancialCoach.Domain.Entities;

namespace FinancialCoach.Application.Interfaces;

public interface IGoalRepository
{
    Task<IReadOnlyCollection<FinancialGoal>> GetByUserProfileAsync(Guid userProfileId, CancellationToken cancellationToken);
    Task<FinancialGoal?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<FinancialGoal> AddAsync(FinancialGoal goal, CancellationToken cancellationToken);
    Task<FinancialGoal> UpdateAsync(FinancialGoal goal, CancellationToken cancellationToken);
    Task<bool> DeleteAsync(FinancialGoal goal, CancellationToken cancellationToken);
    Task<GoalContribution> AddContributionAsync(GoalContribution contribution, CancellationToken cancellationToken);
}