import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FinancialStoreService } from '../core/financial-store.service';
import { AiCoachItem, AiCoachPatch } from '../models/finance.models';

@Component({
  selector: 'app-ai-coach-page',
  imports: [DatePipe, FormsModule, MatButtonModule, MatCardModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatSnackBarModule, NgTemplateOutlet],
  template: `
    <header class="page-header coach-header">
      <div>
        <span class="eyebrow">AI Monthly Coach</span>
        <h1>{{ store.aiCoach()?.headline || 'Monthly guidance' }}</h1>
        <p>{{ store.aiCoach()?.summary || 'Generate guidance from your current monthly plan, goals, and investments.' }}</p>
      </div>
      <button mat-flat-button type="button" (click)="loadGuidance()" [disabled]="store.loading()">{{ store.loading() ? 'Reviewing...' : 'Refresh guidance' }}</button>
    </header>

    @if (store.aiCoach(); as coach) {
      <section class="coach-meta panel">
        <div><span>Month</span><strong>{{ coach.sourceSnapshotMonth }}</strong></div>
        <div><span>Generated</span><strong>{{ coach.generatedAtUtc | date:'short' }}</strong></div>
        <div><span>Mode</span><strong>{{ coach.isAiGenerated ? 'Gemini' : 'Fallback' }}</strong></div>
      </section>

      <section class="coach-grid">
        @for (warning of coach.riskWarnings; track warning.title) {
          <mat-card class="coach-card risk-card">
            <mat-card-header>
              <mat-card-title>{{ warning.title }}</mat-card-title>
              <span class="priority">{{ warning.priority }}</span>
            </mat-card-header>
            <mat-card-content>
              <p>{{ warning.message }}</p>
              @if (warning.recommendedAction) { <strong>{{ warning.recommendedAction }}</strong> }
              <ng-container *ngTemplateOutlet="patchTemplate; context: { item: warning, itemIndex: itemIndex(warning) }" />
            </mat-card-content>
          </mat-card>
        }

        @for (action of coach.actionItems; track action.title) {
          <mat-card class="coach-card action-card">
            <mat-card-header>
              <mat-card-title>{{ action.title }}</mat-card-title>
              <span class="priority">{{ action.priority }}</span>
            </mat-card-header>
            <mat-card-content>
              <p>{{ action.message }}</p>
              @if (action.recommendedAction) { <strong>{{ action.recommendedAction }}</strong> }
              <ng-container *ngTemplateOutlet="patchTemplate; context: { item: action, itemIndex: itemIndex(action) }" />
            </mat-card-content>
          </mat-card>
        }

        @for (insight of coach.insights; track insight.title) {
          <mat-card class="coach-card insight-card">
            <mat-card-header>
              <mat-card-title>{{ insight.title }}</mat-card-title>
              <span class="priority">{{ insight.priority }}</span>
            </mat-card-header>
            <mat-card-content>
              <p>{{ insight.message }}</p>
              @if (insight.recommendedAction) { <strong>{{ insight.recommendedAction }}</strong> }
              <ng-container *ngTemplateOutlet="patchTemplate; context: { item: insight, itemIndex: itemIndex(insight) }" />
            </mat-card-content>
          </mat-card>
        }
      </section>
    } @else {
      <section class="empty-state panel">
        <h2>Get monthly coaching</h2>
        <p>AI Coach reviews the saved plan for {{ store.selectedPlanMonthLabel() }} and suggests practical next steps. It can prepare edits, but you review and save them.</p>
        <button mat-flat-button type="button" (click)="loadGuidance()" [disabled]="store.loading()">Generate guidance</button>
      </section>
    }

    <section class="question-panel panel">
      <mat-form-field appearance="outline">
        <mat-label>Ask about this month</mat-label>
        <input matInput [(ngModel)]="question" placeholder="Can I afford a new phone this month?" />
      </mat-form-field>
      <button mat-stroked-button type="button" (click)="loadGuidance(question)" [disabled]="store.loading() || !question.trim()">Ask coach</button>
    </section>

    <ng-template #patchTemplate let-item="item" let-itemIndex="itemIndex">
      @if (patchesFor(item).length > 0) {
        <div class="patch-review">
          <span class="patch-title">Suggested entries</span>
          @for (patch of patchesFor(item); track $index) {
            <mat-checkbox [ngModel]="isSelected(itemIndex, $index)" (ngModelChange)="setSelected(itemIndex, $index, $event)">
              <span>{{ describePatch(patch) }}</span>
            </mat-checkbox>
            <small>{{ patch.reason }}</small>
          }
          <button mat-flat-button type="button" (click)="applySelected(item, itemIndex)" [disabled]="selectedCount(itemIndex, item) === 0">Apply selected to Monthly Plan</button>
        </div>
      }
    </ng-template>
  `,
  styles: `
    .coach-header { align-items: end; }
    .eyebrow { color: var(--fc-primary-deep); font-size: 0.78rem; font-weight: 900; letter-spacing: 0.08em; text-transform: uppercase; }
    .coach-meta { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; margin-bottom: 18px; padding: 14px; }
    .coach-meta div { background: var(--fc-card-soft); border-radius: 8px; padding: 10px; }
    .coach-meta span { color: var(--fc-muted); display: block; font-size: 0.76rem; font-weight: 800; text-transform: uppercase; }
    .coach-meta strong { display: block; margin-top: 3px; }
    .coach-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
    .coach-card { border-left: 4px solid var(--fc-primary); }
    .risk-card { border-left-color: var(--fc-danger); }
    .action-card { border-left-color: #b98f3f; }
    .insight-card { border-left-color: #2f5d7c; }
    .coach-card mat-card-header { align-items: start; justify-content: space-between; gap: 12px; }
    .coach-card mat-card-title { font-size: 1.18rem; }
    .coach-card p { color: var(--fc-muted); margin: 8px 0; }
    .priority { border-radius: 999px; background: var(--fc-card-soft); color: var(--fc-primary-deep); font-size: 0.72rem; font-weight: 900; padding: 5px 9px; text-transform: uppercase; }
    .patch-review { border-top: 1px solid var(--fc-border); display: grid; gap: 8px; margin-top: 12px; padding-top: 12px; }
    .patch-title { color: var(--fc-primary-deep); font-size: 0.78rem; font-weight: 900; letter-spacing: 0.06em; text-transform: uppercase; }
    .patch-review small { color: var(--fc-muted); display: block; margin: -6px 0 4px 32px; }
    .question-panel { align-items: center; display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 12px; margin-top: 18px; padding: 16px; }
    .question-panel mat-form-field { width: 100%; }
    .empty-state { display: grid; gap: 10px; margin-bottom: 18px; padding: 24px; }
    .empty-state h2 { margin: 0; }
    .empty-state p { color: var(--fc-muted); margin: 0; }
    @media (max-width: 760px) { .coach-header { align-items: stretch; } .coach-meta, .coach-grid, .question-panel { grid-template-columns: 1fr; } .coach-header button, .question-panel button { min-height: 46px; } }
  `
})
export class AiCoachPage {
  readonly store = inject(FinancialStoreService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  question = '';
  private readonly selected = new Set<string>();

  async ngOnInit(): Promise<void> {
    if (!this.store.aiCoach()) {
      await this.loadGuidance();
    }
  }

  async loadGuidance(question = ''): Promise<void> {
    try {
      await this.store.loadAiMonthlyCoach(question);
      this.question = '';
      this.selected.clear();
      this.selectLowRiskPatches();
    } catch {
      this.snackBar.open('AI Coach could not load guidance. Check the API connection.', 'OK', { duration: 4500 });
    }
  }

  itemIndex(item: AiCoachItem): number {
    return this.allItems().indexOf(item);
  }

  patchesFor(item: AiCoachItem): AiCoachPatch[] {
    return item.patches ?? [];
  }

  patchKey(itemIndex: number, patchIndex: number): string {
    return `${itemIndex}:${patchIndex}`;
  }

  isSelected(itemIndex: number, patchIndex: number): boolean {
    return this.selected.has(this.patchKey(itemIndex, patchIndex));
  }

  setSelected(itemIndex: number, patchIndex: number, selected: boolean): void {
    const key = this.patchKey(itemIndex, patchIndex);
    selected ? this.selected.add(key) : this.selected.delete(key);
  }

  selectedCount(itemIndex: number, item: AiCoachItem): number {
    return this.patchesFor(item).filter((_, patchIndex) => this.isSelected(itemIndex, patchIndex)).length;
  }

  describePatch(patch: AiCoachPatch): string {
    const target = patch.section === 'variableBudgets' ? patch.matchCategory || patch.category : patch.matchName || patch.name;
    const value = patch.suggestedValue ?? patch.amountDelta;
    const formatted = typeof value === 'number' ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value) : 'entry';
    return `${patch.operation} ${this.labelForSection(patch.section)} ${target ? `(${target})` : ''}${value !== null && value !== undefined ? ` to ${formatted}` : ''}`;
  }

