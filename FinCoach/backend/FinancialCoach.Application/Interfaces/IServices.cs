using FinancialCoach.Application.DTOs;

namespace FinancialCoach.Application.Interfaces;

public interface IAuthPlaceholderService
{
    AuthLoginResponse Login(AuthLoginRequest request);
}

public interface IUserProfileService
{
    Task<UserProfileResponse?> GetDefaultAsync(CancellationToken cancellationToken);
    Task<UserProfileResponse> UpsertAsync(UserProfileRequest request, CancellationToken cancellationToken);
}

public interface IMonthlyPlanningService
{
    Task<MonthlyPlanResponse?> GetCurrentAsync(Guid userProfileId, CancellationToken cancellationToken);
    Task<MonthlyPlanResponse> UpsertAsync(MonthlyPlanRequest request, CancellationToken cancellationToken);
}

public interface IDashboardService
{
    Task<DashboardSummaryResponse> GetSummaryAsync(Guid userProfileId, CancellationToken cancellationToken);
}