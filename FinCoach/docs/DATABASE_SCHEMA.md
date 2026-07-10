# Database Schema

The MVP uses SQLite through EF Core. The initial migration is in `backend/FinancialCoach.Infrastructure/Persistence/Migrations`.

## Tables

- `UserProfiles`: name, salary, salary credit day, preferred currency, notification times, optional family size, and financial preferences.
- `MonthlyPlans`: user profile, normalized month, audit fields, and sync version.
- `IncomeItems`: monthly income lines such as salary and other income.
- `RecurringExpenses`: fixed monthly expense lines such as rent, utilities, school fees, insurance, subscriptions, and other fixed expenses.
- `InvestmentAllocations`: PPF, EPF, SIP, mutual funds, stocks, gold, emergency fund, and other investments.
- `VariableBudgets`: category budgets, spent amount, and remaining/percentage values computed by application logic.
- `Expenses`: simple expense entry contract for upcoming expense management.
- `BudgetVersions`: budget history snapshots for future event-driven rebalancing.

## Future Sync

Entities include `CreatedAtUtc`, `UpdatedAtUtc`, and `SyncVersion`. These fields are intentionally present now so cloud sync can be added later without reshaping the core model.

## Postgres Path

SQLite is the MVP provider. Postgres can be added later by introducing a provider option in infrastructure configuration, adding the Npgsql EF Core provider, and generating provider-compatible migrations.