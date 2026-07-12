using FinancialCoach.Application.DTOs;
using FinancialCoach.Application.Interfaces;
using FinancialCoach.Domain.Entities;

namespace FinancialCoach.Application.Services;

public sealed class UserProfileService(IUserProfileRepository repository) : IUserProfileService
{
    public async Task<UserProfileResponse?> GetByAppUserIdAsync(Guid appUserId, CancellationToken cancellationToken)
    {
        var profile = await repository.GetByAppUserIdAsync(appUserId, cancellationToken);
        return profile?.ToResponse();
    }

    public async Task<UserProfileResponse> UpsertAsync(Guid appUserId, UserProfileRequest request, CancellationToken cancellationToken)
    {
        var existing = await repository.GetByAppUserIdAsync(appUserId, cancellationToken);
        var profile = existing ?? new UserProfile();

        profile.AppUserId = appUserId;
        profile.Name = request.Name.Trim();
        profile.Salary = request.Salary;
        profile.SalaryCreditDay = request.SalaryCreditDay;
        profile.PreferredCurrency = request.PreferredCurrency;
        profile.NotificationTimes = string.Join(',', request.NotificationTimes.Where(time => !string.IsNullOrWhiteSpace(time)).Select(time => time.Trim()));
        profile.FamilySize = request.FamilySize;
        profile.FinancialPreferences = request.FinancialPreferences.Trim();
        profile.UpdatedAtUtc = DateTime.UtcNow;

        var saved = await repository.UpsertAsync(profile, cancellationToken);
        return saved.ToResponse();
    }
}