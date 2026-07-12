import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';
import { FinancialStoreService } from '../core/financial-store.service';
import { NotificationService } from '../core/notification.service';
import { CurrencyCode } from '../models/finance.models';

@Component({
  selector: 'app-profile-setup-page',
  imports: [MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatSlideToggleModule, MatSnackBarModule, ReactiveFormsModule],
  template: `
    <header class="page-header">
      <div>
        <h1>Profile setup</h1>
        <p>These details shape planning defaults and reminders.</p>
      </div>
    </header>

    <section class="theme-card panel">
      <div>
        <strong>Appearance</strong>
        <span>{{ darkTheme ? 'Dark theme' : 'White theme' }}</span>
      </div>
      <mat-slide-toggle [checked]="darkTheme" (change)="setTheme($event.checked)">Dark</mat-slide-toggle>
    </section>

    <mat-card class="panel form-card">
      <form [formGroup]="form" (ngSubmit)="save()">
        <div class="form-grid">
          <mat-form-field appearance="outline"><mat-label>Name</mat-label><input matInput formControlName="name" /></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>Salary</mat-label><input matInput type="number" formControlName="salary" /></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>Salary credit day</mat-label><input matInput type="number" formControlName="salaryCreditDay" /></mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Preferred currency</mat-label>
            <mat-select formControlName="preferredCurrency">
              @for (currency of currencies; track currency) { <mat-option [value]="currency">{{ currency }}</mat-option> }
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline"><mat-label>Family size</mat-label><input matInput type="number" formControlName="familySize" /></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>Notification times</mat-label><input matInput formControlName="notificationTimes" /></mat-form-field>
        </div>
        <mat-form-field appearance="outline" class="wide"><mat-label>Financial preferences</mat-label><textarea matInput rows="4" formControlName="financialPreferences"></textarea></mat-form-field>
        <div class="actions">
          @if (store.error()) { <span class="error-text">{{ store.error() }}</span> }
          <button mat-flat-button type="submit" [disabled]="form.invalid || store.saving()">{{ store.saving() ? 'Saving...' : 'Save profile' }}</button>
        </div>
      </form>
    </mat-card>
  `,
  styles: `
    .form-card { padding: clamp(16px, 3vw, 28px); }
    .theme-card { align-items: center; display: flex; justify-content: space-between; gap: 16px; margin-bottom: 16px; padding: 16px 18px; }
    .theme-card strong, .theme-card span { display: block; }
    .theme-card span { color: var(--fc-muted); font-size: 0.9rem; margin-top: 2px; }
    .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; }
    .wide { width: 100%; }
    .actions { display: flex; align-items: center; justify-content: flex-end; gap: 16px; }
    .error-text { color: #b3261e; }
  `
})
export class ProfileSetupPage implements OnInit {
  readonly store = inject(FinancialStoreService);
  private readonly builder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly notifications = inject(NotificationService);
  readonly currencies: CurrencyCode[] = ['INR', 'USD', 'EUR', 'GBP', 'AED'];
  darkTheme = localStorage.getItem('financialCoachTheme') === 'dark';

  readonly form = this.builder.nonNullable.group({
    name: ['', Validators.required],
    salary: [0, [Validators.required, Validators.min(0)]],
    salaryCreditDay: [1, [Validators.required, Validators.min(1), Validators.max(31)]],
    preferredCurrency: ['INR' as CurrencyCode, Validators.required],
    familySize: [1, [Validators.min(1)]],
    notificationTimes: ['12:00, 14:00, 19:00', Validators.required],
    financialPreferences: ['']
  });

  async ngOnInit(): Promise<void> {
    const profile = await this.store.loadProfile();

    if (profile) {
      this.form.patchValue({
        name: profile.name,
        salary: profile.salary,
        salaryCreditDay: profile.salaryCreditDay,
        preferredCurrency: profile.preferredCurrency,
        familySize: profile.familySize ?? 1,
        notificationTimes: profile.notificationTimes.join(', '),
        financialPreferences: profile.financialPreferences
      });
      await this.notifications.scheduleProfileReminders(profile);
    }
  }

  async save(): Promise<void> {
    const value = this.form.getRawValue();

    const savedProfile = await this.store.saveProfile({
      name: value.name,
      salary: value.salary,
      salaryCreditDay: value.salaryCreditDay,
      preferredCurrency: value.preferredCurrency,
      familySize: value.familySize,
      notificationTimes: value.notificationTimes.split(',').map((time) => time.trim()).filter(Boolean),
      financialPreferences: value.financialPreferences
    });

    this.form.markAsPristine();
    const scheduled = await this.notifications.scheduleProfileReminders(savedProfile);
    this.snackBar.open(scheduled ? 'Profile saved. Reminders scheduled.' : 'Profile saved. Notifications need Android permission.', 'OK', { duration: 3500 });
    void this.router.navigateByUrl('/dashboard');
  }

  setTheme(enabled: boolean): void {
    this.darkTheme = enabled;
    localStorage.setItem('financialCoachTheme', enabled ? 'dark' : 'light');
    document.body.classList.toggle('fc-dark-theme', enabled);
  }
}