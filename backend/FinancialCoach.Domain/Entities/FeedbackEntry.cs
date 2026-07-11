using FinancialCoach.Domain.Common;
using FinancialCoach.Domain.Enums;

namespace FinancialCoach.Domain.Entities;

public sealed class FeedbackEntry : BaseEntity
{
    public Guid? UserProfileId { get; set; }
    public FeedbackEntryType Type { get; set; } = FeedbackEntryType.Contribute;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ContactEmail { get; set; } = string.Empty;
    public string Status { get; set; } = "New";
    public UserProfile? UserProfile { get; set; }
}