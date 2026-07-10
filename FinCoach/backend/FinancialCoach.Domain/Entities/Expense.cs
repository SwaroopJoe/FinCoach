using FinancialCoach.Domain.Common;
using FinancialCoach.Domain.Enums;

namespace FinancialCoach.Domain.Entities;

public sealed class Expense : BaseEntity
{
    public Guid UserProfileId { get; set; }
    public UserProfile? UserProfile { get; set; }
    public decimal Amount { get; set; }
    public string Category { get; set; } = string.Empty;
    public DateTime ExpenseDate { get; set; }
    public string Description { get; set; } = string.Empty;
    public PaymentMethod PaymentMethod { get; set; }
    public ExpenseType ExpenseType { get; set; }
}