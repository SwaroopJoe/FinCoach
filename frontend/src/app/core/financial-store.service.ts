import { HttpErrorResponse } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { DashboardSummary, FinancialGoal, GoalContribution, InvestmentContribution, InvestmentHolding, InvestmentSummary, MonthlyPlan, UserProfile } from '../models/finance.models';
import { ApiService } from './api.service';

const emptyDashboard: DashboardSummary = {
  monthlyIncome: 0,
  monthlyExpenses: 0,
  remainingBudget: 0,
  totalSavings: 0,
  investments: 0,
  activeLoans: 0,
  outstandingLoanAmount: 0,
  monthlyEmiCommitment: 0,
  budgetUtilization: 0,
  goalProgress: 0,
  financialHealthScore: 0
};

const emptyInvestmentSummary: InvestmentSummary = {
  userProfileId: '',
  totalInvested: 0,
  totalCurrentValue: 0,
  totalGainLoss: 0,
  totalGainLossPercent: 0,
  holdings: []
};

@Injectable({ providedIn: 'root' })
export class FinancialStoreService {
  readonly profile = signal<UserProfile | null>(null);
  readonly selectedPlanMonth = signal(this.currentMonthIso());
  readonly selectedPlanMonthLabel = computed(() => new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' }).format(new Date(this.selectedPlanMonth())));
  readonly monthlyPlan = signal<MonthlyPlan>(this.createMonthlyPlanDraft(null, this.selectedPlanMonth()));
  readonly dashboard = signal<DashboardSummary>(emptyDashboard);
  readonly investments = signal<InvestmentSummary>(emptyInvestmentSummary);
  readonly goals = signal<FinancialGoal[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  constructor(private readonly api: ApiService) {}

  resetForAuthChange(): void {
    this.profile.set(null);
    this.selectedPlanMonth.set(this.currentMonthIso());
    this.monthlyPlan.set(this.createMonthlyPlanDraft(null, this.selectedPlanMonth()));
    this.dashboard.set(emptyDashboard);
    this.investments.set(emptyInvestmentSummary);
    this.goals.set([]);
    this.loading.set(false);
    this.saving.set(false);
    this.error.set(null);
  }

  async loadProfile(): Promise<UserProfile | null> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const profile = await firstValueFrom(this.api.getProfile());
      this.profile.set(profile);
      return profile;
    } catch (error) {
      if (this.isNotFound(error)) {
        this.profile.set(null);
        return null;
      }

      this.error.set('Could not load your profile. Check that the API is running.');
      throw error;
    } finally {
      this.loading.set(false);
    }
  }

  async saveProfile(profile: Omit<UserProfile, 'id'>): Promise<UserProfile> {
    this.saving.set(true);
    this.error.set(null);

    try {
      const savedProfile = await firstValueFrom(this.api.saveProfile(profile));
      this.profile.set(savedProfile);
      return savedProfile;
    } catch (error) {
      this.error.set('Could not save your profile. Check the fields and API connection.');
      throw error;
    } finally {
      this.saving.set(false);
    }
  }

  async loadCurrentMonthlyPlan(): Promise<MonthlyPlan> {
    const profile = this.profile() ?? await this.loadProfile();

    if (!profile) {
      const draft = this.createMonthlyPlanDraft(null);
      this.monthlyPlan.set(draft);
      return draft;
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      const response = await firstValueFrom(this.api.getCurrentMonthlyPlan(profile.id));
      const plan = response ? this.calculatePlan(response) : this.createMonthlyPlanDraft(profile, this.selectedPlanMonth());
      this.selectedPlanMonth.set(this.normalizeMonthIso(plan.planMonth));
      this.monthlyPlan.set(plan);
      return plan;
    } catch (error) {
      if (this.isNotFound(error)) {
        const draft = this.createMonthlyPlanDraft(profile, this.selectedPlanMonth());
        this.monthlyPlan.set(draft);
        return draft;
      }

      this.error.set('Could not load the current monthly plan.');
      throw error;
    } finally {
      this.loading.set(false);
    }
  }

  async loadMonthlyPlanForSelectedMonth(): Promise<MonthlyPlan> {
    const profile = this.profile() ?? await this.loadProfile();

    if (!profile) {
      const draft = this.createMonthlyPlanDraft(null, this.selectedPlanMonth());
      this.monthlyPlan.set(draft);
      return draft;
    }

    const { year, month } = this.selectedMonthParts();
    this.loading.set(true);
    this.error.set(null);

    try {
      const response = await firstValueFrom(this.api.getMonthlyPlanForMonth(profile.id, year, month));
      const plan = response ? this.calculatePlan(response) : this.createMonthlyPlanDraft(profile, this.selectedPlanMonth());
      this.monthlyPlan.set(plan);
      return plan;
    } catch (error) {
      if (this.isNotFound(error)) {
        const draft = this.createMonthlyPlanDraft(profile, this.selectedPlanMonth());
        this.monthlyPlan.set(draft);
        return draft;
      }

      this.error.set('Could not load the selected monthly plan.');
      throw error;
    } finally {
      this.loading.set(false);
    }
  }

