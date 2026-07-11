import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FinancialStoreService } from '../core/financial-store.service';
import { InvestmentCategory, InvestmentHolding } from '../models/finance.models';

@Component({
  selector: 'app-investments-page',
  imports: [CurrencyPipe, DecimalPipe, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatProgressBarModule, MatSnackBarModule, ReactiveFormsModule],
  template: `
    <header class="page-header">
      <div>
        <h1>Investments</h1>
        <p>Track what you already own, add monthly contributions, and estimate future value from your own rates.</p>
      </div>
    </header>

    <section class="summary-strip panel">
      <div><span>Total invested</span><strong>{{ store.investments().totalInvested | currency:'INR':'symbol':'1.0-0' }}</strong></div>
      <div><span>Current value</span><strong>{{ store.investments().totalCurrentValue | currency:'INR':'symbol':'1.0-0' }}</strong></div>
      <div><span>Gain / loss</span><strong>{{ store.investments().totalGainLoss | currency:'INR':'symbol':'1.0-0' }}</strong></div>
      <div><span>Return</span><strong>{{ store.investments().totalGainLossPercent | number:'1.0-2' }}%</strong></div>
      <div><span>Maturity outlook</span><strong>{{ totalMaturityValue() | currency:'INR':'symbol':'1.0-0' }}</strong></div>
    </section>

    <section class="investment-layout">
      <mat-card class="panel">
        <mat-card-header>
          <mat-card-title>Add holding</mat-card-title>
          <mat-card-subtitle>Manual rates keep the MVP free and under your control.</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="holdingForm" (ngSubmit)="saveHolding()" class="form-grid">
            <mat-form-field appearance="outline"><mat-label>Name</mat-label><input matInput formControlName="name" placeholder="Gold, Nifty SIP, Apple stock" /></mat-form-field>
            <label class="field-label">Category<select formControlName="category"><option value="Gold">Gold</option><option value="MutualFundSip">Mutual fund / SIP</option><option value="Stock">Stock</option><option value="FixedDepositPpf">FD / PPF</option><option value="Custom">Custom</option></select></label>
            <mat-form-field appearance="outline"><mat-label>Custom category</mat-label><input matInput formControlName="customCategory" /></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Amount invested</mat-label><input matInput type="number" formControlName="amountInvested" /></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Current value</mat-label><input matInput type="number" formControlName="currentValue" /></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Expected annual growth %</mat-label><input matInput type="number" formControlName="expectedAnnualReturnPercent" /></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Remaining tenure years</mat-label><input matInput type="number" formControlName="tenureYears" /></mat-form-field>
            <mat-form-field appearance="outline" class="wide"><mat-label>Notes</mat-label><input matInput formControlName="notes" /></mat-form-field>
            <button mat-flat-button type="submit" [disabled]="holdingForm.invalid || store.saving()">Save holding</button>
          </form>
        </mat-card-content>
      </mat-card>

      <div class="holdings-list">
        @for (holding of store.investments().holdings; track holding.id) {
          <mat-card class="panel holding-card">
            <mat-card-header>
              <mat-card-title>{{ holding.name }}</mat-card-title>
              <mat-card-subtitle>{{ categoryLabel(holding) }}</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div class="holding-metrics">
                <span>Invested <strong>{{ holding.investedAmount || 0 | currency:'INR':'symbol':'1.0-0' }}</strong></span>
                <span>Value <strong>{{ holding.currentValue || 0 | currency:'INR':'symbol':'1.0-0' }}</strong></span>
                <span>Gain/loss <strong>{{ holding.gainLoss || 0 | currency:'INR':'symbol':'1.0-0' }}</strong></span>
              </div>
              <div class="projection-header">
                <strong>Maturity outlook</strong>
                <small>{{ holding.tenureYears || 5 }} years remaining at {{ holding.expectedAnnualReturnPercent | number:'1.0-2' }}% expected annual growth</small>
              </div>
              <div class="maturity-total">
                <span>Predicted amount at maturity</span>
                <strong>{{ holding.projectedMaturityValue || holding.projectedValueFiveYears || 0 | currency:'INR':'symbol':'1.0-0' }}</strong>
              </div>
              <div class="projection-row">
                <span><small>1 year</small><strong>{{ holding.projectedValueOneYear || 0 | currency:'INR':'symbol':'1.0-0' }}</strong></span>
                <span><small>3 years</small><strong>{{ holding.projectedValueThreeYears || 0 | currency:'INR':'symbol':'1.0-0' }}</strong></span>
                <span><small>5 years</small><strong>{{ holding.projectedValueFiveYears || 0 | currency:'INR':'symbol':'1.0-0' }}</strong></span>
              </div>
              <form [formGroup]="contributionForm" (ngSubmit)="addContribution(holding)" class="contribution-row">
                <mat-form-field appearance="outline"><mat-label>Additional amount</mat-label><input matInput type="number" formControlName="amount" /></mat-form-field>
                <mat-form-field appearance="outline"><mat-label>Current total value</mat-label><input matInput type="number" formControlName="currentTotalValue" /></mat-form-field>
                <button mat-stroked-button type="submit" [disabled]="contributionForm.invalid || store.saving()">Add contribution</button>
                <button mat-button type="button" (click)="deleteHolding(holding)">Delete</button>
              </form>
            </mat-card-content>
          </mat-card>
        } @empty {
          <section class="panel empty-state"><strong>No investments added yet.</strong></section>
        }
      </div>
    </section>
  `,
  styles: `
    .summary-strip { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 14px; margin-bottom: 18px; padding: 18px; }
    .summary-strip div { background: rgba(255,255,255,0.48); border-radius: 8px; padding: 14px; }
    .summary-strip span { color: var(--fc-muted); display: block; font-size: 0.78rem; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; }
    .summary-strip strong { display: block; font-family: Newsreader, serif; font-size: 1.75rem; margin-top: 4px; }
    .investment-layout { display: grid; grid-template-columns: minmax(280px, 0.8fr) minmax(0, 1.2fr); gap: 18px; }
    .form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; padding-top: 16px; }
    .wide { grid-column: 1 / -1; }
    .field-label { border: 1px solid rgba(41,61,82,0.28); border-radius: 8px; color: var(--fc-muted); display: grid; font-size: 0.78rem; gap: 4px; padding: 7px 12px; }
    .field-label select { background: transparent; border: 0; font: inherit; min-height: 28px; outline: none; }
    .holdings-list { display: grid; gap: 16px; }
    .holding-card mat-card-content { display: grid; gap: 14px; padding-top: 16px; }
    .holding-metrics, .projection-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
    .holding-metrics span, .projection-row span { background: linear-gradient(145deg, rgba(255,255,255,0.72), rgba(241,237,224,0.7)); border-radius: 8px; padding: 12px; }
    .holding-metrics strong, .projection-row strong { display: block; }
    .projection-header { align-items: end; display: flex; gap: 12px; justify-content: space-between; }
    .projection-header strong { font-family: Newsreader, serif; font-size: 1.45rem; }
    .projection-header small, .projection-row small, .maturity-total span { color: var(--fc-muted); display: block; }
    .maturity-total { background: linear-gradient(135deg, rgba(47,93,124,0.12), rgba(216,189,124,0.18)); border: 1px solid rgba(47,93,124,0.16); border-radius: 8px; padding: 16px; }
    .maturity-total strong { display: block; font-family: Newsreader, serif; font-size: 2rem; margin-top: 4px; }
    .contribution-row { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)) auto auto; gap: 10px; align-items: start; }
    .empty-state { padding: 18px; }
    @media (max-width: 900px) { .investment-layout, .form-grid, .holding-metrics, .projection-row, .contribution-row { grid-template-columns: 1fr; } }
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
    amountInvested: [0, [Validators.required, Validators.min(0)]],
    currentValue: [0, [Validators.required, Validators.min(0)]],
    expectedAnnualReturnPercent: [0, [Validators.required, Validators.min(0)]],
    tenureYears: [5, [Validators.required, Validators.min(1), Validators.max(50)]],
    notes: ['']
  });

  readonly contributionForm = this.builder.nonNullable.group({
    amount: [0, [Validators.required, Validators.min(1)]],
    currentTotalValue: [0, [Validators.required, Validators.min(0)]],
    description: ['Monthly contribution']
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
    const amountInvested = Number(value.amountInvested || 0);
    const currentValue = Number(value.currentValue || 0);

    await this.store.saveInvestment({
      userProfileId: profile.id,
      name: value.name,
      category: value.category,
      customCategory: value.customCategory,
      quantity: amountInvested,
      averageCost: amountInvested > 0 ? 1 : 0,
      currentRate: amountInvested > 0 ? currentValue / amountInvested : 0,
      expectedAnnualReturnPercent: value.expectedAnnualReturnPercent,
      tenureYears: value.tenureYears,
      notes: value.notes
    });
    this.holdingForm.reset({ name: '', category: 'Gold', customCategory: '', amountInvested: 0, currentValue: 0, expectedAnnualReturnPercent: 0, tenureYears: 5, notes: '' });
    this.snackBar.open('Investment holding saved.', 'OK', { duration: 2500 });
  }

  async addContribution(holding: InvestmentHolding): Promise<void> {
    if (!holding.id) {
      return;
    }

    const value = this.contributionForm.getRawValue();
    const updatedAmount = Number(holding.investedAmount || 0) + Number(value.amount || 0);

    await this.store.addInvestmentContribution(holding.id, {
      contributionMonth: new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), 1)).toISOString(),
      amount: value.amount,
      quantityAdded: value.amount,
      rateAtContribution: updatedAmount > 0 && value.currentTotalValue > 0 ? value.currentTotalValue / updatedAmount : 0,
      description: value.description
    });
    this.contributionForm.reset({ amount: 0, currentTotalValue: 0, description: 'Monthly contribution' });
    this.snackBar.open('Investment contribution added.', 'OK', { duration: 2500 });
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

  totalProjectedValue(years: 1 | 3 | 5): number {
    const key = years === 1 ? 'projectedValueOneYear' : years === 3 ? 'projectedValueThreeYears' : 'projectedValueFiveYears';
    return this.store.investments().holdings.reduce((total, holding) => total + Number(holding[key] || 0), 0);
  }

  totalMaturityValue(): number {
    return this.store.investments().holdings.reduce((total, holding) => total + Number(holding.projectedMaturityValue || holding.projectedValueFiveYears || 0), 0);
  }
}