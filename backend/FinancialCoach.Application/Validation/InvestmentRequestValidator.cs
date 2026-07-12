using FinancialCoach.Application.DTOs;
using FinancialCoach.Domain.Enums;
using FluentValidation;

namespace FinancialCoach.Application.Validation;

public sealed class InvestmentHoldingRequestValidator : AbstractValidator<InvestmentHoldingRequest>
{
    public InvestmentHoldingRequestValidator()
    {
        RuleFor(request => request.UserProfileId).NotEmpty();
        RuleFor(request => request.Name).NotEmpty().MaximumLength(120);
        RuleFor(request => request.CustomCategory).MaximumLength(80);
        RuleFor(request => request.CustomCategory).NotEmpty().When(request => request.Category == InvestmentCategory.Custom);
        RuleFor(request => request.Quantity).GreaterThanOrEqualTo(0);
        RuleFor(request => request.AverageCost).GreaterThanOrEqualTo(0);
        RuleFor(request => request.CurrentRate).GreaterThanOrEqualTo(0);
        RuleFor(request => request.ExpectedAnnualReturnPercent).InclusiveBetween(0, 100);
        RuleFor(request => request.TenureYears).InclusiveBetween(1, 50);
        RuleFor(request => request.MonthlyContributionAmount).GreaterThanOrEqualTo(0);
        RuleFor(request => request.Notes).MaximumLength(400);
    }
}

public sealed class InvestmentContributionRequestValidator : AbstractValidator<InvestmentContributionRequest>
{
    public InvestmentContributionRequestValidator()
    {
        RuleFor(request => request.UserProfileId).NotEmpty();
        RuleFor(request => request.Amount).GreaterThan(0);
        RuleFor(request => request.QuantityAdded).GreaterThanOrEqualTo(0);
        RuleFor(request => request.RateAtContribution).GreaterThanOrEqualTo(0);
        RuleFor(request => request.Description).MaximumLength(160);
    }
}