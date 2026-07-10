namespace FinancialCoach.Application.DTOs;

public sealed record AuthLoginRequest(string Name);

public sealed record AuthLoginResponse(string AccessToken, DateTime ExpiresAtUtc, string Message);