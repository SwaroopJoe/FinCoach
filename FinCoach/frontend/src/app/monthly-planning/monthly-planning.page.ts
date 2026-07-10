import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FinancialStoreService } from '../core/financial-store.service';
import { MonthlyPlan } from '../models/finance.models';

@Component({
  selector: 'app-monthly-planning-page',
  imports: [CurrencyPipe, DecimalPipe, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatProgressBarModule, ReactiveFormsModule],
  template: `
    <header class="page-header">
      <div>
        <h1>Monthly planning</h1>
        <p>Plan the month before it starts. Keep the numbers honest, then adjust without guilt.</p>
      </div>
    </header>

    <section class="summary-strip panel">
      <div><span>Total income</span><strong>{{ preview.totalIncome | currency:'INR':'symbol':'1.0-0' }}</strong></div>
      <div><span>Total allocation</span><strong>{{ preview.totalAllocation | currency:'INR':'symbol':'1.0-0' }}</strong></div>
      <div><span>Remaining</span><strong>{{ preview.remainingBalance | currency:'INR':'symbol':'1.0-0' }}</strong></div>
      <div><span>Savings rate</span><strong>{{ preview.savingsRate | number:'1.0-2' }}%</strong></div>
    </section>

    <form [formGroup]="form" (ngSubmit)="save()" class="planning-grid">
      <mat-card class="panel"><mat-card-header><mat-card-title>Income</mat-card-title></mat-card-header><mat-card-content>@for (group of income.controls; track $index) { <ng-container [formGroup]="asGroup(group)"><mat-form-field appearance="outline"><mat-label>Name</mat-label><input matInput formControlName="name" /></mat-form-field><mat-form-field appearance="outline"><mat-label>Amount</mat-label><input matInput type="number" formControlName="amount" /></mat-form-field></ng-container> }<button mat-button type="button" (click)="addMoneyLine(income)">Add income</button></mat-card-content></mat-card>

      <mat-card class="panel"><mat-card-header><mat-card-title>Recurring expenses</mat-card-title></mat-card-header><mat-card-content>@for (group of recurring.controls; track $index) { <ng-container [formGroup]="asGroup(group)"><mat-form-field appearance="outline"><mat-label>Category</mat-label><input matInput formControlName="name" /></mat-form-field><mat-form-field appearance="outline"><mat-label>Amount</mat-label><input matInput type="number" formControlName="amount" /></mat-form-field></ng-container> }<button mat-button type="button" (click)="addMoneyLine(recurring)">Add expense</button></mat-card-content></mat-card>

      <mat-card class="panel"><mat-card-header><mat-card-title>Investments</mat-card-title></mat-card-header><mat-card-content>@for (group of investments.controls; track $index) { <ng-container [formGroup]="asGroup(group)"><mat-form-field appearance="outline"><mat-label>Category</mat-label><input matInput formControlName="name" /></mat-form-field><mat-form-field appearance="outline"><mat-label>Amount</mat-label><input matInput type="number" formControlName="amount" /></mat-form-field></ng-container> }<button mat-button type="button" (click)="addMoneyLine(investments)">Add investment</button></mat-card-content></mat-card>

      <mat-card class="panel"><mat-card-header><mat-card-title>Variable budgets</mat-card-title></mat-card-header><mat-card-content>@for (group of variables.controls; track $index) { <ng-container [formGroup]="asGroup(group)"><mat-form-field appearance="outline"><mat-label>Category</mat-label><input matInput formControlName="category" /></mat-form-field><mat-form-field appearance="outline"><mat-label>Budget</mat-label><input matInput type="number" formControlName="budgetAmount" /></mat-form-field><mat-form-field appearance="outline"><mat-label>Spent</mat-label><input matInput type="number" formControlName="spentAmount" /></mat-form-field></ng-container> }<button mat-button type="button" (click)="addVariableLine()">Add category</button></mat-card-content></mat-card>

      <div class="actions"><button mat-flat-button type="submit" [disabled]="form.invalid">Save monthly plan</button></div>
    </form>
  `,
  styles: `
    .summary-strip { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px; margin-bottom: 16px; padding: 18px; }
    .summary-strip span { color: #64716b; display: block; font-size: 0.82rem; }
    .summary-strip strong { display: block; font-size: 1.45rem; margin-top: 4px; }
    .planning-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
    mat-card-content { display: grid; gap: 10px; padding-top: 16px; }
    ng-container { display: grid; grid-template-columns: 1fr 150px; gap: 10px; }
    .planning-grid mat-card:nth-child(4) ng-container { grid-template-columns: 1fr 130px 130px; }
    .actions { grid-column: 1 / -1; display: flex; justify-content: flex-end; }
    @media (max-width: 900px) { .planning-grid { grid-template-columns: 1fr; } ng-container, .planning-grid mat-card:nth-child(4) ng-container { grid-template-columns: 1fr; } }
  `
})
export class MonthlyPlanningPage {
  private readonly store = inject(FinancialStoreService);
  private readonly builder = inject(FormBuilder);
  private readonly plan = this.store.monthlyPlan();

  readonly form = this.builder.group({
    incomeItems: this.builder.array(this.plan.incomeItems.map((item) => this.moneyLine(item.name, item.amount))),
    recurringExpenses: this.builder.array(this.plan.recurringExpenses.map((item) => this.moneyLine(item.name, item.amount))),
    investments: this.builder.array(this.plan.investments.map((item) => this.moneyLine(item.name, item.amount))),
    variableBudgets: this.builder.array(this.plan.variableBudgets.map((item) => this.variableLine(item.category, item.budgetAmount, item.spentAmount)))
  });

  get income(): FormArray { return this.form.controls.incomeItems; }
  get recurring(): FormArray { return this.form.controls.recurringExpenses; }
  get investments(): FormArray { return this.form.controls.investments; }
  get variables(): FormArray { return this.form.controls.variableBudgets; }

  get preview(): MonthlyPlan {
    return this.store.calculatePlan(this.formToPlan());
  }

  asGroup(control: AbstractControl): FormGroup {
    return control as FormGroup;
  }

  addMoneyLine(array: FormArray): void {
    array.push(this.moneyLine('', 0));
  }

  addVariableLine(): void {
    this.variables.push(this.variableLine('', 0, 0));
  }

  save(): void {
    this.store.savePlan(this.formToPlan());
  }

  private formToPlan(): MonthlyPlan {
    const value = this.form.getRawValue();
    return {
      ...this.plan,
      incomeItems: value.incomeItems,
      recurringExpenses: value.recurringExpenses,
      investments: value.investments,
      variableBudgets: value.variableBudgets
    };
  }

  private moneyLine(name: string, amount: number) {
    return this.builder.nonNullable.group({ name: [name, Validators.required], amount: [amount, [Validators.required, Validators.min(0)]] });
  }

  private variableLine(category: string, budgetAmount: number, spentAmount: number) {
    return this.builder.nonNullable.group({
      category: [category, Validators.required],
      budgetAmount: [budgetAmount, [Validators.required, Validators.min(0)]],
      spentAmount: [spentAmount, [Validators.required, Validators.min(0)]]
    });
  }
}