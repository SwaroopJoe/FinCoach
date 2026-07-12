import { DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../core/api.service';
import { FinancialStoreService } from '../core/financial-store.service';
import { FeedbackEntry, FeedbackEntryType } from '../models/finance.models';

@Component({
  selector: 'app-feedback-page',
  imports: [DatePipe, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSnackBarModule, ReactiveFormsModule],
  template: `
    <header class="page-header">
      <div>
        <h1>Contribute or Report</h1>
        <p>Suggest a useful feature or report a bug so it can be reviewed and prioritized.</p>
      </div>
    </header>

    <section class="feedback-layout">
      <mat-card class="panel">
        <mat-card-header>
          <mat-card-title>New entry</mat-card-title>
          <mat-card-subtitle>Choose contribute for feature ideas, report for bugs.</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="feedbackForm" (ngSubmit)="submit()" class="feedback-form">
            <label class="field-label">
              Type
              <select formControlName="type">
                <option value="Contribute">Contribute</option>
                <option value="Report">Report</option>
              </select>
            </label>
            <mat-form-field appearance="outline">
              <mat-label>Title</mat-label>
              <input matInput formControlName="title" placeholder="Short summary" />
              <mat-error>Title is required.</mat-error>
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Required change or bug details</mat-label>
              <textarea matInput formControlName="description" rows="6" placeholder="Describe what should change, or what went wrong."></textarea>
              <mat-error>Please add at least 10 characters.</mat-error>
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Contact email optional</mat-label>
              <input matInput type="email" formControlName="contactEmail" placeholder="name@example.com" />
            </mat-form-field>
            <button mat-flat-button type="submit" [disabled]="feedbackForm.invalid || saving">Create entry</button>
          </form>
        </mat-card-content>
      </mat-card>

      <mat-card class="panel entries-card">
        <mat-card-header>
          <mat-card-title>Recent entries</mat-card-title>
          <mat-card-subtitle>New feature ideas and bug reports are saved here.</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="entry-list">
            @for (entry of entries; track entry.id) {
              <article>
                <div>
                  <span [class.report]="entry.type === 'Report'">{{ entry.type }}</span>
                  <strong>{{ entry.title }}</strong>
                </div>
                <p>{{ entry.description }}</p>
                <small>{{ entry.status }} · {{ entry.createdAtUtc | date:'medium' }}</small>
              </article>
            } @empty {
              <section class="empty-state"><strong>No entries yet. Create the first one.</strong></section>
            }
          </div>
        </mat-card-content>
      </mat-card>
    </section>
  `,
  styles: `
    .feedback-layout { display: grid; grid-template-columns: minmax(280px, 0.85fr) minmax(0, 1.15fr); gap: 18px; }
    .feedback-form { display: grid; grid-template-columns: minmax(0, 0.7fr) minmax(0, 1.3fr); gap: 12px; padding-top: 16px; }
    .full-width, .feedback-form button { grid-column: 1 / -1; }
    .field-label { border: 1px solid rgba(41,61,82,0.28); border-radius: 8px; color: var(--fc-muted); display: grid; font-size: 0.78rem; gap: 4px; padding: 7px 12px; }
    .field-label select { background: transparent; border: 0; color: var(--fc-ink); font: inherit; min-height: 31px; outline: none; }
    .entries-card mat-card-content { padding-top: 16px; }
    .entry-list { display: grid; gap: 12px; }
    .entry-list article { background: linear-gradient(145deg, rgba(255,255,255,0.78), rgba(236,244,247,0.7)); border: 1px solid rgba(41,61,82,0.1); border-radius: 8px; display: grid; gap: 8px; padding: 14px; }
    .entry-list article div { align-items: center; display: flex; gap: 10px; justify-content: space-between; }
    .entry-list span { background: rgba(47,93,124,0.12); border-radius: 999px; color: #183247; font-size: 0.76rem; font-weight: 800; padding: 5px 9px; }
    .entry-list span.report { background: rgba(155,63,47,0.12); color: #7a2d23; }
    .entry-list strong { font-family: Newsreader, serif; font-size: 1.35rem; }
    .entry-list p { margin: 0; }
    .entry-list small, .empty-state { color: var(--fc-muted); }
    .empty-state { padding: 12px 0; }
    @media (max-width: 900px) { .feedback-layout, .feedback-form { grid-template-columns: 1fr; } }
  `
})
export class FeedbackPage implements OnInit {
  private readonly api = inject(ApiService);
  private readonly builder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly store = inject(FinancialStoreService);

  entries: FeedbackEntry[] = [];
  saving = false;

  readonly feedbackForm = this.builder.nonNullable.group({
    type: ['Contribute' as FeedbackEntryType, Validators.required],
    title: ['', [Validators.required, Validators.maxLength(140)]],
    description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]],
    contactEmail: ['', Validators.email]
  });

  async ngOnInit(): Promise<void> {
    await this.loadEntries();
  }

  async submit(): Promise<void> {
    const profile = this.store.profile() ?? await this.store.loadProfile();
    const value = this.feedbackForm.getRawValue();
    this.saving = true;

    try {
      const saved = await firstValueFrom(this.api.createFeedbackEntry({
        userProfileId: profile?.id ?? null,
        type: value.type,
        title: value.title,
        description: value.description,
        contactEmail: value.contactEmail
      }));

      this.entries = [saved, ...this.entries];
      this.feedbackForm.reset({ type: 'Contribute', title: '', description: '', contactEmail: '' });
      this.snackBar.open('Entry created.', 'OK', { duration: 2500 });
      void this.router.navigateByUrl('/dashboard');
    } finally {
      this.saving = false;
    }
  }

  private async loadEntries(): Promise<void> {
    this.entries = await firstValueFrom(this.api.getFeedbackEntries());
  }
}