  async changeSelectedMonth(offset: number): Promise<MonthlyPlan> {
    const selected = new Date(this.selectedPlanMonth());
    const next = new Date(Date.UTC(selected.getUTCFullYear(), selected.getUTCMonth() + offset, 1));
    this.selectedPlanMonth.set(next.toISOString());
    const plan = await this.loadMonthlyPlanForSelectedMonth();
    await this.loadDashboard();
    return plan;
  }

  async startSelectedMonthFromPreviousPlan(): Promise<MonthlyPlan> {
    const profile = this.profile() ?? await this.loadProfile();

    if (!profile) {
      const draft = this.createMonthlyPlanDraft(null, this.selectedPlanMonth());
      this.monthlyPlan.set(draft);
      return draft;
    }

    try {
      const previous = await this.loadPreviousMonthlyPlanForSelectedMonth();
      if (!previous) {
        const draft = this.createMonthlyPlanDraft(profile, this.selectedPlanMonth());
        this.monthlyPlan.set(draft);
        return draft;
      }

      const draft = this.calculatePlan({
        ...previous,
        id: '',
        userProfileId: profile.id,
        planMonth: this.selectedPlanMonth(),
        variableBudgets: previous.variableBudgets.map((budget) => ({
          category: budget.category,
          budgetAmount: budget.budgetAmount,
          spentAmount: 0
        })),
        borrowingShortages: [],
        totalIncome: 0,
        totalAllocation: 0,
        remainingBalance: 0,
        totalBorrowingShortage: 0,
        savingsRate: 0
      });

      this.monthlyPlan.set(draft);
      this.dashboard.set(emptyDashboard);
      return draft;
    } catch (error) {
      if (this.isNotFound(error)) {
        const draft = this.createMonthlyPlanDraft(profile, this.selectedPlanMonth());
        this.monthlyPlan.set(draft);
        return draft;
      }

      this.error.set('Could not start this month from the previous plan.');
      throw error;
    }
  }

  async loadPreviousMonthlyPlanForSelectedMonth(): Promise<MonthlyPlan | null> {
    const profile = this.profile() ?? await this.loadProfile();

    if (!profile) {
      return null;
    }

    const { year, month } = this.previousSelectedMonthParts();

    try {
      const response = await firstValueFrom(this.api.getMonthlyPlanForMonth(profile.id, year, month));
      return response ? this.calculatePlan(response) : null;
    } catch (error) {
      if (this.isNotFound(error)) {
        return null;
      }

      this.error.set('Could not load the previous monthly plan.');
      throw error;
    }
  }

  async savePlan(plan: MonthlyPlan): Promise<MonthlyPlan> {
    const profile = this.profile() ?? await this.loadProfile();

    if (!profile) {
      throw new Error('Create a profile before saving a monthly plan.');
    }

    this.saving.set(true);
    this.error.set(null);

    try {
      const savedPlan = await firstValueFrom(this.api.saveMonthlyPlan({
        userProfileId: profile.id,
        planMonth: plan.planMonth,
        incomeItems: plan.incomeItems.map((item) => ({ name: item.name, amount: item.amount })),
        recurringExpenses: plan.recurringExpenses.map((item) => ({ name: item.name, amount: item.amount })),
        investments: plan.investments.map((item) => ({ name: item.name, amount: item.amount })),
        variableBudgets: plan.variableBudgets.map((item) => ({
          category: item.category,
          budgetAmount: item.budgetAmount,
          spentAmount: item.spentAmount
        })),
        borrowingShortages: plan.borrowingShortages.map((item) => ({
          name: item.name,
          amount: item.amount,
          reason: item.reason
        }))
      }));

      this.selectedPlanMonth.set(this.normalizeMonthIso(savedPlan.planMonth));
      this.monthlyPlan.set(this.calculatePlan(savedPlan));
      await this.loadDashboard();
      return savedPlan;
    } catch (error) {
      this.error.set('Could not save the monthly plan to the database.');
      throw error;
    } finally {
      this.saving.set(false);
    }
  }

