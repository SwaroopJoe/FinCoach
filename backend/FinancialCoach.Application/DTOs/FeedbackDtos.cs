using FinancialCoach.Domain.Enums;

namespace FinancialCoach.Application.DTOs;

public sealed record FeedbackEntryRequest(
    Guid? UserProfileId,
    FeedbackEntryType Type,
    string Title,
    string Description,
    string ContactEmail);

public sealed record FeedbackEntryResponse(
    Guid Id,
    Guid? UserProfileId,
    FeedbackEntryType Type,
    string Title,
    string Description,
    string ContactEmail,
    string Status,
    DateTime CreatedAtUtc);