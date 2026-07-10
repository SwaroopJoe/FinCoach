using FinancialCoach.Application.DTOs;
using FinancialCoach.Application.Interfaces;

namespace FinancialCoach.Application.Services;

public sealed class AuthPlaceholderService : IAuthPlaceholderService
{
    public AuthLoginResponse Login(AuthLoginRequest request)
    {
        var name = string.IsNullOrWhiteSpace(request.Name) ? "Financial Coach User" : request.Name.Trim();
        var token = Convert.ToBase64String(Guid.NewGuid().ToByteArray());

        return new AuthLoginResponse(token, DateTime.UtcNow.AddHours(8), $"Welcome, {name}. Authentication is running in local placeholder mode.");
    }
}