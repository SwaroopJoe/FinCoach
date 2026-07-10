using FinancialCoach.Application.Interfaces;
using FinancialCoach.Infrastructure.Persistence;
using FinancialCoach.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace FinancialCoach.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection") ?? "Data Source=financialcoach.db";

        services.AddDbContext<FinancialCoachDbContext>(options => options.UseSqlite(connectionString));
        services.AddScoped<IUserProfileRepository, UserProfileRepository>();
        services.AddScoped<IMonthlyPlanRepository, MonthlyPlanRepository>();

        return services;
    }
}