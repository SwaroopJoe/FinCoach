using FinancialCoach.Domain.Common;
using FinancialCoach.Domain.Enums;

namespace FinancialCoach.Domain.Entities;

public sealed class UserProfile : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public decimal Salary { get; set; }
    public int SalaryCreditDay { get; set; } = 1;
    public CurrencyCode PreferredCurrency { get; set; } = CurrencyCode.INR;
    public string NotificationTimes { get; set; } = "12:00,14:00,19:00";
    public int? FamilySize { get; set; }
    public string FinancialPreferences { get; set; } = string.Empty;
}