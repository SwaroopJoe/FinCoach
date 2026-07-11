using FinancialCoach.Domain.Entities;

namespace FinancialCoach.Application.Interfaces;

public interface IFeedbackEntryRepository
{
    Task<IReadOnlyCollection<FeedbackEntry>> GetRecentAsync(CancellationToken cancellationToken);
    Task<FeedbackEntry> AddAsync(FeedbackEntry entry, CancellationToken cancellationToken);
}