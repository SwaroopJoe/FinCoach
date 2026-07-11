using FinancialCoach.Application.Interfaces;
using FinancialCoach.Domain.Entities;
using FinancialCoach.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace FinancialCoach.Infrastructure.Repositories;

public sealed class GoalRepository(FinancialCoachDbContext dbContext) : IGoalRepository
{
    public async Task<IReadOnlyCollection<FinancialGoal>> GetByUserProfileAsync(Guid userProfileId, CancellationToken cancellationToken) =>
        await IncludeGoal(dbContext.FinancialGoals)
            .Where(goal => goal.UserProfileId == userProfileId)
            .OrderBy(goal => goal.TargetDate ?? DateTime.MaxValue)
            .ThenBy(goal => goal.Name)
            .ToArrayAsync(cancellationToken);

    public Task<FinancialGoal?> GetByIdAsync(Guid id, CancellationToken cancellationToken) =>
        IncludeGoal(dbContext.FinancialGoals).FirstOrDefaultAsync(goal => goal.Id == id, cancellationToken);

    public async Task<FinancialGoal> AddAsync(FinancialGoal goal, CancellationToken cancellationToken)
    {
        dbContext.FinancialGoals.Add(goal);
        await dbContext.SaveChangesAsync(cancellationToken);
        return goal;
    }

    public async Task<FinancialGoal> UpdateAsync(FinancialGoal goal, CancellationToken cancellationToken)
    {
        goal.UpdatedAtUtc = DateTime.UtcNow;
        goal.SyncVersion++;
        await dbContext.SaveChangesAsync(cancellationToken);
        return goal;
    }

    public async Task<bool> DeleteAsync(FinancialGoal goal, CancellationToken cancellationToken)
    {
        dbContext.FinancialGoals.Remove(goal);
        return await dbContext.SaveChangesAsync(cancellationToken) > 0;
    }

    public async Task<GoalContribution> AddContributionAsync(GoalContribution contribution, CancellationToken cancellationToken)
    {
        dbContext.GoalContributions.Add(contribution);
        await dbContext.SaveChangesAsync(cancellationToken);
        return contribution;
    }

    private static IQueryable<FinancialGoal> IncludeGoal(IQueryable<FinancialGoal> query) =>
        query.Include(goal => goal.Contributions);
}