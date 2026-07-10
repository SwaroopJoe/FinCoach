using FinancialCoach.Domain.Entities;

namespace FinancialCoach.Tests;

public sealed class MonthlyPlanCalculationTests
{
    [Fact]
    public void MonthlyPlan_CalculatesTotalsRemainingBalanceAndSavingsRate()
    {
        var plan = new MonthlyPlan
        {
            IncomeItems =
            [
                new IncomeItem { Name = "Salary", Amount = 100000 },
                new IncomeItem { Name = "Other Income", Amount = 5000 }
            ],
            RecurringExpenses =
            [
                new RecurringExpense { Category = "Rent", Amount = 25000 },
                new RecurringExpense { Category = "Utilities", Amount = 5000 }
            ],
            Investments =
            [
                new InvestmentAllocation { Category = "SIP", Amount = 15000 },
                new InvestmentAllocation { Category = "Emergency Fund", Amount = 10000 }
            ],
            VariableBudgets =
            [
                new VariableBudget { Category = "Grocery", BudgetAmount = 12000 },
                new VariableBudget { Category = "Fuel", BudgetAmount = 8000 }
            ]
        };

        Assert.Equal(105000, plan.TotalIncome);
        Assert.Equal(75000, plan.TotalAllocation);
        Assert.Equal(30000, plan.RemainingBalance);
        Assert.Equal(23.81m, plan.SavingsRate);
    }
}