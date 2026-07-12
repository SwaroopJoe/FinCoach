import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FinancialStoreService } from '../core/financial-store.service';
import { MonthlyPlan } from '../models/finance.models';

@Component({
  selector: 'app-monthly-planning-page',
  imports: [CurrencyPipe, DecimalPipe, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatProgressBarModule, MatSnackBarModule, ReactiveFormsModule],
  template: `
    <header class="page-header">
      <div>
        <h1>Monthly planning</h1>
        <p>{{ store.selectedPlanMonthLabel() }} plan. Keep the numbers honest, then adjust without guilt.</p>
      </div>
      <div class="month-actions">
        <button mat-stroked-button type="button" (click)="changeMonth(-1)" [disabled]="store.saving()">Previous</button>
        <strong>{{ store.selectedPlanMonthLabel() }}</strong>
        <button mat-stroked-button type="button" (click)="changeMonth(1)" [disabled]="store.saving()">Next</button>
        @if (!hasSavedPlan) {
          <button mat-flat-button type="button" (click)="startFromPreviousMonth()" [disabled]="store.saving()">Start from previous</button>
        }
        <button mat-stroked-button type="button" (click)="resetMonthlyPlan()" [disabled]="store.saving() || !hasSavedPlan">Reset plan</button>
      </div>
    </header>

    <section class="summary-strip panel">
      <div><span>Total income</span><strong>{{ preview.totalIncome | currency:'INR':'symbol':'1.0-0' }}</strong></div>
      <div><span>Total allocation</span><strong>{{ preview.totalAllocation | currency:'INR':'symbol':'1.0-0' }}</strong></div>
      <div><span>Remaining</span><strong>{{ preview.remainingBalance | currency:'INR':'symbol':'1.0-0' }}</strong></div>
      <div><span>Borrowing / shortage</span><strong>{{ preview.totalBorrowingShortage | currency:'INR':'symbol':'1.0-0' }}</strong></div>
      <div><span>Savings rate</span><strong>{{ preview.savingsRate | number:'1.0-2' }}%</strong></div>
    </section>

    @if (budgetOverruns.length > 0) {
      <section class="overrun-guide panel">
        <div>
          <span class="guide-label">Limit exceeded</span>
          <strong>{{ budgetOverruns[0].category }} is over by {{ budgetOverruns[0].amount | currency:'INR':'symbol':'1.0-0' }}</strong>
          <p>Increase the category limit if this spending is real, then rebalance from explicit savings buffer first and investment allocations next.</p>
          @if (lowPriorityGoalNames.length > 0) {
            <small>Goal note: consider skipping this month's additions to low-priority goals like {{ lowPriorityGoalNames.join(', ') }} until goal allocations are part of monthly planning.</small>
          }
        </div>
        <button mat-flat-button type="button" (click)="rebalanceOverrun(budgetOverruns[0].category)">Increase limit & rebalance</button>
      </section>
    }

    @if (unallocatedAmount > 0) {
      <section class="allocation-guide panel">
        <div>
          <span class="guide-label">Available to assign</span>
          <strong>{{ unallocatedAmount | currency:'INR':'symbol':'1.0-0' }}</strong>
          <p>This amount is not assigned yet. You can save now, or decide where this money should go.</p>
        </div>
        <div class="guide-actions">
          <button mat-stroked-button type="button" (click)="addUnallocatedToInvestment()">Add to investments</button>
          <button mat-stroked-button type="button" (click)="keepUnallocatedAsSavingsBuffer()">Keep as savings buffer</button>
          <button mat-stroked-button type="button" (click)="addUnallocatedAsExpectedExpense()">Add expected expense</button>
        </div>
      </section>
    } @else if (overAllocatedAmount > 0) {
      <section class="allocation-guide warning panel">
        <div>
          <span class="guide-label">Over allocated</span>
          <strong>{{ overAllocatedAmount | currency:'INR':'symbol':'1.0-0' }}</strong>
          <p>Your planned expenses, budgets, and investments are higher than income. Reduce one category before relying on this plan.</p>
        </div>
      </section>
    }

    <form [formGroup]="form" (ngSubmit)="save()" class="planning-grid">
      <mat-card class="panel planning-card">
        <mat-card-header>
          <mat-card-title>Income</mat-card-title>
          <button mat-stroked-button type="button" (click)="addMoneyLine(income, true)">Add income</button>
        </mat-card-header>
        <mat-card-content>
          @for (group of income.controls; track group) {
            <div class="line-row" [formGroup]="asGroup(group)">
              <mat-form-field appearance="outline"><mat-label>Name</mat-label><input matInput formControlName="name" /></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>Amount</mat-label><input matInput type="number" formControlName="amount" /></mat-form-field>
              <button mat-button type="button" (click)="removeLine(income, $index)" [disabled]="income.length === 1">Remove</button>
            </div>
          }
        </mat-card-content>
      </mat-card>

      <mat-card class="panel planning-card">
        <mat-card-header>
          <mat-card-title>Recurring expenses</mat-card-title>
          <button mat-stroked-button type="button" (click)="addMoneyLine(recurring)">Add recurring expense</button>
        </mat-card-header>
        <mat-card-content>
          @for (group of recurring.controls; track group) {
            <div class="line-row" [formGroup]="asGroup(group)">
              <mat-form-field appearance="outline"><mat-label>Expense name</mat-label><input matInput formControlName="name" placeholder="Rent, Insurance, Subscription" /></mat-form-field>
              @if (asGroup(group).hasError('nameRequired')) {
                <span class="line-error">Add a name or clear the amount.</span>
              }
              <mat-form-field appearance="outline"><mat-label>Monthly amount</mat-label><input matInput type="number" formControlName="amount" /></mat-form-field>
              <button mat-button type="button" (click)="removeLine(recurring, $index)" [disabled]="recurring.length === 1">Remove</button>
            </div>
          }
        </mat-card-content>
      </mat-card>

      <mat-card class="panel planning-card">
        <mat-card-header>
          <mat-card-title>Investments</mat-card-title>
          <button mat-stroked-button type="button" (click)="addMoneyLine(investments)">Add investment</button>
        </mat-card-header>
        <mat-card-content>
          @for (group of investments.controls; track group) {
            <div class="line-row" [formGroup]="asGroup(group)">
              <mat-form-field appearance="outline"><mat-label>Investment</mat-label><input matInput formControlName="name" placeholder="SIP, PPF, Emergency fund" /></mat-form-field>
              @if (asGroup(group).hasError('nameRequired')) {
                <span class="line-error">Add a name or clear the amount.</span>
              }
              <mat-form-field appearance="outline"><mat-label>Amount</mat-label><input matInput type="number" formControlName="amount" /></mat-form-field>
              <button mat-button type="button" (click)="removeLine(investments, $index)" [disabled]="investments.length === 1">Remove</button>
            </div>
          }
        </mat-card-content>
      </mat-card>

      <mat-card class="panel planning-card">
        <mat-card-header>
          <mat-card-title>Variable budgets</mat-card-title>
          <button mat-stroked-button type="button" (click)="addVariableLine()">Add budget category</button>
        </mat-card-header>
        <mat-card-content>
          @for (group of variables.controls; track group) {
            <div class="line-row variable-row" [formGroup]="asGroup(group)">
              <mat-form-field appearance="outline"><mat-label>Category</mat-label><input matInput formControlName="category" placeholder="Grocery, Fuel, Dining" /></mat-form-field>
              @if (asGroup(group).hasError('categoryRequired')) {
                <span class="line-error">Add a category or clear the amounts.</span>
              }
              <mat-form-field appearance="outline"><mat-label>Budget</mat-label><input matInput type="number" formControlName="budgetAmount" /></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>Spent</mat-label><input matInput type="number" formControlName="spentAmount" /></mat-form-field>
              <button mat-button type="button" (click)="removeLine(variables, $index)" [disabled]="variables.length === 1">Remove</button>
            </div>
          }
        </mat-card-content>
      </mat-card>

      <mat-card class="panel planning-card shortage-card">
        <mat-card-header>
          <mat-card-title>Borrowing / shortage</mat-card-title>
          <button mat-stroked-button type="button" (click)="addBorrowingLine()">Add shortage</button>
        </mat-card-header>
        <mat-card-content>
          @if (borrowing.length === 0) {
            <p class="helper-copy">Shortage appears here when an overrun cannot be covered by buffer or investment allocation.</p>
          }
          @for (group of borrowing.controls; track group) {
            <div class="line-row shortage-row" [formGroup]="asGroup(group)">
              <mat-form-field appearance="outline"><mat-label>Name</mat-label><input matInput formControlName="name" placeholder="Grocery shortage" /></mat-form-field>
              @if (asGroup(group).hasError('nameRequired')) {
                <span class="line-error">Add a name or clear the amount.</span>
              }
              <mat-form-field appearance="outline"><mat-label>Amount</mat-label><input matInput type="number" formControlName="amount" /></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>Reason</mat-label><input matInput formControlName="reason" /></mat-form-field>
              <button mat-button type="button" (click)="removeBorrowingLine($index)">Remove</button>
            </div>
          }
        </mat-card-content>
      </mat-card>

      <div class="actions">
        @if (lastSavedAt) {
          <span class="save-status">Saved at {{ lastSavedAt }}</span>
        }
        @if (store.error()) {
          <span class="error-text">{{ store.error() }}</span>
        }
        <button mat-flat-button type="submit" [disabled]="form.invalid || store.saving()">{{ store.saving() ? 'Saving...' : 'Save monthly plan' }}</button>
      </div>
    </form>
  `,
  styles: `
    .summary-strip { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px; margin-bottom: 18px; padding: 18px; }
    .summary-strip div { border-radius: 8px; background: rgba(255,255,255,0.46); padding: 14px; }
    .summary-strip span { color: var(--fc-muted); display: block; font-size: 0.78rem; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; }
    .summary-strip strong { display: block; font-family: Newsreader, serif; font-size: 1.8rem; margin-top: 4px; }
    .allocation-guide { display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-bottom: 18px; padding: 20px; border-left: 4px solid var(--fc-primary); }
    .allocation-guide.warning { border-left-color: #b85c00; }
    .allocation-guide strong { display: block; margin: 4px 0; font-family: Newsreader, serif; font-size: 2rem; }
    .allocation-guide p { margin: 0; color: var(--fc-muted); }
    .overrun-guide { display: flex; align-items: center; justify-content: space-between; gap: 18px; margin-bottom: 18px; padding: 20px; border-left: 4px solid #9b3f2f; }
    .overrun-guide strong { display: block; margin: 4px 0; font-family: Newsreader, serif; font-size: 1.9rem; }
    .overrun-guide p { margin: 0; color: var(--fc-muted); }
    .overrun-guide small { color: var(--fc-muted); display: block; margin-top: 8px; }
    .guide-label { color: var(--fc-primary-deep); font-size: 0.78rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; }
    .guide-actions { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 10px; }
    .planning-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
    .planning-card { align-self: start; overflow: visible; }
    .planning-card mat-card-header { align-items: center; justify-content: space-between; gap: 12px; }
    .planning-card mat-card-title { font-size: 1.25rem; }
    mat-card-content { display: grid; gap: 14px; overflow: visible; padding-top: 18px; }
    .line-row { display: grid; grid-template-columns: minmax(160px, 1fr) 150px auto; gap: 10px; align-items: start; }
    .variable-row { grid-template-columns: minmax(150px, 1fr) 120px 120px auto; }
    .shortage-row { grid-template-columns: minmax(150px, 1fr) 120px minmax(160px, 1fr) auto; }
    .shortage-card { grid-column: 1 / -1; }
    .helper-copy { color: var(--fc-muted); margin: 0; }
    .line-error { align-self: center; color: #b3261e; font-size: 0.82rem; }
    .line-row button { min-height: 48px; }
    .actions { grid-column: 1 / -1; display: flex; align-items: center; justify-content: flex-end; gap: 16px; }
    .month-actions { align-items: center; display: flex; flex-wrap: wrap; gap: 10px; justify-content: flex-end; }
    .month-actions strong { color: var(--fc-primary-deep); min-width: 130px; text-align: center; }
    .save-status { color: #4f625b; font-size: 0.9rem; }
    .error-text { color: #b3261e; font-size: 0.9rem; }
    @media (max-width: 900px) { .allocation-guide, .overrun-guide { align-items: stretch; flex-direction: column; } .guide-actions { justify-content: flex-start; } .planning-grid { grid-template-columns: 1fr; } .line-row, .variable-row, .shortage-row { grid-template-columns: 1fr; } }
  `
})
export class MonthlyPlanningPage {
  readonly store = inject(FinancialStoreService);
  private readonly builder = inject(FormBuilder);
  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private plan = this.store.monthlyPlan();
  lastSavedAt = '';

