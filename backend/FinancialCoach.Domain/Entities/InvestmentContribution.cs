using FinancialCoach.Domain.Common;

namespace FinancialCoach.Domain.Entities;

public sealed class InvestmentContribution : BaseEntity
{
    public Guid UserProfileId { get; set; }
    public UserProfile? UserProfile { get; set; }
    public Guid InvestmentHoldingId { get; set; }
    public InvestmentHolding? InvestmentHolding { get; set; }
    public Guid? SourceMonthlyPlanId { get; set; }
    public DateTime ContributionMonth { get; set; }
    public decimal Amount { get; set; }
    public decimal QuantityAdded { get; set; }
    public decimal RateAtContribution { get; set; }
    public string Description { get; set; } = string.Empty;
}