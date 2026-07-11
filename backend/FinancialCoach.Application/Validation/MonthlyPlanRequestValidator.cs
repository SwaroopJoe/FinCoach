using FinancialCoach.Application.DTOs;
using FluentValidation;

namespace FinancialCoach.Application.Validation;

public sealed class MonthlyPlanRequestValidator : AbstractValidator<MonthlyPlanRequest>
{
    public MonthlyPlanRequestValidator()
    {
        RuleFor(request => request.UserProfileId).NotEmpty();
        RuleForEach(request => request.IncomeItems).SetValidator(new MoneyLineItemRequestValidator());
        RuleForEach(request => request.RecurringExpenses).SetValidator(new MoneyLineItemRequestValidator());
        RuleForEach(request => request.Investments).SetValidator(new MoneyLineItemRequestValidator());
        RuleForEach(request => request.VariableBudgets).ChildRules(budget =>
        {
            budget.RuleFor(item => item.Category).NotEmpty().MaximumLength(80);
            budget.RuleFor(item => item.BudgetAmount).GreaterThanOrEqualTo(0);
            budget.RuleFor(item => item.SpentAmount).GreaterThanOrEqualTo(0);
        });
    }
}

public sealed class MoneyLineItemRequestValidator : AbstractValidator<MoneyLineItemRequest>
{
    public MoneyLineItemRequestValidator()
    {
        RuleFor(item => item.Name).NotEmpty().MaximumLength(80);
        RuleFor(item => item.Amount).GreaterThanOrEqualTo(0);
    }
}