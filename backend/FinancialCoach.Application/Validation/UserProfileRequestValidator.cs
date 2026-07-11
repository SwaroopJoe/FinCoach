using FinancialCoach.Application.DTOs;
using FluentValidation;

namespace FinancialCoach.Application.Validation;

public sealed class UserProfileRequestValidator : AbstractValidator<UserProfileRequest>
{
    public UserProfileRequestValidator()
    {
        RuleFor(request => request.Name).NotEmpty().MaximumLength(120);
        RuleFor(request => request.Salary).GreaterThanOrEqualTo(0);
        RuleFor(request => request.SalaryCreditDay).InclusiveBetween(1, 31);
        RuleFor(request => request.NotificationTimes).NotEmpty();
        RuleFor(request => request.FamilySize).GreaterThan(0).When(request => request.FamilySize.HasValue);
        RuleFor(request => request.FinancialPreferences).MaximumLength(600);
    }
}