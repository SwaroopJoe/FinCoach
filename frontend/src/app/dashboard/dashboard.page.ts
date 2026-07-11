import { CurrencyPipe, DecimalPipe, NgClass } from '@angular/common';
import { Component, OnInit, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FinancialStoreService } from '../core/financial-store.service';

@Component({
  selector: 'app-dashboard-page',
  imports: [CurrencyPipe, DecimalPipe, MatButtonModule, MatCardModule, MatProgressBarModule, NgClass, RouterLink],
  template: `
    <header class="page-header">
      <div>
        <h1>Money map for this month</h1>
        <p>{{ store.selectedPlanMonthLabel() }} plan. Every rupee has a purpose, and the plan can flex when life changes.</p>
      </div>
      <div class="month-actions">
        <button mat-stroked-button type="button" (click)="changeMonth(-1)">Previous</button>
        <strong>{{ store.selectedPlanMonthLabel() }}</strong>
        <button mat-stroked-button type="button" (click)="changeMonth(1)">Next</button>
        <a mat-flat-button routerLink="/monthly-planning">Adjust plan</a>
      </div>
    </header>

    @if (store.error()) {
      <section class="panel empty-state">
        <strong>{{ store.error() }}</strong>
      </section>
    }

    @if (!store.profile()) {
      <section class="panel empty-state">
        <strong>Create your profile before the dashboard can calculate anything.</strong>
        <a mat-flat-button routerLink="/profile">Create profile</a>
      </section>
    } @else if (!hasSavedPlan()) {
      <section class="panel empty-state">
        <strong>No saved plan for {{ store.selectedPlanMonthLabel() }} yet.</strong>
        <button mat-flat-button type="button" (click)="startFromPreviousMonth()">Start from previous month</button>
        <a mat-stroked-button routerLink="/monthly-planning">Create blank plan</a>
      </section>
    } @else {
      <section class="hero panel">
        <div>
          <span class="eyebrow">Monthly plan status</span>
          <strong>{{ planStatus().label }}</strong>
          <p>{{ coachLine() }}</p>
        </div>
        <mat-progress-bar mode="determinate" [value]="planStatus().progress" [ngClass]="planStatus().className" />
        <div class="status-factors" aria-label="Monthly plan status factors">
          @for (factor of statusFactors(); track factor.label) {
            <div>
              <span>{{ factor.label }}</span>
              <strong>{{ factor.value }}</strong>
              <small>{{ factor.note }}</small>
            </div>
          }
        </div>
      </section>

      <section class="grid metrics" aria-label="Monthly dashboard metrics">
        @for (metric of metrics(); track metric.label) {
          <mat-card class="metric-card panel">
            <mat-card-content>
              <span>{{ metric.label }}</span>
              <strong>{{ metric.value | currency:'INR':'symbol':'1.0-0' }}</strong>
              <small>{{ metric.note }}</small>
            </mat-card-content>
          </mat-card>
        }
      </section>

      <section class="dashboard-detail">
        <mat-card class="panel">
          <mat-card-header>
            <mat-card-title>Budget utilization</mat-card-title>
            <mat-card-subtitle>{{ summary().budgetUtilization | number:'1.0-0' }}% used across variable categories</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <mat-progress-bar mode="determinate" [value]="summary().budgetUtilization" [ngClass]="utilizationClass()" />
            @if (overBudgetItems().length > 0) {
              <div class="budget-warning">
                <strong>Limit exceeded</strong>
                <span>{{ overBudgetItems()[0].category }} is over by {{ overBudgetItems()[0].amount | currency:'INR':'symbol':'1.0-0' }}.</span>
                <a mat-stroked-button routerLink="/monthly-planning">Rebalance</a>
              </div>
            }
            <div class="budget-list">
              @for (budget of plan().variableBudgets; track budget.category) {
                <div>
                  <span>{{ budget.category }}</span>
                  <strong>{{ budget.spentAmount | currency:'INR':'symbol':'1.0-0' }} / {{ budget.budgetAmount | currency:'INR':'symbol':'1.0-0' }}</strong>
                </div>
              }
            </div>
          </mat-card-content>
        </mat-card>

        @if (plan().totalBorrowingShortage > 0) {
          <mat-card class="panel shortage-alert">
            <mat-card-header>
              <mat-card-title>Borrowing / shortage</mat-card-title>
              <mat-card-subtitle>This month has an unresolved funding gap.</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <strong>{{ plan().totalBorrowingShortage | currency:'INR':'symbol':'1.0-0' }}</strong>
              <div class="budget-list">
                @for (shortage of plan().borrowingShortages; track shortage.name) {
                  <div>
                    <span>{{ shortage.name }}</span>
                    <strong>{{ shortage.amount | currency:'INR':'symbol':'1.0-0' }}</strong>
                  </div>
                }
              </div>
            </mat-card-content>
          </mat-card>
        }

        @if (store.investments().holdings.length > 0) {
          <mat-card class="panel">
            <mat-card-header>
              <mat-card-title>Investment tracker</mat-card-title>
              <mat-card-subtitle>Persistent holdings across months, using your manual rates.</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div class="tracker-grid">
                <div><span>Invested</span><strong>{{ store.investments().totalInvested | currency:'INR':'symbol':'1.0-0' }}</strong></div>
                <div><span>Current value</span><strong>{{ store.investments().totalCurrentValue | currency:'INR':'symbol':'1.0-0' }}</strong></div>
                <div><span>Gain / loss</span><strong>{{ store.investments().totalGainLoss | currency:'INR':'symbol':'1.0-0' }}</strong></div>
              </div>
            </mat-card-content>
          </mat-card>
        }

        @if (store.goals().length > 0) {
          <mat-card class="panel">
            <mat-card-header>
              <mat-card-title>Goals</mat-card-title>
              <mat-card-subtitle>Custom targets you are funding separately from monthly expenses.</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div class="goal-list">
                @for (goal of store.goals(); track goal.id) {
                  <div>
                    <span>{{ goal.name }}</span>
                    <strong>{{ goal.currentAmount || 0 | currency:'INR':'symbol':'1.0-0' }} / {{ goal.targetAmount | currency:'INR':'symbol':'1.0-0' }}</strong>
                  </div>
                }
              </div>
            </mat-card-content>
          </mat-card>
        }
      </section>
    }
  `,
  styles: `
    .hero { display: grid; gap: 22px; margin-bottom: 18px; padding: clamp(22px, 4vw, 38px); }
    .hero strong { display: block; font-family: Newsreader, serif; font-size: clamp(2.7rem, 8vw, 5.4rem); line-height: 0.95; }
    .eyebrow, .metric-card span { color: var(--fc-muted); font-size: 0.8rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
    .status-factors { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
    .status-factors div { background: linear-gradient(145deg, rgba(255,255,255,0.72), rgba(236,244,247,0.68)); border: 1px solid rgba(41,61,82,0.1); border-radius: 8px; padding: 14px; }
    .status-factors span { color: var(--fc-muted); display: block; font-size: 0.82rem; }
    .status-factors strong { display: block; font-size: 1.2rem; margin-top: 4px; }
    .status-factors small { color: var(--fc-muted); display: block; margin-top: 4px; }
    .metrics { margin: 16px 0; }
    .metric-card strong { display: block; font-family: Newsreader, serif; margin: 10px 0 4px; font-size: 1.9rem; }
    .metric-card small { color: var(--fc-muted); }
    .dashboard-detail { display: grid; gap: 16px; }
    .budget-list { display: grid; gap: 12px; margin-top: 18px; }
    .budget-list div, .goal-list div { display: flex; justify-content: space-between; gap: 12px; }
    .budget-warning { align-items: center; background: rgba(155,63,47,0.08); border: 1px solid rgba(155,63,47,0.2); border-radius: 8px; display: flex; gap: 12px; justify-content: space-between; margin-top: 16px; padding: 14px; }
    .budget-warning strong { color: #7a2d23; }
    .shortage-alert { border-left: 4px solid #9b3f2f; }
    .shortage-alert mat-card-content > strong { display: block; font-family: Newsreader, serif; font-size: 2rem; margin-top: 12px; }
    .tracker-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; padding-top: 16px; }
    .tracker-grid div { background: linear-gradient(145deg, rgba(255,255,255,0.72), rgba(241,237,224,0.7)); border-radius: 8px; padding: 14px; }
    .tracker-grid span { color: var(--fc-muted); display: block; font-size: 0.82rem; }
    .tracker-grid strong { display: block; margin-top: 4px; }
    .goal-list { display: grid; gap: 12px; padding-top: 16px; }
    .empty-state { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 16px; padding: 18px; }
    .month-actions { align-items: center; display: flex; flex-wrap: wrap; gap: 10px; justify-content: flex-end; }
    .month-actions strong { color: var(--fc-primary-deep); min-width: 130px; text-align: center; }
    @media (max-width: 820px) { .status-factors, .tracker-grid { grid-template-columns: 1fr; } .month-actions { justify-content: flex-start; } }
  `
})
export class DashboardPage implements OnInit {
  readonly store = inject(FinancialStoreService);
  private readonly router = inject(Router);
  readonly summary = this.store.dashboard;
  readonly plan = this.store.monthlyPlan;
  readonly hasSavedPlan = computed(() => Boolean(this.store.profile() && this.plan().id));

