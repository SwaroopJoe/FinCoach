using FinancialCoach.Domain.Common;

namespace FinancialCoach.Domain.Entities;

public sealed class AppUser : BaseEntity
{
    public string Username { get; set; } = string.Empty;
    public string NormalizedUsername { get; set; } = string.Empty;
    public DateTime? LastSignedInAtUtc { get; set; }
}