  async resetCurrentMonthlyPlan(): Promise<void> {
    const profile = this.profile() ?? await this.loadProfile();

    if (!profile) {
      return;
    }

    this.saving.set(true);
    this.error.set(null);

    try {
      const { year, month } = this.selectedMonthParts();
      await firstValueFrom(this.api.resetMonthlyPlanForMonth(profile.id, year, month));
      this.monthlyPlan.set(this.createMonthlyPlanDraft(profile, this.selectedPlanMonth()));
      await this.loadDashboard();
    } catch (error) {
      if (this.isNotFound(error)) {
        this.monthlyPlan.set(this.createMonthlyPlanDraft(profile, this.selectedPlanMonth()));
        return;
      }

      this.error.set('Could not reset the monthly plan.');
      throw error;
    } finally {
      this.saving.set(false);
    }
  }

  async loadDashboard(): Promise<DashboardSummary> {
    const profile = this.profile() ?? await this.loadProfile();

    if (!profile) {
      this.dashboard.set(emptyDashboard);
      return emptyDashboard;
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      const { year, month } = this.selectedMonthParts();
      const summary = await firstValueFrom(this.api.getDashboardForMonth(profile.id, year, month));
      this.dashboard.set(summary);
      return summary;
    } catch (error) {
      this.error.set('Could not load dashboard data.');
      throw error;
    } finally {
      this.loading.set(false);
    }
  }

  async loadInvestments(): Promise<InvestmentSummary> {
    const profile = this.profile() ?? await this.loadProfile();

    if (!profile) {
      this.investments.set(emptyInvestmentSummary);
      return emptyInvestmentSummary;
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      const summary = await firstValueFrom(this.api.getInvestments(profile.id));
      this.investments.set(summary);
      return summary;
    } catch (error) {
      this.error.set('Could not load investment tracker data.');
      throw error;
    } finally {
      this.loading.set(false);
    }
  }

  async saveInvestment(holding: Omit<InvestmentHolding, 'id' | 'investedAmount' | 'currentValue' | 'gainLoss' | 'gainLossPercent' | 'projectedValueOneYear' | 'projectedValueThreeYears' | 'projectedValueFiveYears' | 'projectedMaturityValue' | 'contributions'>, id?: string): Promise<InvestmentHolding> {
    this.saving.set(true);
    this.error.set(null);

    try {
      const saved = await firstValueFrom(id ? this.api.updateInvestment(id, holding) : this.api.createInvestment(holding));
      await this.loadInvestments();
      return saved;
    } catch (error) {
      this.error.set('Could not save investment details.');
      throw error;
    } finally {
      this.saving.set(false);
    }
  }

  async addInvestmentContribution(holdingId: string, contribution: Omit<InvestmentContribution, 'id' | 'investmentHoldingId'>): Promise<InvestmentContribution> {
    const profile = this.profile() ?? await this.loadProfile();

    if (!profile) {
      throw new Error('Create a profile before adding investment contributions.');
    }

    this.saving.set(true);
    this.error.set(null);

    try {
      const saved = await firstValueFrom(this.api.addInvestmentContribution(holdingId, { ...contribution, userProfileId: profile.id }));
      await this.loadInvestments();
      return saved;
    } catch (error) {
      this.error.set('Could not add investment contribution.');
      throw error;
    } finally {
      this.saving.set(false);
    }
  }

  async addMonthlyInvestmentAllocation(name: string, amount: number): Promise<MonthlyPlan> {
    const profile = this.profile() ?? await this.loadProfile();

    if (!profile) {
      throw new Error('Create a profile before adding monthly investment allocations.');
    }

    const plan = await this.loadMonthlyPlanForSelectedMonth();
    const normalizedName = name.trim() || 'Investment contribution';
    const allocationAmount = Number(amount || 0);

    if (allocationAmount <= 0) {
      return plan;
    }

    const investments = plan.investments.filter((item) => item.name.trim() || Number(item.amount || 0) > 0);
    const existing = investments.find((item) => item.name.trim().toLocaleLowerCase() === normalizedName.toLocaleLowerCase());

    if (existing) {
      existing.amount = Number(existing.amount || 0) + allocationAmount;
    } else {
      investments.push({ name: normalizedName, amount: allocationAmount });
    }

    return this.savePlan({ ...plan, investments });
  }

  async deleteInvestment(id: string): Promise<void> {
    this.saving.set(true);
    this.error.set(null);

    try {
      await firstValueFrom(this.api.deleteInvestment(id));
      await this.loadInvestments();
    } catch (error) {
      this.error.set('Could not delete investment holding.');
      throw error;
    } finally {
      this.saving.set(false);
    }
  }

  async loadGoals(): Promise<FinancialGoal[]> {
    const profile = this.profile() ?? await this.loadProfile();

    if (!profile) {
      this.goals.set([]);
      return [];
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      const goals = await firstValueFrom(this.api.getGoals(profile.id));
      this.goals.set(goals);
      return goals;
    } catch (error) {
      this.error.set('Could not load goals.');
      throw error;
    } finally {
      this.loading.set(false);
    }
  }

