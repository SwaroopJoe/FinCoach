using FinancialCoach.Application.DTOs;
using FinancialCoach.Domain.Enums;
using FluentValidation;

namespace FinancialCoach.Application.Validation;

public sealed class FinancialGoalRequestValidator : AbstractValidator<FinancialGoalRequest>
{
    public FinancialGoalRequestValidator()
    {
        RuleFor(request => request.UserProfileId).NotEmpty();
        RuleFor(request => request.Name).NotEmpty().MaximumLength(120);
        RuleFor(request => request.CustomCategory).MaximumLength(80);
        RuleFor(request => request.CustomCategory).NotEmpty().When(request => request.Category == GoalCategory.Custom);
        RuleFor(request => request.TargetAmount).GreaterThan(0);
        RuleFor(request => request.StartingAmount).GreaterThanOrEqualTo(0);
        RuleFor(request => request.Notes).MaximumLength(400);
    }
}

public sealed class GoalContributionRequestValidator : AbstractValidator<GoalContributionRequest>
{
    public GoalContributionRequestValidator()
    {
        RuleFor(request => request.Amount).GreaterThan(0);
        RuleFor(request => request.Description).MaximumLength(160);
    }
}