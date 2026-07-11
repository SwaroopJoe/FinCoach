using FinancialCoach.Domain.Common;
using FinancialCoach.Domain.Enums;

namespace FinancialCoach.Domain.Entities;

public sealed class InvestmentHolding : BaseEntity
{
    public Guid UserProfileId { get; set; }
    public UserProfile? UserProfile { get; set; }
    public string Name { get; set; } = string.Empty;
    public InvestmentCategory Category { get; set; } = InvestmentCategory.Custom;
    public string CustomCategory { get; set; } = string.Empty;
    public decimal Quantity { get; set; }
    public decimal AverageCost { get; set; }
    public decimal CurrentRate { get; set; }
    public decimal ExpectedAnnualReturnPercent { get; set; }
    public string Notes { get; set; } = string.Empty;
    public List<InvestmentContribution> Contributions { get; set; } = [];

    public decimal InvestedAmount => Contributions.Count == 0 ? Quantity * AverageCost : Contributions.Sum(item => item.Amount);
    public decimal CurrentValue => Quantity > 0 && CurrentRate > 0 ? Quantity * CurrentRate : InvestedAmount;
    public decimal GainLoss => CurrentValue - InvestedAmount;
    public decimal GainLossPercent => InvestedAmount == 0 ? 0 : Math.Round((GainLoss / InvestedAmount) * 100, 2);
}