  async saveGoal(goal: Omit<FinancialGoal, 'id' | 'currentAmount' | 'remainingAmount' | 'progressPercent' | 'isCompleted' | 'contributions'>, id?: string): Promise<FinancialGoal> {
    this.saving.set(true);
    this.error.set(null);

    try {
      const saved = await firstValueFrom(id ? this.api.updateGoal(id, goal) : this.api.createGoal(goal));
      await this.loadGoals();
      return saved;
    } catch (error) {
      this.error.set('Could not save goal.');
      throw error;
    } finally {
      this.saving.set(false);
    }
  }

  async deleteGoal(id: string): Promise<void> {
    this.saving.set(true);
    this.error.set(null);

    try {
      await firstValueFrom(this.api.deleteGoal(id));
      await this.loadGoals();
    } catch (error) {
      this.error.set('Could not delete goal.');
      throw error;
    } finally {
      this.saving.set(false);
    }
  }

  async addGoalContribution(goalId: string, contribution: Omit<GoalContribution, 'id' | 'financialGoalId'>): Promise<GoalContribution> {
    this.saving.set(true);
    this.error.set(null);

    try {
      const saved = await firstValueFrom(this.api.addGoalContribution(goalId, contribution));
      await this.loadGoals();
      return saved;
    } catch (error) {
      this.error.set('Could not add money to goal.');
      throw error;
    } finally {
      this.saving.set(false);
    }
  }

  createMonthlyPlanDraft(profile: UserProfile | null, planMonth = this.selectedPlanMonth()): MonthlyPlan {
    return this.calculatePlan({
      id: '',
      userProfileId: profile?.id ?? '',
      planMonth: this.normalizeMonthIso(planMonth),
      incomeItems: [{ name: '', amount: 0 }],
      recurringExpenses: [{ name: '', amount: 0 }],
      investments: [{ name: '', amount: 0 }],
      variableBudgets: [{ category: '', budgetAmount: 0, spentAmount: 0 }],
      borrowingShortages: [],
      totalIncome: 0,
      totalAllocation: 0,
      remainingBalance: 0,
      totalBorrowingShortage: 0,
      savingsRate: 0
    });
  }

  calculatePlan(plan: MonthlyPlan): MonthlyPlan {
    const totalIncome = plan.incomeItems.reduce((total, item) => total + Number(item.amount || 0), 0);
    const recurring = plan.recurringExpenses.reduce((total, item) => total + Number(item.amount || 0), 0);
    const investments = plan.investments.reduce((total, item) => total + Number(item.amount || 0), 0);
    const variableBudgets = plan.variableBudgets.map((item) => {
      const budgetAmount = Number(item.budgetAmount || 0);
      const spentAmount = Number(item.spentAmount || 0);

      return {
        ...item,
        budgetAmount,
        spentAmount,
        remainingAmount: budgetAmount - spentAmount,
        percentageUsed: budgetAmount === 0 ? 0 : Number(((spentAmount / budgetAmount) * 100).toFixed(2))
      };
    });
    const variable = variableBudgets.reduce((total, item) => total + item.budgetAmount, 0);
    const totalBorrowingShortage = plan.borrowingShortages.reduce((total, item) => total + Number(item.amount || 0), 0);
    const totalAllocation = recurring + investments + variable;

    return {
      ...plan,
      variableBudgets,
      totalIncome,
      totalAllocation,
      remainingBalance: totalIncome - totalAllocation,
      totalBorrowingShortage,
      savingsRate: totalIncome === 0 ? 0 : Number(((investments / totalIncome) * 100).toFixed(2))
    };
  }

  private isNotFound(error: unknown): boolean {
    return error instanceof HttpErrorResponse && error.status === 404;
  }

  private currentMonthIso(): string {
    const today = new Date();
    return new Date(Date.UTC(today.getFullYear(), today.getMonth(), 1)).toISOString();
  }

  private normalizeMonthIso(value: string): string {
    const date = new Date(value);
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1)).toISOString();
  }

  private selectedMonthParts(): { year: number; month: number } {
    const selected = new Date(this.selectedPlanMonth());
    return { year: selected.getUTCFullYear(), month: selected.getUTCMonth() + 1 };
  }

  private previousSelectedMonthParts(): { year: number; month: number } {
    const selected = new Date(this.selectedPlanMonth());
    const previous = new Date(Date.UTC(selected.getUTCFullYear(), selected.getUTCMonth() - 1, 1));
    return { year: previous.getUTCFullYear(), month: previous.getUTCMonth() + 1 };
  }
}