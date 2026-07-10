export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED';

export interface UserProfile {
  id: string;
  name: string;
  salary: number;
  salaryCreditDay: number;
  preferredCurrency: CurrencyCode;
  notificationTimes: string[];
  familySize?: number;
  financialPreferences: string;
}

export interface MoneyLineItem {
  name: string;
  amount: number;
}

export interface VariableBudgetLineItem {
  category: string;
  budgetAmount: number;
  spentAmount: number;
}

export interface MonthlyPlan {
  id: string;
  userProfileId: string;
  planMonth: string;
  incomeItems: MoneyLineItem[];
  recurringExpenses: MoneyLineItem[];
  investments: MoneyLineItem[];
  variableBudgets: VariableBudgetLineItem[];
  totalIncome: number;
  totalAllocation: number;
  remainingBalance: number;
  savingsRate: number;
}

export interface DashboardSummary {
  monthlyIncome: number;
  monthlyExpenses: number;
  remainingBudget: number;
  totalSavings: number;
  investments: number;
  activeLoans: number;
  outstandingLoanAmount: number;
  monthlyEmiCommitment: number;
  budgetUtilization: number;
  goalProgress: number;
  financialHealthScore: number;
}