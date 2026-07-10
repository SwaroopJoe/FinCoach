import { CurrencyPipe, DecimalPipe, NgClass } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FinancialStoreService } from '../core/financial-store.service';

@Component({
  selector: 'app-dashboard-page',
  imports: [CurrencyPipe, DecimalPipe, MatButtonModule, MatCardModule, MatChipsModule, MatProgressBarModule, NgClass, RouterLink],
  template: `
    <header class="page-header">
      <div>
        <h1>Money map for this month</h1>
        <p>Every rupee has a purpose, and the plan can flex when life changes.</p>
      </div>
      <a mat-flat-button routerLink="/monthly-planning">Adjust plan</a>
    </header>

    <section class="hero panel">
      <div>
        <span class="eyebrow">Financial health score</span>
        <strong>{{ summary().financialHealthScore }}</strong>
        <p>{{ coachLine() }}</p>
      </div>
      <mat-progress-bar mode="determinate" [value]="summary().financialHealthScore" />
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

    <section class="two-column">
      <mat-card class="panel">
        <mat-card-header>
          <mat-card-title>Budget utilization</mat-card-title>
          <mat-card-subtitle>{{ summary().budgetUtilization | number:'1.0-0' }}% used across variable categories</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <mat-progress-bar mode="determinate" [value]="summary().budgetUtilization" [ngClass]="utilizationClass()" />
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

      <mat-card class="panel">
        <mat-card-header>
          <mat-card-title>Upcoming modules</mat-card-title>
          <mat-card-subtitle>Planned placeholders kept visible without fake calculations.</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content class="chips">
          <mat-chip-set>
            <mat-chip>Loans: {{ summary().activeLoans }}</mat-chip>
            <mat-chip>EMI: {{ summary().monthlyEmiCommitment | currency:'INR':'symbol':'1.0-0' }}</mat-chip>
            <mat-chip>Goals: {{ summary().goalProgress | number:'1.0-0' }}%</mat-chip>
          </mat-chip-set>
        </mat-card-content>
      </mat-card>
    </section>
  `,
  styles: `
    .hero { display: grid; gap: 22px; margin-bottom: 16px; padding: clamp(20px, 4vw, 34px); }
    .hero strong { display: block; font-size: clamp(3rem, 10vw, 6rem); line-height: 0.9; }
    .eyebrow, .metric-card span { color: #66756d; font-size: 0.8rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
    .metrics { margin: 16px 0; }
    .metric-card strong { display: block; margin: 10px 0 4px; font-size: 1.6rem; }
    .metric-card small { color: #64716b; }
    .two-column { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(260px, 0.6fr); gap: 16px; }
    .budget-list { display: grid; gap: 12px; margin-top: 18px; }
    .budget-list div { display: flex; justify-content: space-between; gap: 12px; }
    .chips { padding-top: 20px; }
    @media (max-width: 820px) { .two-column { grid-template-columns: 1fr; } }
  `
})
export class DashboardPage {
  private readonly store = inject(FinancialStoreService);
  readonly summary = this.store.dashboard;
  readonly plan = this.store.monthlyPlan;

  readonly metrics = computed(() => [
    { label: 'Monthly income', value: this.summary().monthlyIncome, note: 'Planned income this month' },
    { label: 'Monthly expenses', value: this.summary().monthlyExpenses, note: 'Recurring plus spent variable' },
    { label: 'Remaining budget', value: this.summary().remainingBudget, note: 'After planned allocations' },
    { label: 'Investments', value: this.summary().investments, note: `${this.plan().savingsRate}% savings rate` }
  ]);

  readonly coachLine = computed(() => this.summary().remainingBudget >= 0
    ? 'Your plan has breathing room. Keep the categories updated and adapt when something changes.'
    : 'This month needs a softer landing. Rebalance one category before reducing long-term priorities.');

  utilizationClass(): string {
    const utilization = this.summary().budgetUtilization;
    return utilization > 100 ? 'over' : utilization > 80 ? 'watch' : 'steady';
  }
}