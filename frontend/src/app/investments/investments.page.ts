import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { FinancialStoreService } from '../core/financial-store.service';
import { InvestmentCategory, InvestmentHolding } from '../models/finance.models';

@Component({
  selector: 'app-investments-page',
  imports: [CurrencyPipe, DecimalPipe, MatButtonModule, MatCardModule, MatExpansionModule, MatFormFieldModule, MatInputModule, MatProgressBarModule, MatSnackBarModule, MatTabsModule, ReactiveFormsModule],
  template: `
    <header class="page-header">
      <div>
        <h1>Investments</h1>
        <p>Track what you already own, add monthly contributions, and estimate future value from your own rates.</p>
      </div>
    </header>

    <section class="summary-strip panel">
      <div><span>Invested</span><strong>{{ store.investments().totalInvested | currency:'INR':'symbol':'1.0-0' }}</strong></div>
      <div><span>Current value</span><strong>{{ store.investments().totalCurrentValue | currency:'INR':'symbol':'1.0-0' }}</strong></div>
      <div><span>Maturity outlook</span><strong>{{ totalMaturityValue() | currency:'INR':'symbol':'1.0-0' }}</strong></div>
      <div><span>Gain / loss</span><strong>{{ store.investments().totalGainLoss | currency:'INR':'symbol':'1.0-0' }}</strong></div>
    </section>

    <section class="investment-layout">
      <mat-accordion class="add-holding-accordion">
        <mat-expansion-panel class="panel add-holding-panel">
          <mat-expansion-panel-header>
            <mat-panel-title>Add holding</mat-panel-title>
          </mat-expansion-panel-header>
          <form [formGroup]="holdingForm" (ngSubmit)="saveHolding()" class="form-grid">
            <mat-form-field appearance="outline"><mat-label>Name</mat-label><input matInput formControlName="name" placeholder="Gold, Nifty SIP, Apple stock" /></mat-form-field>
            <label class="field-label">Category<select formControlName="category"><option value="Gold">Gold</option><option value="MutualFundSip">Mutual fund / SIP</option><option value="Stock">Stock</option><option value="FixedDepositPpf">FD / PPF</option><option value="Custom">Custom</option></select></label>
            <mat-form-field appearance="outline"><mat-label>Custom category</mat-label><input matInput formControlName="customCategory" /></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Current value</mat-label><input matInput type="number" formControlName="currentValue" /></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Contribution this month</mat-label><input matInput type="number" formControlName="monthlyContribution" /></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Expected annual growth %</mat-label><input matInput type="number" formControlName="expectedAnnualReturnPercent" /></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Remaining tenure years</mat-label><input matInput type="number" formControlName="tenureYears" /></mat-form-field>
            <mat-form-field appearance="outline" class="wide"><mat-label>Notes</mat-label><input matInput formControlName="notes" /></mat-form-field>
            <button mat-flat-button type="submit" [disabled]="holdingForm.invalid || store.saving()">Save holding</button>
          </form>
        </mat-expansion-panel>
      </mat-accordion>

      @if (store.investments().holdings.length > 0) {
        <mat-card class="panel holdings-tabs">
          <mat-tab-group mat-stretch-tabs="false" mat-align-tabs="start">
            @for (holding of store.investments().holdings; track holding.id) {
              <mat-tab [label]="holding.name">
                <section class="holding-detail">
                  <div class="description-block">
                    <span>{{ categoryLabel(holding) }}</span>
                    <strong>{{ holding.name }}</strong>
                    <p>{{ holding.notes || holdingDescription(holding) }}</p>
                  </div>
                  <div class="holding-metrics">
                    <span>Current value <strong>{{ holding.currentValue || 0 | currency:'INR':'symbol':'1.0-0' }}</strong></span>
                    <span>Monthly contribution <strong>{{ holding.monthlyContributionAmount || 0 | currency:'INR':'symbol':'1.0-0' }}</strong></span>
                    <span>Tenure <strong>{{ holding.tenureYears || 5 }} years</strong></span>
                  </div>
                  <div class="maturity-total">
                    <span>Maturity at {{ holding.expectedAnnualReturnPercent | number:'1.0-2' }}%</span>
                    <strong>{{ holding.projectedMaturityValue || holding.projectedValueFiveYears || 0 | currency:'INR':'symbol':'1.0-0' }}</strong>
                  </div>
                  <div class="projection-row">
                    <span><small>1 year</small><strong>{{ holding.projectedValueOneYear || 0 | currency:'INR':'symbol':'1.0-0' }}</strong></span>
                    <span><small>3 years</small><strong>{{ holding.projectedValueThreeYears || 0 | currency:'INR':'symbol':'1.0-0' }}</strong></span>
                    <span><small>5 years</small><strong>{{ holding.projectedValueFiveYears || 0 | currency:'INR':'symbol':'1.0-0' }}</strong></span>
                  </div>
                  <div class="holding-actions">
                    <button mat-button type="button" (click)="deleteHolding(holding)">Delete</button>
                  </div>
                </section>
              </mat-tab>
            }
          </mat-tab-group>
        </mat-card>
      } @else {
        <section class="panel empty-state"><strong>No investments added yet.</strong></section>
      }
    </section>
  `,
  styles: `
    .summary-strip { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; margin-bottom: 14px; padding: 14px; }
    .summary-strip div { background: var(--fc-card-soft); border-radius: 8px; padding: 10px; }
    .summary-strip span { color: var(--fc-muted); display: block; font-size: 0.78rem; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; }
    .summary-strip strong { display: block; font-family: Newsreader, serif; font-size: 1.35rem; margin-top: 3px; }
    .investment-layout { display: grid; grid-template-columns: minmax(280px, 0.72fr) minmax(0, 1.28fr); gap: 14px; }
    .add-holding-accordion { align-self: start; display: block; }
    .add-holding-panel { background: var(--fc-panel); box-shadow: var(--fc-shadow); }
    .add-holding-panel mat-panel-title { color: var(--fc-ink); font-weight: 900; }
    .form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; padding-top: 12px; }
    .wide { grid-column: 1 / -1; }
    .field-label { border: 1px solid rgba(41,61,82,0.28); border-radius: 8px; color: var(--fc-muted); display: grid; font-size: 0.78rem; gap: 4px; padding: 7px 12px; }
    .field-label select { background: transparent; border: 0; font: inherit; min-height: 28px; outline: none; }
    .holdings-tabs { align-self: start; padding: 6px 12px 14px; }
    .holding-detail { display: grid; gap: 10px; padding-top: 14px; }
    .description-block { background: var(--fc-card-soft); border: 1px solid var(--fc-border); border-radius: 8px; padding: 12px; }
    .description-block span { color: var(--fc-muted); display: block; font-size: 0.78rem; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; }
    .description-block strong { display: block; font-family: Newsreader, serif; font-size: 1.55rem; margin-top: 2px; }
    .description-block p { color: var(--fc-muted); margin: 4px 0 0; }
    .holding-metrics, .projection-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
    .holding-metrics span, .projection-row span { background: var(--fc-card-soft); border-radius: 8px; padding: 10px; }
    .holding-metrics strong, .projection-row strong { display: block; }
    .projection-row small, .maturity-total span { color: var(--fc-muted); display: block; }
    .maturity-total { background: linear-gradient(135deg, rgba(47,93,124,0.12), rgba(216,189,124,0.18)); border: 1px solid rgba(47,93,124,0.16); border-radius: 8px; padding: 12px; }
    .maturity-total strong { display: block; font-family: Newsreader, serif; font-size: 1.65rem; margin-top: 2px; }
    .holding-actions { display: flex; justify-content: flex-end; }
    .empty-state { padding: 18px; }
    @media (max-width: 900px) { .summary-strip { grid-template-columns: repeat(2, minmax(0, 1fr)); } .investment-layout, .form-grid, .holding-metrics, .projection-row { grid-template-columns: 1fr; } }
  `
})
export class InvestmentsPage implements OnInit {
  readonly store = inject(FinancialStoreService);
  private readonly builder = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);

  readonly holdingForm = this.builder.nonNullable.group({
    name: ['', Validators.required],
    category: ['Gold' as InvestmentCategory, Validators.required],
    customCategory: [''],
    currentValue: [0, [Validators.required, Validators.min(0)]],
    monthlyContribution: [0, [Validators.required, Validators.min(0)]],
    expectedAnnualReturnPercent: [0, [Validators.required, Validators.min(0)]],
    tenureYears: [5, [Validators.required, Validators.min(1), Validators.max(50)]],
    notes: ['']
  });

  async ngOnInit(): Promise<void> {
    await this.store.loadInvestments();
  }

  async saveHolding(): Promise<void> {
    const profile = this.store.profile() ?? await this.store.loadProfile();

    if (!profile) {
      this.snackBar.open('Create your profile before adding investments.', 'OK', { duration: 3500 });
      return;
    }

    const value = this.holdingForm.getRawValue();
    const currentValue = Number(value.currentValue || 0);
    const monthlyContribution = Number(value.monthlyContribution || 0);

    await this.store.saveInvestment({
      userProfileId: profile.id,
      name: value.name,
      category: value.category,
      customCategory: value.customCategory,
      quantity: currentValue,
      averageCost: currentValue > 0 ? 1 : 0,
      currentRate: currentValue > 0 ? 1 : 0,
      expectedAnnualReturnPercent: value.expectedAnnualReturnPercent,
      tenureYears: value.tenureYears,
      monthlyContributionAmount: monthlyContribution,
      notes: value.notes
    });

    this.holdingForm.reset({ name: '', category: 'Gold', customCategory: '', currentValue: 0, monthlyContribution: 0, expectedAnnualReturnPercent: 0, tenureYears: 5, notes: '' });
    this.snackBar.open('Investment holding saved. Add this month\'s allocation in Monthly Plan.', 'OK', { duration: 3500 });
  }

  async deleteHolding(holding: InvestmentHolding): Promise<void> {
    if (!holding.id || !confirm(`Delete investment "${holding.name}" and its contributions?`)) {
      return;
    }

    await this.store.deleteInvestment(holding.id);
  }

  categoryLabel(holding: InvestmentHolding): string {
    return holding.category === 'Custom' ? holding.customCategory : holding.category;
  }

  holdingDescription(holding: InvestmentHolding): string {
    const contribution = Number(holding.monthlyContributionAmount || 0);
    const tenure = Number(holding.tenureYears || 5);
    return contribution > 0
      ? `Planned monthly contribution of ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(contribution)} for ${tenure} years.`
      : `Tracking current value and projected maturity over ${tenure} years.`;
  }

  totalProjectedValue(years: 1 | 3 | 5): number {
    const key = years === 1 ? 'projectedValueOneYear' : years === 3 ? 'projectedValueThreeYears' : 'projectedValueFiveYears';
    return this.store.investments().holdings.reduce((total, holding) => total + Number(holding[key] || 0), 0);
  }

  totalMaturityValue(): number {
    return this.store.investments().holdings.reduce((total, holding) => total + Number(holding.projectedMaturityValue || holding.projectedValueFiveYears || 0), 0);
  }
}