  readonly metrics = computed(() => [
    { label: 'Monthly income', value: this.summary().monthlyIncome, note: 'Planned income this month' },
    { label: 'Monthly expenses', value: this.summary().monthlyExpenses, note: 'Recurring plus spent variable' },
    { label: 'Remaining budget', value: this.summary().remainingBudget, note: 'After planned allocations' },
    { label: 'Tracked investments', value: this.store.investments().totalCurrentValue, note: `${this.store.investments().totalGainLossPercent}% tracker return` }
  ]);

  readonly planStatus = computed(() => {
    const remaining = this.summary().remainingBudget;
    const utilization = this.summary().budgetUtilization;
    const savingsRate = this.plan().savingsRate;

    if (remaining < 0) {
      return { label: 'Over planned', progress: 35, className: 'over' };
    }

    if (utilization > 100) {
      return { label: 'Budget stretched', progress: 55, className: 'over' };
    }

    if (savingsRate < 10) {
      return { label: 'Needs allocation', progress: 65, className: 'watch' };
    }

    return { label: 'On track', progress: 85, className: 'steady' };
  });

  readonly statusFactors = computed(() => [
    {
      label: 'Remaining',
      value: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(this.summary().remainingBudget),
      note: this.summary().remainingBudget >= 0 ? 'Money left after planned allocations' : 'Planned allocations exceed income'
    },
    {
      label: 'Monthly investment allocation',
      value: `${this.plan().savingsRate}%`,
      note: 'From this month\'s Investments section'
    },
    {
      label: 'Variable budget used',
      value: `${Math.round(this.summary().budgetUtilization)}%`,
      note: 'Spent amount compared with variable budgets'
    }
  ]);

