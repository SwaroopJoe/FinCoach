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
  id?: string;
  name: string;
  amount: number;
}

export interface VariableBudgetLineItem {
  id?: string;
  category: string;
  budgetAmount: number;
  spentAmount: number;
  remainingAmount?: number;
  percentageUsed?: number;
}

export interface BorrowingShortageLineItem {
  id?: string;
  name: string;
  amount: number;
  reason: string;
}

export interface MonthlyPlan {
  id: string;
  userProfileId: string;
  planMonth: string;
  incomeItems: MoneyLineItem[];
  recurringExpenses: MoneyLineItem[];
  investments: MoneyLineItem[];
  variableBudgets: VariableBudgetLineItem[];
  borrowingShortages: BorrowingShortageLineItem[];
  totalIncome: number;
  totalAllocation: number;
  remainingBalance: number;
  totalBorrowingShortage: number;
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

export type InvestmentCategory = 'Gold' | 'MutualFundSip' | 'Stock' | 'FixedDepositPpf' | 'Custom';
export type GoalCategory = 'ShortTerm' | 'EmergencyFund' | 'Travel' | 'Home' | 'Education' | 'Retirement' | 'Custom';
export type GoalPriority = 'Low' | 'Medium' | 'High';
export type FeedbackEntryType = 'Contribute' | 'Report';

export interface InvestmentContribution {
  id?: string;
  investmentHoldingId?: string;
  contributionMonth: string;
  amount: number;
  quantityAdded: number;
  rateAtContribution: number;
  description: string;
}

export interface InvestmentHolding {
  id?: string;
  userProfileId: string;
  name: string;
  category: InvestmentCategory;
  customCategory: string;
  quantity: number;
  averageCost: number;
  currentRate: number;
  expectedAnnualReturnPercent: number;
  notes: string;
  investedAmount?: number;
  currentValue?: number;
  gainLoss?: number;
  gainLossPercent?: number;
  projectedValueOneYear?: number;
  projectedValueThreeYears?: number;
  projectedValueFiveYears?: number;
  contributions?: InvestmentContribution[];
}

export interface InvestmentSummary {
  userProfileId: string;
  totalInvested: number;
  totalCurrentValue: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  holdings: InvestmentHolding[];
}

export interface GoalContribution {
  id?: string;
  financialGoalId?: string;
  contributionMonth: string;
  amount: number;
  description: string;
}

export interface FinancialGoal {
  id?: string;
  userProfileId: string;
  name: string;
  category: GoalCategory;
  customCategory: string;
  priority: GoalPriority;
  targetAmount: number;
  startingAmount: number;
  currentAmount?: number;
  remainingAmount?: number;
  progressPercent?: number;
  targetDate?: string | null;
  isCompleted?: boolean;
  notes: string;
  contributions?: GoalContribution[];
}

export interface FeedbackEntry {
  id: string;
  userProfileId?: string | null;
  type: FeedbackEntryType;
  title: string;
  description: string;
  contactEmail: string;
  status: string;
  createdAtUtc: string;
}