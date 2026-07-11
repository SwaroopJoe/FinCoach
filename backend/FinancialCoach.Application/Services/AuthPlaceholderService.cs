using FinancialCoach.Application.DTOs;
using FinancialCoach.Application.Interfaces;
using FinancialCoach.Domain.Entities;

namespace FinancialCoach.Application.Services;

public sealed class AuthPlaceholderService(IAppUserRepository appUserRepository) : IAuthPlaceholderService
{
    public async Task<AuthLoginResponse?> RegisterAsync(AuthUsernameRequest request, CancellationToken cancellationToken)
    {
        var username = request.Username.Trim();
        var normalizedUsername = NormalizeUsername(username);
        var existingUser = await appUserRepository.GetByNormalizedUsernameAsync(normalizedUsername, cancellationToken);

        if (existingUser is not null)
        {
            return null;
        }

        var user = await appUserRepository.AddAsync(new AppUser
        {
            Username = username,
            NormalizedUsername = normalizedUsername,
            LastSignedInAtUtc = DateTime.UtcNow
        }, cancellationToken);

        return CreateResponse(user, "Username created.");
    }

    public async Task<AuthLoginResponse?> LoginAsync(AuthUsernameRequest request, CancellationToken cancellationToken)
    {
        var username = request.Username.Trim();
        var user = await appUserRepository.GetByNormalizedUsernameAsync(NormalizeUsername(username), cancellationToken);

        if (user is null)
        {
            return null;
        }

        user.LastSignedInAtUtc = DateTime.UtcNow;
        user.UpdatedAtUtc = DateTime.UtcNow;
        user.SyncVersion++;
        await appUserRepository.UpdateAsync(user, cancellationToken);

        return CreateResponse(user, "Signed in.");
    }

    private static AuthLoginResponse CreateResponse(AppUser user, string message)
    {
        var token = Convert.ToBase64String(Guid.NewGuid().ToByteArray());
        return new AuthLoginResponse(user.Id, user.Username, token, DateTime.UtcNow.AddHours(8), message);
    }

    private static string NormalizeUsername(string username) => username.Trim().ToUpperInvariant();
}