  readonly coachLine = computed(() => this.summary().remainingBudget >= 0
    ? 'This status is based only on your saved monthly plan: remaining money, monthly investment allocation, and variable budget usage.'
    : 'This month needs a softer landing. Rebalance one category before reducing long-term priorities.');

  readonly overBudgetItems = computed(() => this.plan().variableBudgets
    .filter((budget) => Number(budget.spentAmount || 0) > Number(budget.budgetAmount || 0))
    .map((budget) => ({
      category: budget.category,
      amount: Number(budget.spentAmount || 0) - Number(budget.budgetAmount || 0)
    }))
    .map((overrun) => ({
      ...overrun,
      amount: Math.max(overrun.amount - this.coveredShortageAmount(overrun.category), 0)
    }))
    .filter((overrun) => overrun.amount > 0));

  private coveredShortageAmount(category: string): number {
    const normalizedCategory = category.trim().toLowerCase();

    return this.plan().borrowingShortages
      .filter((shortage) => {
        const searchable = `${shortage.name} ${shortage.reason}`.toLowerCase();
        return searchable.includes(normalizedCategory);
      })
      .reduce((total, shortage) => total + Number(shortage.amount || 0), 0);
  }

  utilizationClass(): string {
    const utilization = this.summary().budgetUtilization;
    return utilization > 100 ? 'over' : utilization > 80 ? 'watch' : 'steady';
  }

  async ngOnInit(): Promise<void> {
    const profile = await this.store.loadProfile();

    if (!profile) {
      return;
    }

    await this.store.loadMonthlyPlanForSelectedMonth();
    await this.store.loadDashboard();
    await this.store.loadInvestments();
    await this.store.loadGoals();
  }

  async changeMonth(offset: number): Promise<void> {
    await this.store.changeSelectedMonth(offset);
  }

  async startFromPreviousMonth(): Promise<void> {
    await this.store.startSelectedMonthFromPreviousPlan();
    await this.router.navigateByUrl('/monthly-planning');
  }
}