  async applySelected(item: AiCoachItem, itemIndex: number): Promise<void> {
    const patches = this.patchesFor(item).filter((_, patchIndex) => this.isSelected(itemIndex, patchIndex));

    if (patches.length === 0) {
      return;
    }

    this.store.queueAiCoachPatches(patches);
    this.snackBar.open('Suggestion prepared. Review and save it in Monthly Plan.', 'OK', { duration: 3500 });
    await this.router.navigateByUrl('/monthly-planning');
  }

  private allItems(): AiCoachItem[] {
    const coach = this.store.aiCoach();
    return coach ? [...coach.riskWarnings, ...coach.actionItems, ...coach.insights] : [];
  }

  private selectLowRiskPatches(): void {
    this.allItems().forEach((item, itemIndex) => {
      this.patchesFor(item).forEach((patch, patchIndex) => {
        if (patch.operation === 'add' && ['investments', 'borrowingShortages'].includes(patch.section)) {
          this.selected.add(this.patchKey(itemIndex, patchIndex));
        }
      });
    });
  }

  private labelForSection(section: AiCoachPatch['section']): string {
    return ({
      incomeItems: 'income',
      recurringExpenses: 'recurring expense',
      investments: 'monthly allocation',
      variableBudgets: 'variable budget',
      borrowingShortages: 'shortage'
    })[section];
  }
}
