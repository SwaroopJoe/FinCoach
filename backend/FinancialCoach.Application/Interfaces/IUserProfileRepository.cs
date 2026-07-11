using FinancialCoach.Domain.Entities;

namespace FinancialCoach.Application.Interfaces;

public interface IUserProfileRepository
{
    Task<UserProfile?> GetAsync(Guid id, CancellationToken cancellationToken);
    Task<UserProfile?> GetDefaultAsync(CancellationToken cancellationToken);
    Task<UserProfile> UpsertAsync(UserProfile profile, CancellationToken cancellationToken);
}