using FinancialCoach.Domain.Enums;

namespace FinancialCoach.Application.DTOs;

public sealed record UserProfileRequest(
    string Name,
    decimal Salary,
    int SalaryCreditDay,
    CurrencyCode PreferredCurrency,
    IReadOnlyCollection<string> NotificationTimes,
    int? FamilySize,
    string FinancialPreferences);

public sealed record UserProfileResponse(
    Guid Id,
    string Name,
    decimal Salary,
    int SalaryCreditDay,
    CurrencyCode PreferredCurrency,
    IReadOnlyCollection<string> NotificationTimes,
    int? FamilySize,
    string FinancialPreferences);