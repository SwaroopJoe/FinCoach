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
import { FinancialGoal, GoalCategory, GoalPriority } from '../models/finance.models';

@Component({
  selector: 'app-goals-page',
  imports: [CurrencyPipe, DecimalPipe, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatProgressBarModule, MatSnackBarModule, ReactiveFormsModule],
  template: `
    <header class="page-header">
      <div>
        <h1>Goals</h1>
        <p>Create custom targets like a short-term trip, emergency fund, or anything else you want to fund.</p>
      </div>
    </header>

    <section class="goals-layout">
      <mat-card class="panel">
        <mat-card-header><mat-card-title>Add goal</mat-card-title></mat-card-header>
        <mat-card-content>
          <form [formGroup]="goalForm" (ngSubmit)="saveGoal()" class="form-grid">
            <mat-form-field appearance="outline"><mat-label>Name</mat-label><input matInput formControlName="name" placeholder="Add your goal name" /></mat-form-field>
            <label class="field-label">Category<select formControlName="category"><option value="ShortTerm">Short term</option><option value="EmergencyFund">Emergency fund</option><option value="Travel">Travel</option><option value="Home">Home</option><option value="Education">Education</option><option value="Retirement">Retirement</option><option value="Custom">Custom</option></select></label>
            <mat-form-field appearance="outline"><mat-label>Description</mat-label><input matInput formControlName="customCategory" /></mat-form-field>
            <label class="field-label">Priority<select formControlName="priority"><option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option></select></label>
            <mat-form-field appearance="outline"><mat-label>Target amount</mat-label><input matInput type="number" formControlName="targetAmount" /></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Already saved</mat-label><input matInput type="number" formControlName="startingAmount" /></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Target date</mat-label><input matInput type="date" formControlName="targetDate" /></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Notes</mat-label><input matInput formControlName="notes" /></mat-form-field>
            <button mat-flat-button type="submit" [disabled]="goalForm.invalid || store.saving()">Save goal</button>
          </form>
        </mat-card-content>
      </mat-card>

      <div class="goal-list">
        @for (goal of store.goals(); track goal.id) {
          <mat-card class="panel goal-card">
            <mat-card-header>
              <mat-card-title>{{ goal.name }}</mat-card-title>
              <mat-card-subtitle>{{ categoryLabel(goal) }} · {{ goal.priority }} priority</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div class="goal-values">
                <span>{{ goal.currentAmount || 0 | currency:'INR':'symbol':'1.0-0' }} saved</span>
                <strong>{{ goal.targetAmount | currency:'INR':'symbol':'1.0-0' }} target</strong>
              </div>
              <mat-progress-bar mode="determinate" [value]="goal.progressPercent || 0" />
              <div class="goal-footer">
                <span>{{ goal.progressPercent || 0 | number:'1.0-2' }}% complete</span>
                <span>{{ goal.remainingAmount || 0 | currency:'INR':'symbol':'1.0-0' }} remaining</span>
              </div>
              <form [formGroup]="contributionForm" (ngSubmit)="addContribution(goal)" class="contribution-row">
                <mat-form-field appearance="outline"><mat-label>Add amount</mat-label><input matInput type="number" formControlName="amount" /></mat-form-field>
                <mat-form-field appearance="outline"><mat-label>Description</mat-label><input matInput formControlName="description" /></mat-form-field>
                <button mat-stroked-button type="submit" [disabled]="contributionForm.invalid || store.saving()">Add to goal</button>
                <button mat-button type="button" (click)="deleteGoal(goal)">Delete</button>
              </form>
            </mat-card-content>
          </mat-card>
        } @empty {
          <section class="panel empty-state"><strong>No goals yet. Add a target to start tracking progress.</strong></section>
        }
      </div>
    </section>
  `,
  styles: `
    .goals-layout { display: grid; grid-template-columns: minmax(280px, 0.8fr) minmax(0, 1.2fr); gap: 18px; }
    .form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; padding-top: 16px; }
    .field-label { border: 1px solid rgba(41,61,82,0.28); border-radius: 8px; color: var(--fc-muted); display: grid; font-size: 0.78rem; gap: 4px; padding: 7px 12px; }
    .field-label select { background: transparent; border: 0; font: inherit; min-height: 28px; outline: none; }
    .goal-list { display: grid; gap: 16px; }
    .goal-card mat-card-content { display: grid; gap: 14px; padding-top: 18px; }
    .goal-card { background: linear-gradient(145deg, rgba(255,255,255,0.9), rgba(236,244,247,0.72)); }
    .goal-values, .goal-footer { display: flex; justify-content: space-between; gap: 12px; }
    .contribution-row { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto auto; gap: 10px; align-items: start; }
    .empty-state { padding: 18px; }
    @media (max-width: 900px) { .goals-layout, .form-grid, .contribution-row { grid-template-columns: 1fr; } }
  `
})
export class GoalsPage implements OnInit {
  readonly store = inject(FinancialStoreService);
  private readonly builder = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);

  readonly goalForm = this.builder.nonNullable.group({
    name: ['', Validators.required],
    category: ['Travel' as GoalCategory, Validators.required],
    customCategory: [''],
    priority: ['Medium' as GoalPriority, Validators.required],
    targetAmount: [0, [Validators.required, Validators.min(1)]],
    startingAmount: [0, [Validators.required, Validators.min(0)]],
    targetDate: [''],
    notes: ['']
  });

  readonly contributionForm = this.builder.nonNullable.group({
    amount: [0, [Validators.required, Validators.min(1)]],
    description: ['Goal contribution']
  });

  async ngOnInit(): Promise<void> {
    await this.store.loadGoals();
  }

  async saveGoal(): Promise<void> {
    const profile = this.store.profile() ?? await this.store.loadProfile();

    if (!profile) {
      this.snackBar.open('Create your profile before adding goals.', 'OK', { duration: 3500 });
      return;
    }

    const value = this.goalForm.getRawValue();
    await this.store.saveGoal({
      userProfileId: profile.id,
      ...value,
      targetDate: value.targetDate ? new Date(value.targetDate).toISOString() : null
    });
    this.goalForm.reset({ name: '', category: 'Travel', customCategory: '', priority: 'Medium', targetAmount: 0, startingAmount: 0, targetDate: '', notes: '' });
    this.snackBar.open('Goal saved.', 'OK', { duration: 2500 });
  }

  async addContribution(goal: FinancialGoal): Promise<void> {
    if (!goal.id) {
      return;
    }

    await this.store.addGoalContribution(goal.id, {
      contributionMonth: new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), 1)).toISOString(),
      ...this.contributionForm.getRawValue()
    });
    this.contributionForm.reset({ amount: 0, description: 'Goal contribution' });
    this.snackBar.open('Goal contribution added.', 'OK', { duration: 2500 });
  }

  async deleteGoal(goal: FinancialGoal): Promise<void> {
    if (!goal.id || !confirm(`Delete goal "${goal.name}"?`)) {
      return;
    }

    await this.store.deleteGoal(goal.id);
  }

  categoryLabel(goal: FinancialGoal): string {
    return goal.category === 'Custom' ? goal.customCategory : goal.category;
  }
}