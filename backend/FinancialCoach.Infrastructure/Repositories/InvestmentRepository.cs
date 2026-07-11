using FinancialCoach.Application.Interfaces;
using FinancialCoach.Domain.Entities;
using FinancialCoach.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace FinancialCoach.Infrastructure.Repositories;

public sealed class InvestmentRepository(FinancialCoachDbContext dbContext) : IInvestmentRepository
{
    public async Task<IReadOnlyCollection<InvestmentHolding>> GetByUserProfileAsync(Guid userProfileId, CancellationToken cancellationToken) =>
        await IncludeHolding(dbContext.InvestmentHoldings)
            .Where(holding => holding.UserProfileId == userProfileId)
            .OrderBy(holding => holding.Name)
            .ToArrayAsync(cancellationToken);

    public Task<InvestmentHolding?> GetByIdAsync(Guid id, CancellationToken cancellationToken) =>
        IncludeHolding(dbContext.InvestmentHoldings).FirstOrDefaultAsync(holding => holding.Id == id, cancellationToken);

    public async Task<InvestmentHolding> AddAsync(InvestmentHolding holding, CancellationToken cancellationToken)
    {
        dbContext.InvestmentHoldings.Add(holding);
        await dbContext.SaveChangesAsync(cancellationToken);
        return holding;
    }

    public async Task<InvestmentHolding> UpdateAsync(InvestmentHolding holding, CancellationToken cancellationToken)
    {
        holding.UpdatedAtUtc = DateTime.UtcNow;
        holding.SyncVersion++;
        await dbContext.SaveChangesAsync(cancellationToken);
        return holding;
    }

    public async Task<bool> DeleteAsync(InvestmentHolding holding, CancellationToken cancellationToken)
    {
        dbContext.InvestmentHoldings.Remove(holding);
        return await dbContext.SaveChangesAsync(cancellationToken) > 0;
    }

    public async Task<InvestmentContribution> AddContributionAsync(InvestmentContribution contribution, CancellationToken cancellationToken)
    {
        dbContext.InvestmentContributions.Add(contribution);
        await dbContext.SaveChangesAsync(cancellationToken);
        return contribution;
    }

    private static IQueryable<InvestmentHolding> IncludeHolding(IQueryable<InvestmentHolding> query) =>
        query.Include(holding => holding.Contributions);
}