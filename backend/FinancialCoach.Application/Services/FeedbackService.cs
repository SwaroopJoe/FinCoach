using FinancialCoach.Application.DTOs;
using FinancialCoach.Application.Interfaces;
using FinancialCoach.Domain.Entities;

namespace FinancialCoach.Application.Services;

public sealed class FeedbackService(IFeedbackEntryRepository repository) : IFeedbackService
{
    public async Task<IReadOnlyCollection<FeedbackEntryResponse>> GetRecentAsync(CancellationToken cancellationToken)
    {
        var entries = await repository.GetRecentAsync(cancellationToken);
        return entries.Select(ToResponse).ToArray();
    }

    public async Task<FeedbackEntryResponse> CreateAsync(FeedbackEntryRequest request, CancellationToken cancellationToken)
    {
        var entry = new FeedbackEntry
        {
            UserProfileId = request.UserProfileId,
            Type = request.Type,
            Title = request.Title.Trim(),
            Description = request.Description.Trim(),
            ContactEmail = request.ContactEmail.Trim(),
            Status = "New"
        };

        var saved = await repository.AddAsync(entry, cancellationToken);
        return ToResponse(saved);
    }

    private static FeedbackEntryResponse ToResponse(FeedbackEntry entry) => new(
        entry.Id,
        entry.UserProfileId,
        entry.Type,
        entry.Title,
        entry.Description,
        entry.ContactEmail,
        entry.Status,
        entry.CreatedAtUtc);
}