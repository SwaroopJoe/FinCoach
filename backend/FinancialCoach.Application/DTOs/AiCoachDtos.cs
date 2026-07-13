namespace FinancialCoach.Application.DTOs;

public sealed record AiCoachRequest(Guid UserProfileId, int? Year = null, int? Month = null, string? Question = null);

public sealed record AiCoachResponse(
    string Headline,
    string Summary,
    DateTime GeneratedAtUtc,
    string SourceSnapshotMonth,
    bool IsAiGenerated,
    IReadOnlyCollection<AiCoachItemResponse> Insights,
    IReadOnlyCollection<AiCoachItemResponse> ActionItems,
    IReadOnlyCollection<AiCoachItemResponse> RiskWarnings);

public sealed record AiCoachItemResponse(
    string Title,
    string Message,
    string Priority,
    string Category,
    string? RecommendedAction = null,
    IReadOnlyCollection<AiCoachPatchResponse>? Patches = null);

public sealed record AiCoachPatchResponse(
    string Operation,
    string Section,
    string? MatchName,
    string? MatchCategory,
    string? Field,
    decimal? CurrentValue,
    decimal? SuggestedValue,
    decimal? AmountDelta,
    string Reason,
    string? Name = null,
    string? Category = null);
