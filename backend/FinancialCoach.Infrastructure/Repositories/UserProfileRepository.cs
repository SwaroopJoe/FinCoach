using FinancialCoach.Application.Interfaces;
using FinancialCoach.Domain.Entities;
using FinancialCoach.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace FinancialCoach.Infrastructure.Repositories;

public sealed class UserProfileRepository(FinancialCoachDbContext dbContext) : IUserProfileRepository
{
    public Task<UserProfile?> GetAsync(Guid id, CancellationToken cancellationToken) =>
        dbContext.UserProfiles.FirstOrDefaultAsync(profile => profile.Id == id, cancellationToken);

    public Task<UserProfile?> GetDefaultAsync(CancellationToken cancellationToken) =>
        dbContext.UserProfiles.OrderBy(profile => profile.CreatedAtUtc).FirstOrDefaultAsync(cancellationToken);

    public Task<UserProfile?> GetByAppUserIdAsync(Guid appUserId, CancellationToken cancellationToken) =>
        dbContext.UserProfiles.FirstOrDefaultAsync(profile => profile.AppUserId == appUserId, cancellationToken);

    public async Task<UserProfile> UpsertAsync(UserProfile profile, CancellationToken cancellationToken)
    {
        if (dbContext.Entry(profile).State == EntityState.Detached)
        {
            var exists = await dbContext.UserProfiles.AnyAsync(item => item.Id == profile.Id, cancellationToken);
            dbContext.Entry(profile).State = exists ? EntityState.Modified : EntityState.Added;
        }

        profile.SyncVersion++;
        await dbContext.SaveChangesAsync(cancellationToken);
        return profile;
    }
}