namespace FinancialCoach.Application.DTOs;

public sealed record AuthUsernameRequest(string Username);

public sealed record AuthLoginResponse(Guid UserId, string Username, string AccessToken, DateTime ExpiresAtUtc, string Message);