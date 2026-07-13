using FinancialCoach.Application.Interfaces;
using FinancialCoach.Application.Services;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

namespace FinancialCoach.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddValidatorsFromAssembly(typeof(DependencyInjection).Assembly);
        services.AddScoped<IAuthPlaceholderService, AuthPlaceholderService>();
        services.AddScoped<IUserProfileService, UserProfileService>();
        services.AddScoped<IMonthlyPlanningService, MonthlyPlanningService>();
        services.AddScoped<IDashboardService, DashboardService>();
        services.AddScoped<IInvestmentService, InvestmentService>();
        services.AddScoped<IGoalService, GoalService>();
        services.AddScoped<IFeedbackService, FeedbackService>();
        services.AddHttpClient<IAiCoachService, AiCoachService>();

        return services;
    }
}