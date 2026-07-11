import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FinancialStoreService } from '../core/financial-store.service';
import { CurrencyCode } from '../models/finance.models';

@Component({
  selector: 'app-profile-setup-page',
  imports: [MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatSnackBarModule, ReactiveFormsModule],
  template: `
    <header class="page-header">
      <div>
        <h1>Profile setup</h1>
        <p>These details shape planning defaults and reminders.</p>
      </div>
    </header>

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
    .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; }
    .wide { width: 100%; }
    .actions { display: flex; align-items: center; justify-content: flex-end; gap: 16px; }
    .error-text { color: #b3261e; }
  `
})
export class ProfileSetupPage implements OnInit {
  readonly store = inject(FinancialStoreService);
  private readonly builder = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);
  readonly currencies: CurrencyCode[] = ['INR', 'USD', 'EUR', 'GBP', 'AED'];

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
    }
  }

  async save(): Promise<void> {
    const value = this.form.getRawValue();

    await this.store.saveProfile({
      name: value.name,
      salary: value.salary,
      salaryCreditDay: value.salaryCreditDay,
      preferredCurrency: value.preferredCurrency,
      familySize: value.familySize,
      notificationTimes: value.notificationTimes.split(',').map((time) => time.trim()).filter(Boolean),
      financialPreferences: value.financialPreferences
    });

    this.form.markAsPristine();
    this.snackBar.open('Profile saved to SQLite.', 'OK', { duration: 3000 });
  }
}