  readonly form = this.builder.group({
    incomeItems: this.builder.array(this.plan.incomeItems.map((item) => this.moneyLine(item.name, item.amount))),
    recurringExpenses: this.builder.array(this.plan.recurringExpenses.map((item) => this.optionalMoneyLine(item.name, item.amount))),
    investments: this.builder.array(this.plan.investments.map((item) => this.optionalMoneyLine(item.name, item.amount))),
    variableBudgets: this.builder.array(this.plan.variableBudgets.map((item) => this.optionalVariableLine(item.category, item.budgetAmount, item.spentAmount))),
    borrowingShortages: this.builder.array(this.plan.borrowingShortages.map((item) => this.optionalBorrowingLine(item.name, item.amount, item.reason)))
  });

  get income(): FormArray { return this.form.controls.incomeItems; }
  get recurring(): FormArray { return this.form.controls.recurringExpenses; }
  get investments(): FormArray { return this.form.controls.investments; }
  get variables(): FormArray { return this.form.controls.variableBudgets; }
  get borrowing(): FormArray { return this.form.controls.borrowingShortages; }

  get hasSavedPlan(): boolean {
    return Boolean(this.plan.id);
  }

  get preview(): MonthlyPlan {
    return this.store.calculatePlan(this.formToPlan());
  }

