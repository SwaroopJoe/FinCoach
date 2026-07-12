using FinancialCoach.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace FinancialCoach.Infrastructure.Persistence;

public sealed class FinancialCoachDbContext(DbContextOptions<FinancialCoachDbContext> options) : DbContext(options)
{
    public DbSet<AppUser> AppUsers => Set<AppUser>();
    public DbSet<UserProfile> UserProfiles => Set<UserProfile>();
    public DbSet<MonthlyPlan> MonthlyPlans => Set<MonthlyPlan>();
    public DbSet<IncomeItem> IncomeItems => Set<IncomeItem>();
    public DbSet<RecurringExpense> RecurringExpenses => Set<RecurringExpense>();
    public DbSet<InvestmentAllocation> InvestmentAllocations => Set<InvestmentAllocation>();
    public DbSet<VariableBudget> VariableBudgets => Set<VariableBudget>();
    public DbSet<BorrowingShortage> BorrowingShortages => Set<BorrowingShortage>();
    public DbSet<Expense> Expenses => Set<Expense>();
    public DbSet<BudgetVersion> BudgetVersions => Set<BudgetVersion>();
    public DbSet<InvestmentHolding> InvestmentHoldings => Set<InvestmentHolding>();
    public DbSet<InvestmentContribution> InvestmentContributions => Set<InvestmentContribution>();
    public DbSet<FinancialGoal> FinancialGoals => Set<FinancialGoal>();
    public DbSet<GoalContribution> GoalContributions => Set<GoalContribution>();
    public DbSet<FeedbackEntry> FeedbackEntries => Set<FeedbackEntry>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AppUser>(entity =>
        {
            entity.HasIndex(item => item.NormalizedUsername).IsUnique();
            entity.Property(item => item.Username).HasMaxLength(80).IsRequired();
            entity.Property(item => item.NormalizedUsername).HasMaxLength(80).IsRequired();
        });

        modelBuilder.Entity<UserProfile>(entity =>
        {
            entity.HasIndex(item => item.AppUserId).IsUnique();
            entity.Property(item => item.Name).HasMaxLength(120).IsRequired();
            entity.Property(item => item.Salary).HasPrecision(18, 2);
            entity.Property(item => item.NotificationTimes).HasMaxLength(120);
            entity.Property(item => item.FinancialPreferences).HasMaxLength(600);
            entity.HasOne(item => item.AppUser).WithMany().HasForeignKey(item => item.AppUserId).OnDelete(DeleteBehavior.SetNull);
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

        modelBuilder.Entity<BorrowingShortage>(entity =>
        {
            entity.Property(item => item.Name).HasMaxLength(100).IsRequired();
            entity.Property(item => item.Amount).HasPrecision(18, 2);
            entity.Property(item => item.Reason).HasMaxLength(220);
            entity.HasOne(item => item.MonthlyPlan).WithMany(plan => plan.BorrowingShortages).HasForeignKey(item => item.MonthlyPlanId).OnDelete(DeleteBehavior.Cascade);
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

        modelBuilder.Entity<InvestmentHolding>(entity =>
        {
            entity.HasIndex(item => item.UserProfileId);
            entity.Property(item => item.Name).HasMaxLength(120).IsRequired();
            entity.Property(item => item.CustomCategory).HasMaxLength(80);
            entity.Property(item => item.Quantity).HasPrecision(18, 4);
            entity.Property(item => item.AverageCost).HasPrecision(18, 2);
            entity.Property(item => item.CurrentRate).HasPrecision(18, 2);
            entity.Property(item => item.ExpectedAnnualReturnPercent).HasPrecision(6, 2);
            entity.Property(item => item.TenureYears).HasDefaultValue(5);
            entity.Property(item => item.Notes).HasMaxLength(400);
            entity.HasOne(item => item.UserProfile).WithMany().HasForeignKey(item => item.UserProfileId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<InvestmentContribution>(entity =>
        {
            entity.HasIndex(item => new { item.UserProfileId, item.ContributionMonth });
            entity.Property(item => item.Amount).HasPrecision(18, 2);
            entity.Property(item => item.QuantityAdded).HasPrecision(18, 4);
            entity.Property(item => item.RateAtContribution).HasPrecision(18, 2);
            entity.Property(item => item.Description).HasMaxLength(160);
            entity.HasOne(item => item.UserProfile).WithMany().HasForeignKey(item => item.UserProfileId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(item => item.InvestmentHolding).WithMany(holding => holding.Contributions).HasForeignKey(item => item.InvestmentHoldingId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<FinancialGoal>(entity =>
        {
            entity.HasIndex(item => item.UserProfileId);
            entity.Property(item => item.Name).HasMaxLength(120).IsRequired();
            entity.Property(item => item.CustomCategory).HasMaxLength(80);
            entity.Property(item => item.TargetAmount).HasPrecision(18, 2);
            entity.Property(item => item.StartingAmount).HasPrecision(18, 2);
            entity.Property(item => item.Notes).HasMaxLength(400);
            entity.HasOne(item => item.UserProfile).WithMany().HasForeignKey(item => item.UserProfileId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<GoalContribution>(entity =>
        {
            entity.HasIndex(item => new { item.FinancialGoalId, item.ContributionMonth });
            entity.Property(item => item.Amount).HasPrecision(18, 2);
            entity.Property(item => item.Description).HasMaxLength(160);
            entity.HasOne(item => item.FinancialGoal).WithMany(goal => goal.Contributions).HasForeignKey(item => item.FinancialGoalId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<FeedbackEntry>(entity =>
        {
            entity.HasIndex(item => item.CreatedAtUtc);
            entity.Property(item => item.Title).HasMaxLength(140).IsRequired();
            entity.Property(item => item.Description).HasMaxLength(2000).IsRequired();
            entity.Property(item => item.ContactEmail).HasMaxLength(180);
            entity.Property(item => item.Status).HasMaxLength(40).IsRequired();
            entity.HasOne(item => item.UserProfile).WithMany().HasForeignKey(item => item.UserProfileId).OnDelete(DeleteBehavior.SetNull);
        });
    }
}