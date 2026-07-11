using FinancialCoach.Application.Interfaces;
using FinancialCoach.Domain.Entities;
using FinancialCoach.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace FinancialCoach.Infrastructure.Repositories;

public sealed class AppUserRepository(FinancialCoachDbContext dbContext) : IAppUserRepository
{
    public Task<AppUser?> GetByNormalizedUsernameAsync(string normalizedUsername, CancellationToken cancellationToken) =>
        dbContext.AppUsers.FirstOrDefaultAsync(user => user.NormalizedUsername == normalizedUsername, cancellationToken);

    public async Task<AppUser> AddAsync(AppUser user, CancellationToken cancellationToken)
    {
        dbContext.AppUsers.Add(user);
        await dbContext.SaveChangesAsync(cancellationToken);
        return user;
    }

    public async Task<AppUser> UpdateAsync(AppUser user, CancellationToken cancellationToken)
    {
        await dbContext.SaveChangesAsync(cancellationToken);
        return user;
    }
}