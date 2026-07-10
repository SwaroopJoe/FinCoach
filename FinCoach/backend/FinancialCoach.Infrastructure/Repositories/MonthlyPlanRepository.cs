using FinancialCoach.Application.Interfaces;
using FinancialCoach.Domain.Entities;
using FinancialCoach.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace FinancialCoach.Infrastructure.Repositories;

public sealed class MonthlyPlanRepository(FinancialCoachDbContext dbContext) : IMonthlyPlanRepository
{
    public Task<MonthlyPlan?> GetByIdAsync(Guid id, CancellationToken cancellationToken) =>
        IncludePlan(dbContext.MonthlyPlans).FirstOrDefaultAsync(plan => plan.Id == id, cancellationToken);

    public Task<MonthlyPlan?> GetByMonthAsync(Guid userProfileId, DateTime planMonth, CancellationToken cancellationToken)
    {
        var normalizedMonth = new DateTime(planMonth.Year, planMonth.Month, 1);
        return IncludePlan(dbContext.MonthlyPlans).FirstOrDefaultAsync(plan => plan.UserProfileId == userProfileId && plan.PlanMonth == normalizedMonth, cancellationToken);
    }

    public Task<MonthlyPlan?> GetLatestAsync(Guid userProfileId, CancellationToken cancellationToken) =>
        IncludePlan(dbContext.MonthlyPlans)
            .Where(plan => plan.UserProfileId == userProfileId)
            .OrderByDescending(plan => plan.PlanMonth)
            .FirstOrDefaultAsync(cancellationToken);

    public async Task<MonthlyPlan> UpsertAsync(MonthlyPlan monthlyPlan, CancellationToken cancellationToken)
    {
        if (dbContext.Entry(monthlyPlan).State == EntityState.Detached)
        {
            dbContext.MonthlyPlans.Add(monthlyPlan);
        }

        monthlyPlan.SyncVersion++;
        await dbContext.SaveChangesAsync(cancellationToken);
        return monthlyPlan;
    }

    private static IQueryable<MonthlyPlan> IncludePlan(IQueryable<MonthlyPlan> query) => query
        .Include(plan => plan.IncomeItems)
        .Include(plan => plan.RecurringExpenses)
        .Include(plan => plan.Investments)
        .Include(plan => plan.VariableBudgets)
        .Include(plan => plan.Versions);
}