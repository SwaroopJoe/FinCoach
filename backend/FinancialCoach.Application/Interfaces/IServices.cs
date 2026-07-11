using FinancialCoach.Application.DTOs;

namespace FinancialCoach.Application.Interfaces;

public interface IAuthPlaceholderService
{
    Task<AuthLoginResponse?> RegisterAsync(AuthUsernameRequest request, CancellationToken cancellationToken);
    Task<AuthLoginResponse?> LoginAsync(AuthUsernameRequest request, CancellationToken cancellationToken);
}

public interface IUserProfileService
{
    Task<UserProfileResponse?> GetDefaultAsync(CancellationToken cancellationToken);
    Task<UserProfileResponse> UpsertAsync(UserProfileRequest request, CancellationToken cancellationToken);
}

public interface IMonthlyPlanningService
{
    Task<MonthlyPlanResponse?> GetCurrentAsync(Guid userProfileId, CancellationToken cancellationToken);
    Task<MonthlyPlanResponse?> GetByMonthAsync(Guid userProfileId, DateTime planMonth, CancellationToken cancellationToken);
    Task<MonthlyPlanResponse> UpsertAsync(MonthlyPlanRequest request, CancellationToken cancellationToken);
    Task<bool> ResetCurrentAsync(Guid userProfileId, CancellationToken cancellationToken);
    Task<bool> ResetByMonthAsync(Guid userProfileId, DateTime planMonth, CancellationToken cancellationToken);
}

public interface IDashboardService
{
    Task<DashboardSummaryResponse> GetSummaryAsync(Guid userProfileId, CancellationToken cancellationToken);
    Task<DashboardSummaryResponse> GetSummaryAsync(Guid userProfileId, DateTime planMonth, CancellationToken cancellationToken);
}

public interface IInvestmentService
{
    Task<InvestmentSummaryResponse> GetSummaryAsync(Guid userProfileId, CancellationToken cancellationToken);
    Task<InvestmentHoldingResponse> CreateAsync(InvestmentHoldingRequest request, CancellationToken cancellationToken);
    Task<InvestmentHoldingResponse?> UpdateAsync(Guid id, InvestmentHoldingRequest request, CancellationToken cancellationToken);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken);
    Task<InvestmentContributionResponse?> AddContributionAsync(Guid holdingId, InvestmentContributionRequest request, CancellationToken cancellationToken);
}

public interface IGoalService
{
    Task<IReadOnlyCollection<FinancialGoalResponse>> GetAllAsync(Guid userProfileId, CancellationToken cancellationToken);
    Task<FinancialGoalResponse> CreateAsync(FinancialGoalRequest request, CancellationToken cancellationToken);
    Task<FinancialGoalResponse?> UpdateAsync(Guid id, FinancialGoalRequest request, CancellationToken cancellationToken);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken);
    Task<GoalContributionResponse?> AddContributionAsync(Guid goalId, GoalContributionRequest request, CancellationToken cancellationToken);
}