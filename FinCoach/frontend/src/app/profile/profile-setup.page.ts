import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FinancialStoreService } from '../core/financial-store.service';
import { CurrencyCode } from '../models/finance.models';

@Component({
  selector: 'app-profile-setup-page',
  imports: [MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, ReactiveFormsModule],
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
        <button mat-flat-button type="submit" [disabled]="form.invalid">Save profile</button>
      </form>
    </mat-card>
  `,
  styles: `
    .form-card { padding: clamp(16px, 3vw, 28px); }
    .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; }
    .wide { width: 100%; }
  `
})
export class ProfileSetupPage {
  private readonly store = inject(FinancialStoreService);
  private readonly builder = inject(FormBuilder);
  readonly currencies: CurrencyCode[] = ['INR', 'USD', 'EUR', 'GBP', 'AED'];
  readonly profile = this.store.profile();

  readonly form = this.builder.nonNullable.group({
    name: [this.profile.name, Validators.required],
    salary: [this.profile.salary, [Validators.required, Validators.min(0)]],
    salaryCreditDay: [this.profile.salaryCreditDay, [Validators.required, Validators.min(1), Validators.max(31)]],
    preferredCurrency: [this.profile.preferredCurrency, Validators.required],
    familySize: [this.profile.familySize ?? 1, [Validators.min(1)]],
    notificationTimes: [this.profile.notificationTimes.join(', '), Validators.required],
    financialPreferences: [this.profile.financialPreferences]
  });

  save(): void {
    const value = this.form.getRawValue();
    this.store.saveProfile({
      id: this.profile.id,
      name: value.name,
      salary: value.salary,
      salaryCreditDay: value.salaryCreditDay,
      preferredCurrency: value.preferredCurrency,
      familySize: value.familySize,
      notificationTimes: value.notificationTimes.split(',').map((time) => time.trim()).filter(Boolean),
      financialPreferences: value.financialPreferences
    });
  }
}