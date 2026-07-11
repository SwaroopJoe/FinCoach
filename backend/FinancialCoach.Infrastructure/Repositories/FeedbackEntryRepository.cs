using FinancialCoach.Application.Interfaces;
using FinancialCoach.Domain.Entities;
using FinancialCoach.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace FinancialCoach.Infrastructure.Repositories;

public sealed class FeedbackEntryRepository(FinancialCoachDbContext dbContext) : IFeedbackEntryRepository
{
    public async Task<IReadOnlyCollection<FeedbackEntry>> GetRecentAsync(CancellationToken cancellationToken) =>
        await dbContext.FeedbackEntries
            .OrderByDescending(entry => entry.CreatedAtUtc)
            .Take(50)
            .ToArrayAsync(cancellationToken);

    public async Task<FeedbackEntry> AddAsync(FeedbackEntry entry, CancellationToken cancellationToken)
    {
        dbContext.FeedbackEntries.Add(entry);
        await dbContext.SaveChangesAsync(cancellationToken);
        return entry;
    }
}