  get unallocatedAmount(): number {
    return Math.max(Number(this.preview.remainingBalance || 0), 0);
  }

  get overAllocatedAmount(): number {
    return Math.max(Number(-this.preview.remainingBalance || 0), 0);
  }

  get budgetOverruns(): { category: string; amount: number; spentAmount: number; budgetAmount: number }[] {
    return this.preview.variableBudgets
      .filter((item) => Number(item.spentAmount || 0) > Number(item.budgetAmount || 0))
      .map((item) => ({
        category: item.category,
        amount: Math.max(Number(item.spentAmount || 0) - Number(item.budgetAmount || 0) - this.coveredShortageAmount(item.category), 0),
        spentAmount: Number(item.spentAmount || 0),
        budgetAmount: Number(item.budgetAmount || 0)
      }))
      .filter((item) => item.amount > 0);
  }

  get lowPriorityGoalNames(): string[] {
    return this.store.goals().filter((goal) => goal.priority === 'Low').map((goal) => goal.name).slice(0, 3);
  }

  async ngOnInit(): Promise<void> {
    this.plan = await this.store.loadMonthlyPlanForSelectedMonth();
    await this.store.loadGoals();
    this.replaceFormWithPlan(this.plan);
  }

  async changeMonth(offset: number): Promise<void> {
    this.plan = await this.store.changeSelectedMonth(offset);
    this.replaceFormWithPlan(this.plan);
    this.lastSavedAt = '';
  }

