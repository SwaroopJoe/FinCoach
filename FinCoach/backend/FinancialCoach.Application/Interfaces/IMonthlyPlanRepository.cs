using FinancialCoach.Domain.Entities;

namespace FinancialCoach.Application.Interfaces;

public interface IMonthlyPlanRepository
{
    Task<MonthlyPlan?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<MonthlyPlan?> GetByMonthAsync(Guid userProfileId, DateTime planMonth, CancellationToken cancellationToken);
    Task<MonthlyPlan?> GetLatestAsync(Guid userProfileId, CancellationToken cancellationToken);
    Task<MonthlyPlan> UpsertAsync(MonthlyPlan monthlyPlan, CancellationToken cancellationToken);
}