import { Injectable, computed, signal } from '@angular/core';
import { DashboardSummary, MonthlyPlan, UserProfile } from '../models/finance.models';

const defaultProfile: UserProfile = {
  id: 'local-user',
  name: 'Aarav',
  salary: 120000,
  salaryCreditDay: 1,
  preferredCurrency: 'INR',
  notificationTimes: ['12:00', '14:00', '19:00'],
  familySize: 3,
  financialPreferences: 'Prioritize emergency fund and long-term investing.'
};

const defaultPlan: MonthlyPlan = {
  id: 'local-plan',
  userProfileId: defaultProfile.id,
  planMonth: new Date().toISOString(),
  incomeItems: [
    { name: 'Salary', amount: 120000 },
    { name: 'Other income', amount: 10000 }
  ],
  recurringExpenses: [
    { name: 'Rent', amount: 32000 },
    { name: 'Utilities', amount: 7000 },
    { name: 'Subscriptions', amount: 2500 }
  ],
  investments: [
    { name: 'SIP', amount: 18000 },
    { name: 'Emergency Fund', amount: 12000 },
    { name: 'PPF', amount: 5000 }
  ],
  variableBudgets: [
    { category: 'Grocery', budgetAmount: 16000, spentAmount: 9200 },
    { category: 'Fuel', budgetAmount: 8000, spentAmount: 4200 },
    { category: 'Dining', budgetAmount: 7000, spentAmount: 6100 },
    { category: 'Medical', budgetAmount: 6000, spentAmount: 1200 }
  ],
  totalIncome: 0,
  totalAllocation: 0,
  remainingBalance: 0,
  savingsRate: 0
};

@Injectable({ providedIn: 'root' })
export class FinancialStoreService {
  readonly profile = signal<UserProfile>(defaultProfile);
  readonly monthlyPlan = signal<MonthlyPlan>(this.calculatePlan(defaultPlan));

  readonly dashboard = computed<DashboardSummary>(() => {
    const plan = this.monthlyPlan();
    const spent = plan.variableBudgets.reduce((total, item) => total + item.spentAmount, 0);
    const monthlyExpenses = plan.recurringExpenses.reduce((total, item) => total + item.amount, 0) + spent;
    const variableBudgetTotal = plan.variableBudgets.reduce((total, item) => total + item.budgetAmount, 0);
    const utilization = variableBudgetTotal === 0 ? 0 : Number(((spent / variableBudgetTotal) * 100).toFixed(2));

    return {
      monthlyIncome: plan.totalIncome,
      monthlyExpenses,
      remainingBudget: plan.remainingBalance,
      totalSavings: plan.investments.reduce((total, item) => total + item.amount, 0),
      investments: plan.investments.reduce((total, item) => total + item.amount, 0),
      activeLoans: 0,
      outstandingLoanAmount: 0,
      monthlyEmiCommitment: 0,
      budgetUtilization: utilization,
      goalProgress: 0,
      financialHealthScore: this.calculateHealthScore(plan.savingsRate, utilization, plan.remainingBalance)
    };
  });

  saveProfile(profile: UserProfile): void {
    this.profile.set(profile);
  }

  savePlan(plan: MonthlyPlan): void {
    this.monthlyPlan.set(this.calculatePlan(plan));
  }

  calculatePlan(plan: MonthlyPlan): MonthlyPlan {
    const totalIncome = plan.incomeItems.reduce((total, item) => total + item.amount, 0);
    const recurring = plan.recurringExpenses.reduce((total, item) => total + item.amount, 0);
    const investments = plan.investments.reduce((total, item) => total + item.amount, 0);
    const variable = plan.variableBudgets.reduce((total, item) => total + item.budgetAmount, 0);
    const totalAllocation = recurring + investments + variable;

    return {
      ...plan,
      totalIncome,
      totalAllocation,
      remainingBalance: totalIncome - totalAllocation,
      savingsRate: totalIncome === 0 ? 0 : Number(((investments / totalIncome) * 100).toFixed(2))
    };
  }

  private calculateHealthScore(savingsRate: number, utilization: number, remainingBalance: number): number {
    let score = 50;
    score += savingsRate >= 20 ? 25 : savingsRate >= 10 ? 15 : 5;
    score += utilization <= 80 ? 15 : utilization <= 100 ? 5 : -10;
    score += remainingBalance >= 0 ? 10 : -15;
    return Math.max(0, Math.min(100, score));
  }
}