  async startFromPreviousMonth(): Promise<void> {
    this.plan = await this.store.startSelectedMonthFromPreviousPlan();
    this.replaceFormWithPlan(this.plan);
    this.lastSavedAt = '';
  }

  asGroup(control: AbstractControl): FormGroup {
    return control as FormGroup;
  }

  addMoneyLine(array: FormArray, required = false): void {
    array.insert(0, required ? this.moneyLine('', 0) : this.optionalMoneyLine('', 0));
  }

  addVariableLine(): void {
    this.variables.insert(0, this.optionalVariableLine('', 0, 0));
  }

  addBorrowingLine(): void {
    this.borrowing.insert(0, this.optionalBorrowingLine('', 0, ''));
  }

  removeLine(array: FormArray, index: number): void {
    if (array.length > 1) {
      array.removeAt(index);
    }
  }

  removeBorrowingLine(index: number): void {
    this.borrowing.removeAt(index);
  }

  rebalanceOverrun(category: string): void {
    const variableGroup = this.variables.controls
      .map((control) => this.asGroup(control))
      .find((group) => String(group.get('category')?.value ?? '').trim() === category);

    if (!variableGroup) {
      return;
    }

    const budgetAmount = Number(variableGroup.get('budgetAmount')?.value ?? 0);
    const spentAmount = Number(variableGroup.get('spentAmount')?.value ?? 0);
    let remainingNeed = Math.max(spentAmount - budgetAmount, 0);

    if (remainingNeed <= 0) {
      return;
    }

    variableGroup.patchValue({ budgetAmount: spentAmount });
    remainingNeed = this.reduceInvestmentRows(remainingNeed, true);
    remainingNeed = this.reduceInvestmentRows(remainingNeed, false);
    this.upsertBorrowingShortage(category, remainingNeed);
    this.form.markAsDirty();

    const message = remainingNeed > 0
      ? `${category} limit increased. ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(remainingNeed)} remains as shortage.`
      : `${category} limit increased and rebalanced from buffer/investments.`;

    this.snackBar.open(message, 'OK', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom'
    });
  }

  addUnallocatedToInvestment(): void {
    this.assignUnallocatedInvestment('Investment allocation');
  }

  keepUnallocatedAsSavingsBuffer(): void {
    this.assignUnallocatedInvestment('Savings buffer');
  }

  addUnallocatedAsExpectedExpense(): void {
    const amount = this.unallocatedAmount;

    if (amount <= 0) {
      return;
    }

    this.variables.insert(0, this.optionalVariableLine('', amount, 0));
    this.variables.at(0)?.markAsTouched();
  }

  async save(): Promise<void> {
    if (!this.store.profile()) {
      this.snackBar.open('Create your profile before saving a monthly plan.', 'Go to profile', {
        duration: 4500,
        horizontalPosition: 'right',
        verticalPosition: 'bottom'
      });
      return;
    }

    try {
      const savedPlan = await this.store.savePlan(this.formToPlan());
      this.plan = savedPlan;
      this.replaceFormWithPlan(savedPlan);
      this.form.markAsPristine();
      this.lastSavedAt = new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit' }).format(new Date());
      const snackBarRef = this.snackBar.open('Monthly plan saved to SQLite.', 'View dashboard', {
        duration: 3500,
        horizontalPosition: 'right',
        verticalPosition: 'bottom'
      });

      snackBarRef.onAction().subscribe(() => {
        void this.router.navigateByUrl('/dashboard');
      });
    } catch {
      this.snackBar.open('Monthly plan was not saved. Check the API and highlighted fields.', 'OK', {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom'
      });
    }
  }

  async resetMonthlyPlan(): Promise<void> {
    if (!confirm(`Reset the saved plan for ${this.store.selectedPlanMonthLabel()}? This clears monthly planning rows only. Investments and goals stay untouched.`)) {
      return;
    }

    await this.store.resetCurrentMonthlyPlan();
    const draft = this.store.monthlyPlan();
    this.plan = draft;
    this.replaceFormWithPlan(draft);
    this.lastSavedAt = '';
    this.snackBar.open('Monthly plan reset. Investments and goals were kept.', 'OK', {
      duration: 3500,
      horizontalPosition: 'right',
      verticalPosition: 'bottom'
    });
  }

  private formToPlan(): MonthlyPlan {
    const value = this.form.getRawValue();
    return {
      ...this.plan,
      incomeItems: this.normalizeMoneyLines(value.incomeItems),
      recurringExpenses: this.normalizeMoneyLines(value.recurringExpenses).filter((item) => this.hasMoneyLineContent(item)),
      investments: this.normalizeMoneyLines(value.investments).filter((item) => this.hasMoneyLineContent(item)),
      variableBudgets: value.variableBudgets
        .map((item) => ({ category: item.category.trim(), budgetAmount: Number(item.budgetAmount || 0), spentAmount: Number(item.spentAmount || 0) }))
        .filter((item) => item.category || item.budgetAmount > 0 || item.spentAmount > 0),
      borrowingShortages: value.borrowingShortages
        .map((item) => ({ name: item.name.trim(), amount: Number(item.amount || 0), reason: item.reason.trim() }))
        .filter((item) => item.name || item.amount > 0 || item.reason)
    };
  }

  private replaceFormWithPlan(plan: MonthlyPlan): void {
    const incomeItems = plan.incomeItems.length > 0 ? plan.incomeItems : [{ name: '', amount: 0 }];
    const recurringExpenses = plan.recurringExpenses.length > 0 ? plan.recurringExpenses : [{ name: '', amount: 0 }];
    const investments = plan.investments.length > 0 ? plan.investments : [{ name: '', amount: 0 }];
    const variableBudgets = plan.variableBudgets.length > 0 ? plan.variableBudgets : [{ category: '', budgetAmount: 0, spentAmount: 0 }];

    this.form.setControl('incomeItems', this.builder.array(incomeItems.map((item) => this.moneyLine(item.name, item.amount))));
    this.form.setControl('recurringExpenses', this.builder.array(recurringExpenses.map((item) => this.optionalMoneyLine(item.name, item.amount))));
    this.form.setControl('investments', this.builder.array(investments.map((item) => this.optionalMoneyLine(item.name, item.amount))));
    this.form.setControl('variableBudgets', this.builder.array(variableBudgets.map((item) => this.optionalVariableLine(item.category, item.budgetAmount, item.spentAmount))));
    this.form.setControl('borrowingShortages', this.builder.array(plan.borrowingShortages.map((item) => this.optionalBorrowingLine(item.name, item.amount, item.reason))));
    this.form.updateValueAndValidity();
    this.changeDetector.detectChanges();
  }

  private moneyLine(name: string, amount: number) {
    return this.builder.nonNullable.group({ name: [name, Validators.required], amount: [amount, [Validators.required, Validators.min(0)]] });
  }

  private optionalMoneyLine(name: string, amount: number) {
    return this.builder.nonNullable.group({
      name: [name],
      amount: [amount, [Validators.required, Validators.min(0)]]
    }, { validators: this.optionalMoneyLineValidator });
  }

  private optionalVariableLine(category: string, budgetAmount: number, spentAmount: number) {
    return this.builder.nonNullable.group({
      category: [category],
      budgetAmount: [budgetAmount, [Validators.required, Validators.min(0)]],
      spentAmount: [spentAmount, [Validators.required, Validators.min(0)]]
    }, { validators: this.optionalVariableLineValidator });
  }

  private optionalBorrowingLine(name: string, amount: number, reason: string) {
    return this.builder.nonNullable.group({
      name: [name],
      amount: [amount, [Validators.required, Validators.min(0)]],
      reason: [reason]
    }, { validators: this.optionalBorrowingLineValidator });
  }

  private normalizeMoneyLines(items: { name: string; amount: number }[]): { name: string; amount: number }[] {
    return items.map((item) => ({ name: item.name.trim(), amount: Number(item.amount || 0) }));
  }

  private hasMoneyLineContent(item: { name: string; amount: number }): boolean {
    return Boolean(item.name) || item.amount > 0;
  }

  private assignUnallocatedInvestment(name: string): void {
    const amount = this.unallocatedAmount;

    if (amount <= 0) {
      return;
    }

    const reusableRow = this.investments.controls.find((control) => {
      const group = this.asGroup(control);
      const rowName = String(group.get('name')?.value ?? '').trim();
      const rowAmount = Number(group.get('amount')?.value ?? 0);
      return !rowName && rowAmount === 0;
    });

    const target = reusableRow ? this.asGroup(reusableRow) : this.optionalMoneyLine('', 0);

    if (!reusableRow) {
      this.investments.insert(0, target);
    }

    target.patchValue({ name, amount });
    target.markAsDirty();
  }

  private optionalMoneyLineValidator(control: AbstractControl): ValidationErrors | null {
    const name = String(control.get('name')?.value ?? '').trim();
    const amount = Number(control.get('amount')?.value ?? 0);

    return !name && amount > 0 ? { nameRequired: true } : null;
  }

  private optionalVariableLineValidator(control: AbstractControl): ValidationErrors | null {
    const category = String(control.get('category')?.value ?? '').trim();
    const budgetAmount = Number(control.get('budgetAmount')?.value ?? 0);
    const spentAmount = Number(control.get('spentAmount')?.value ?? 0);

    return !category && (budgetAmount > 0 || spentAmount > 0) ? { categoryRequired: true } : null;
  }

  private optionalBorrowingLineValidator(control: AbstractControl): ValidationErrors | null {
    const name = String(control.get('name')?.value ?? '').trim();
    const amount = Number(control.get('amount')?.value ?? 0);

    return !name && amount > 0 ? { nameRequired: true } : null;
  }

  private reduceInvestmentRows(amount: number, bufferOnly: boolean): number {
    let remaining = amount;

    for (const control of this.investments.controls) {
      if (remaining <= 0) {
        break;
      }

      const group = this.asGroup(control);
      const name = String(group.get('name')?.value ?? '').trim();
      const isBuffer = name.toLowerCase() === 'savings buffer';

      if (bufferOnly !== isBuffer) {
        continue;
      }

      const currentAmount = Number(group.get('amount')?.value ?? 0);
      const reduction = Math.min(currentAmount, remaining);

      if (reduction <= 0) {
        continue;
      }

      group.patchValue({ amount: currentAmount - reduction });
      remaining -= reduction;
    }

    return remaining;
  }

  private upsertBorrowingShortage(category: string, amount: number): void {
    const name = `${category} shortage`;
    const existing = this.borrowing.controls
      .map((control) => this.asGroup(control))
      .find((group) => String(group.get('name')?.value ?? '').trim().toLowerCase() === name.toLowerCase());

    if (amount <= 0) {
      if (existing) {
        this.borrowing.removeAt(this.borrowing.controls.indexOf(existing));
      }

      return;
    }

    const target = existing ?? this.optionalBorrowingLine('', 0, '');

    if (!existing) {
      this.borrowing.insert(0, target);
    }

    target.patchValue({
      name,
      amount,
      reason: `Uncovered overrun after increasing ${category} limit and reducing buffer/investments.`
    });
  }

  private coveredShortageAmount(category: string): number {
    const normalizedCategory = category.trim().toLowerCase();

    return this.form.getRawValue().borrowingShortages
      .filter((shortage) => {
        const searchable = `${shortage.name} ${shortage.reason}`.toLowerCase();
        return searchable.includes(normalizedCategory);
      })
      .reduce((total, shortage) => total + Number(shortage.amount || 0), 0);
  }

  private variableLine(category: string, budgetAmount: number, spentAmount: number) {
    return this.builder.nonNullable.group({
      category: [category, Validators.required],
      budgetAmount: [budgetAmount, [Validators.required, Validators.min(0)]],
      spentAmount: [spentAmount, [Validators.required, Validators.min(0)]]
    });
  }
}