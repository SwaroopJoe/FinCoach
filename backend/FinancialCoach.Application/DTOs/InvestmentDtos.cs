using FinancialCoach.Domain.Enums;

namespace FinancialCoach.Application.DTOs;

public sealed record InvestmentHoldingRequest(
    Guid UserProfileId,
    string Name,
    InvestmentCategory Category,
    string CustomCategory,
    decimal Quantity,
    decimal AverageCost,
    decimal CurrentRate,
    decimal ExpectedAnnualReturnPercent,
    int TenureYears,
    decimal MonthlyContributionAmount,
    string Notes);

public sealed record InvestmentContributionRequest(
    Guid UserProfileId,
    DateTime ContributionMonth,
    decimal Amount,
    decimal QuantityAdded,
    decimal RateAtContribution,
    string Description);

public sealed record InvestmentHoldingResponse(
    Guid Id,
    Guid UserProfileId,
    string Name,
    InvestmentCategory Category,
    string CustomCategory,
    decimal Quantity,
    decimal AverageCost,
    decimal CurrentRate,
    decimal ExpectedAnnualReturnPercent,
    int TenureYears,
    decimal MonthlyContributionAmount,
    string Notes,
    decimal InvestedAmount,
    decimal CurrentValue,
    decimal GainLoss,
    decimal GainLossPercent,
    decimal ProjectedValueOneYear,
    decimal ProjectedValueThreeYears,
    decimal ProjectedValueFiveYears,
    decimal ProjectedMaturityValue,
    InvestmentContributionResponse[] Contributions);

public sealed record InvestmentContributionResponse(
    Guid Id,
    Guid InvestmentHoldingId,
    DateTime ContributionMonth,
    decimal Amount,
    decimal QuantityAdded,
    decimal RateAtContribution,
    string Description);

public sealed record InvestmentSummaryResponse(
    Guid UserProfileId,
    decimal TotalInvested,
    decimal TotalCurrentValue,
    decimal TotalGainLoss,
    decimal TotalGainLossPercent,
    InvestmentHoldingResponse[] Holdings);