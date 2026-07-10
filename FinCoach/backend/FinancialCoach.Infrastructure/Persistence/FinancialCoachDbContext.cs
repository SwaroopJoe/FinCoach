using FinancialCoach.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace FinancialCoach.Infrastructure.Persistence;

public sealed class FinancialCoachDbContext(DbContextOptions<FinancialCoachDbContext> options) : DbContext(options)
{
    public DbSet<UserProfile> UserProfiles => Set<UserProfile>();
    public DbSet<MonthlyPlan> MonthlyPlans => Set<MonthlyPlan>();
    public DbSet<IncomeItem> IncomeItems => Set<IncomeItem>();
    public DbSet<RecurringExpense> RecurringExpenses => Set<RecurringExpense>();
    public DbSet<InvestmentAllocation> InvestmentAllocations => Set<InvestmentAllocation>();
    public DbSet<VariableBudget> VariableBudgets => Set<VariableBudget>();
    public DbSet<Expense> Expenses => Set<Expense>();
    public DbSet<BudgetVersion> BudgetVersions => Set<BudgetVersion>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserProfile>(entity =>
        {
            entity.Property(item => item.Name).HasMaxLength(120).IsRequired();
            entity.Property(item => item.Salary).HasPrecision(18, 2);
            entity.Property(item => item.NotificationTimes).HasMaxLength(120);
            entity.Property(item => item.FinancialPreferences).HasMaxLength(600);
        });

        modelBuilder.Entity<MonthlyPlan>(entity =>
        {
            entity.HasIndex(item => new { item.UserProfileId, item.PlanMonth }).IsUnique();
            entity.HasOne(item => item.UserProfile).WithMany().HasForeignKey(item => item.UserProfileId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<IncomeItem>(entity =>
        {
            entity.Property(item => item.Name).HasMaxLength(80).IsRequired();
            entity.Property(item => item.Amount).HasPrecision(18, 2);
            entity.HasOne(item => item.MonthlyPlan).WithMany(plan => plan.IncomeItems).HasForeignKey(item => item.MonthlyPlanId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<RecurringExpense>(entity =>
        {
            entity.Property(item => item.Category).HasMaxLength(80).IsRequired();
            entity.Property(item => item.Amount).HasPrecision(18, 2);
            entity.HasOne(item => item.MonthlyPlan).WithMany(plan => plan.RecurringExpenses).HasForeignKey(item => item.MonthlyPlanId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<InvestmentAllocation>(entity =>
        {
            entity.Property(item => item.Category).HasMaxLength(80).IsRequired();
            entity.Property(item => item.Amount).HasPrecision(18, 2);
            entity.HasOne(item => item.MonthlyPlan).WithMany(plan => plan.Investments).HasForeignKey(item => item.MonthlyPlanId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<VariableBudget>(entity =>
        {
            entity.Property(item => item.Category).HasMaxLength(80).IsRequired();
            entity.Property(item => item.BudgetAmount).HasPrecision(18, 2);
            entity.Property(item => item.SpentAmount).HasPrecision(18, 2);
            entity.HasOne(item => item.MonthlyPlan).WithMany(plan => plan.VariableBudgets).HasForeignKey(item => item.MonthlyPlanId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Expense>(entity =>
        {
            entity.Property(item => item.Amount).HasPrecision(18, 2);
            entity.Property(item => item.Category).HasMaxLength(80).IsRequired();
            entity.Property(item => item.Description).HasMaxLength(300);
            entity.HasOne(item => item.UserProfile).WithMany().HasForeignKey(item => item.UserProfileId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<BudgetVersion>(entity =>
        {
            entity.Property(item => item.Reason).HasMaxLength(160).IsRequired();
            entity.HasOne(item => item.MonthlyPlan).WithMany(plan => plan.Versions).HasForeignKey(item => item.MonthlyPlanId).OnDelete(DeleteBehavior.Cascade);
        });
    }
}