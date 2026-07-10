import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-auth-placeholder-page',
  imports: [MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  template: `
    <section class="auth-wrap">
      <mat-card class="panel auth-card">
        <mat-card-header>
          <mat-card-title>Welcome to Financial Coach</mat-card-title>
          <mat-card-subtitle>Local authentication placeholder for the MVP build.</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <mat-form-field appearance="outline">
            <mat-label>Your name</mat-label>
            <input matInput [formControl]="name" autocomplete="name" />
          </mat-form-field>
        </mat-card-content>
        <mat-card-actions align="end">
          <button mat-flat-button type="button" (click)="continue()">Continue</button>
        </mat-card-actions>
      </mat-card>
    </section>
  `,
  styles: `
    .auth-wrap { display: grid; min-height: calc(100dvh - 150px); place-items: center; }
    .auth-card { width: min(440px, 100%); padding: 12px; }
    mat-form-field { width: 100%; margin-top: 18px; }
  `
})
export class AuthPlaceholderPage {
  readonly name = new FormControl('Aarav', { nonNullable: true });

  constructor(private readonly router: Router) {}

  continue(): void {
    localStorage.setItem('financialCoachToken', crypto.randomUUID());
    localStorage.setItem('financialCoachDisplayName', this.name.value.trim() || 'Financial Coach User');
    void this.router.navigateByUrl('/dashboard');
  }
}