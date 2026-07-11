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
        var normalizedMonth = new DateTime(planMonth.Year, planMonth.Month, 1, 0, 0, 0, DateTimeKind.Utc);
        return IncludePlan(dbContext.MonthlyPlans).FirstOrDefaultAsync(plan => plan.UserProfileId == userProfileId && plan.PlanMonth == normalizedMonth, cancellationToken);
    }

    public Task<MonthlyPlan?> GetLatestAsync(Guid userProfileId, CancellationToken cancellationToken) =>
        IncludePlan(dbContext.MonthlyPlans)
            .Where(plan => plan.UserProfileId == userProfileId)
            .OrderByDescending(plan => plan.PlanMonth)
            .FirstOrDefaultAsync(cancellationToken);

    public Task<int> GetVersionCountAsync(Guid monthlyPlanId, CancellationToken cancellationToken) =>
        dbContext.BudgetVersions.CountAsync(version => version.MonthlyPlanId == monthlyPlanId, cancellationToken);

    public async Task RemoveChildRowsAsync(MonthlyPlan monthlyPlan, CancellationToken cancellationToken)
    {
        await dbContext.IncomeItems.Where(item => item.MonthlyPlanId == monthlyPlan.Id).ExecuteDeleteAsync(cancellationToken);
        await dbContext.RecurringExpenses.Where(item => item.MonthlyPlanId == monthlyPlan.Id).ExecuteDeleteAsync(cancellationToken);
        await dbContext.InvestmentAllocations.Where(item => item.MonthlyPlanId == monthlyPlan.Id).ExecuteDeleteAsync(cancellationToken);
        await dbContext.VariableBudgets.Where(item => item.MonthlyPlanId == monthlyPlan.Id).ExecuteDeleteAsync(cancellationToken);
        await dbContext.BorrowingShortages.Where(item => item.MonthlyPlanId == monthlyPlan.Id).ExecuteDeleteAsync(cancellationToken);

        foreach (var item in monthlyPlan.IncomeItems)
        {
            dbContext.Entry(item).State = EntityState.Detached;
        }

        foreach (var item in monthlyPlan.RecurringExpenses)
        {
            dbContext.Entry(item).State = EntityState.Detached;
        }

        foreach (var item in monthlyPlan.Investments)
        {
            dbContext.Entry(item).State = EntityState.Detached;
        }

        foreach (var item in monthlyPlan.VariableBudgets)
        {
            dbContext.Entry(item).State = EntityState.Detached;
        }

        foreach (var item in monthlyPlan.BorrowingShortages)
        {
            dbContext.Entry(item).State = EntityState.Detached;
        }
    }

    public async Task DeleteAsync(MonthlyPlan monthlyPlan, CancellationToken cancellationToken)
    {
        await RemoveChildRowsAsync(monthlyPlan, cancellationToken);
        await dbContext.BudgetVersions.Where(version => version.MonthlyPlanId == monthlyPlan.Id).ExecuteDeleteAsync(cancellationToken);
        dbContext.MonthlyPlans.Remove(monthlyPlan);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<MonthlyPlan> UpsertAsync(MonthlyPlan monthlyPlan, CancellationToken cancellationToken)
    {
        if (dbContext.Entry(monthlyPlan).State == EntityState.Detached)
        {
            dbContext.MonthlyPlans.Add(monthlyPlan);
        }

        foreach (var version in monthlyPlan.Versions)
        {
            dbContext.Entry(version).State = EntityState.Added;
        }

        foreach (var item in monthlyPlan.IncomeItems)
        {
            dbContext.Entry(item).State = EntityState.Added;
        }

        foreach (var item in monthlyPlan.RecurringExpenses)
        {
            dbContext.Entry(item).State = EntityState.Added;
        }

        foreach (var item in monthlyPlan.Investments)
        {
            dbContext.Entry(item).State = EntityState.Added;
        }

        foreach (var item in monthlyPlan.VariableBudgets)
        {
            dbContext.Entry(item).State = EntityState.Added;
        }

        foreach (var item in monthlyPlan.BorrowingShortages)
        {
            dbContext.Entry(item).State = EntityState.Added;
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
        .Include(plan => plan.BorrowingShortages);
}