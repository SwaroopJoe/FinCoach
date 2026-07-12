import { CurrencyPipe, DecimalPipe, NgClass } from '@angular/common';
import { Component, OnInit, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
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
    } @else {
      <section class="hero panel">
        <div class="hero-copy">
          <span class="eyebrow">Monthly plan status</span>
          <strong>{{ planStatus().label }}</strong>
        </div>
        <div class="status-factors" aria-label="Monthly plan status factors">
          @for (factor of statusFactors(); track factor.label) {
            <div>
              <span>{{ factor.label }}</span>
              <strong>{{ factor.value }}</strong>
              <small>{{ factor.note }}</small>
            </div>
          }
        </div>
        <div class="allocation-chart" aria-label="Monthly allocation chart">
          @for (bar of allocationBars(); track bar.label) {
            <div>
              <span>{{ bar.label }}</span>
              <strong>{{ bar.value | currency:'INR':'symbol':'1.0-0' }}</strong>
              <i [style.width.%]="bar.percent" [class]="bar.className"></i>
            </div>
          }
        </div>
      </section>

      <section class="dashboard-visuals" aria-label="Monthly dashboard visuals">
        <mat-card class="panel visual-card cash-flow-card">
          <mat-card-content>
            <div class="pie-chart" [style.background]="cashFlowPieBackground()" aria-label="Cash flow pie chart"></div>
            <div class="visual-copy">
              <span class="eyebrow">Cash flow</span>
              <strong>{{ summary().monthlyIncome | currency:'INR':'symbol':'1.0-0' }}</strong>
              <div class="legend-list">
                @for (slice of cashFlowSlices(); track slice.label) {
                  <span><i [class]="slice.className"></i>{{ slice.label }} <b>{{ slice.value | currency:'INR':'symbol':'1.0-0' }}</b></span>
                }
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="panel visual-card maturity-card">
          <mat-card-content>
            <div class="visual-copy">
              <span class="eyebrow">Tracked investments</span>
              <strong>{{ store.investments().totalCurrentValue | currency:'INR':'symbol':'1.0-0' }}</strong>
              <small>toward {{ totalMaturityValue() | currency:'INR':'symbol':'1.0-0' }} maturity outlook</small>
            </div>
            <mat-progress-bar mode="determinate" [value]="investmentMaturityProgress()" />
            <div class="progress-meta">
              <span>{{ investmentMaturityProgress() | number:'1.0-0' }}%</span>
              <span>{{ remainingToMaturity() | currency:'INR':'symbol':'1.0-0' }} left</span>
            </div>
          </mat-card-content>
        </mat-card>
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
    .hero { align-items: center; display: grid; grid-template-columns: minmax(180px, 0.7fr) minmax(280px, 1fr); gap: 14px; margin-bottom: 14px; padding: 18px; }
    .hero-copy > strong { display: block; font-family: Newsreader, serif; font-size: clamp(2rem, 5vw, 3.1rem); line-height: 0.95; }
    .eyebrow { color: var(--fc-muted); font-size: 0.8rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
    .status-factors { display: grid; gap: 8px; }
    .status-factors div { background: var(--fc-card-soft); border: 1px solid var(--fc-border); border-radius: 8px; padding: 9px 10px; }
    .status-factors span { color: var(--fc-muted); display: block; font-size: 0.82rem; }
    .status-factors strong { display: block; font-size: 1.05rem; margin-top: 2px; }
    .status-factors small { color: var(--fc-muted); display: block; margin-top: 2px; }
    .allocation-chart { display: grid; gap: 8px; grid-column: 1 / -1; }
    .allocation-chart div { display: grid; grid-template-columns: 126px 120px minmax(90px, 1fr); gap: 10px; align-items: center; }
    .allocation-chart span { color: var(--fc-muted); font-weight: 800; }
    .allocation-chart i { border-radius: 999px; display: block; height: 8px; min-width: 8px; }
    .bar-expense { background: #9b3f2f; }
    .bar-investment { background: var(--fc-primary); }
    .bar-remaining { background: var(--fc-accent); }
    .dashboard-visuals { display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr); gap: 12px; margin: 14px 0; }
    .visual-card mat-card-content { align-items: center; display: grid; gap: 14px; padding: 16px; }
    .cash-flow-card mat-card-content { grid-template-columns: 128px minmax(0, 1fr); }
    .pie-chart { aspect-ratio: 1; border: 10px solid var(--fc-panel-strong); border-radius: 50%; box-shadow: inset 0 0 0 1px var(--fc-border); }
    .visual-copy strong { display: block; font-family: Newsreader, serif; font-size: 1.7rem; line-height: 1; margin-top: 4px; }
    .visual-copy small { color: var(--fc-muted); display: block; margin-top: 4px; }
    .legend-list { display: grid; gap: 6px; margin-top: 12px; }
    .legend-list span, .progress-meta { align-items: center; color: var(--fc-muted); display: flex; gap: 8px; justify-content: space-between; }
    .legend-list i { border-radius: 999px; height: 10px; width: 10px; }
    .legend-list b { color: var(--fc-ink); font-weight: 900; margin-left: auto; }
    .slice-expense { background: #9b3f2f; }
    .slice-investment { background: var(--fc-primary); }
    .slice-remaining { background: var(--fc-accent); }
    .maturity-card mat-card-content { align-content: center; min-height: 160px; }
    .progress-meta { font-size: 0.86rem; font-weight: 800; }
    .dashboard-detail { display: grid; gap: 16px; }
    .budget-list { display: grid; gap: 12px; margin-top: 18px; }
    .budget-list div, .goal-list div { display: flex; justify-content: space-between; gap: 12px; }
    .budget-warning { align-items: center; background: rgba(155,63,47,0.08); border: 1px solid rgba(155,63,47,0.2); border-radius: 8px; display: flex; gap: 12px; justify-content: space-between; margin-top: 16px; padding: 14px; }
    .budget-warning strong { color: #7a2d23; }
    .shortage-alert { border-left: 4px solid #9b3f2f; }
    .shortage-alert mat-card-content > strong { display: block; font-family: Newsreader, serif; font-size: 2rem; margin-top: 12px; }
    .goal-list { display: grid; gap: 12px; padding-top: 16px; }
    .empty-state { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 16px; padding: 18px; }
    .month-actions { align-items: center; display: flex; flex-wrap: wrap; gap: 10px; justify-content: flex-end; }
    .month-actions strong { color: var(--fc-primary-deep); min-width: 130px; text-align: center; }
    @media (max-width: 820px) { .hero, .dashboard-visuals, .cash-flow-card mat-card-content { grid-template-columns: 1fr; } .pie-chart { width: 126px; } .allocation-chart div { grid-template-columns: 1fr 1fr; } .allocation-chart i { grid-column: 1 / -1; } .month-actions { justify-content: flex-start; } }
  `
})
export class DashboardPage implements OnInit {
  readonly store = inject(FinancialStoreService);
  readonly summary = this.store.dashboard;
  readonly plan = this.store.monthlyPlan;

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

  readonly allocationBars = computed(() => {
    const total = Math.max(Number(this.plan().totalIncome || this.summary().monthlyIncome || 0), 1);
    const investments = this.plan().investments.reduce((sum, item) => sum + Number(item.amount || 0), 0);

    return [
      { label: 'Expenses', value: this.summary().monthlyExpenses, percent: this.percentOf(this.summary().monthlyExpenses, total), className: 'bar-expense' },
      { label: 'Investments', value: investments, percent: this.percentOf(investments, total), className: 'bar-investment' },
      { label: 'Remaining', value: Math.max(this.summary().remainingBudget, 0), percent: this.percentOf(Math.max(this.summary().remainingBudget, 0), total), className: 'bar-remaining' }
    ];
  });

  readonly cashFlowSlices = computed(() => {
    const investments = this.plan().investments.reduce((sum, item) => sum + Number(item.amount || 0), 0);

    return [
      { label: 'Expenses', value: this.summary().monthlyExpenses, className: 'slice-expense' },
      { label: 'Investments', value: investments, className: 'slice-investment' },
      { label: 'Remaining', value: Math.max(this.summary().remainingBudget, 0), className: 'slice-remaining' }
    ];
  });

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

  cashFlowPieBackground(): string {
    const total = Math.max(this.cashFlowSlices().reduce((sum, slice) => sum + Number(slice.value || 0), 0), 1);
    let start = 0;
    const colors: Record<string, string> = {
      'slice-expense': '#9b3f2f',
      'slice-investment': 'var(--fc-primary)',
      'slice-remaining': 'var(--fc-accent)'
    };
    const segments = this.cashFlowSlices().map((slice) => {
      const end = start + (Number(slice.value || 0) / total) * 100;
      const segment = `${colors[slice.className]} ${start}% ${end}%`;
      start = end;
      return segment;
    });

    return `conic-gradient(${segments.join(', ')})`;
  }

  totalMaturityValue(): number {
    return this.store.investments().holdings.reduce((total, holding) => total + Number(holding.projectedMaturityValue || holding.projectedValueFiveYears || 0), 0);
  }

  investmentMaturityProgress(): number {
    const maturity = this.totalMaturityValue();
    return maturity > 0 ? Math.min(100, Math.round((this.store.investments().totalCurrentValue / maturity) * 100)) : 0;
  }

  remainingToMaturity(): number {
    return Math.max(this.totalMaturityValue() - this.store.investments().totalCurrentValue, 0);
  }

  private percentOf(value: number, total: number): number {
    return Math.max(4, Math.min(100, Math.round((Number(value || 0) / total) * 100)));
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
}