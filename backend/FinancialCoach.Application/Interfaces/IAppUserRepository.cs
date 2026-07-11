using FinancialCoach.Domain.Entities;

namespace FinancialCoach.Application.Interfaces;

public interface IAppUserRepository
{
    Task<AppUser?> GetByNormalizedUsernameAsync(string normalizedUsername, CancellationToken cancellationToken);
    Task<AppUser> AddAsync(AppUser user, CancellationToken cancellationToken);
    Task<AppUser> UpdateAsync(AppUser user, CancellationToken cancellationToken);
}