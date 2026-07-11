import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ApiService, AuthResponse } from '../core/api.service';

@Component({
  selector: 'app-auth-placeholder-page',
  imports: [MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  template: `
    <section class="auth-wrap">
      <mat-card class="panel auth-card">
        <mat-card-header>
          <mat-card-title>Sign in to Financial Coach</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-form-field appearance="outline">
            <mat-label>Username</mat-label>
            <input matInput [formControl]="username" autocomplete="username" />
            @if (username.hasError('required') && username.touched) {
              <mat-error>Enter a username to continue.</mat-error>
            }
            @if (username.hasError('pattern') && username.touched) {
              <mat-error>Username cannot be blank.</mat-error>
            }
          </mat-form-field>
          @if (authError()) {
            <p class="auth-error">{{ authError() }}</p>
          }
        </mat-card-content>
        <mat-card-actions align="end">
          <button mat-button type="button" [disabled]="saving()" (click)="signIn()">Sign in</button>
          <button mat-flat-button type="button" [disabled]="saving()" (click)="createUsername()">Create username</button>
        </mat-card-actions>
      </mat-card>
    </section>
  `,
  styles: `
    .auth-wrap { display: grid; min-height: calc(100dvh - 150px); place-items: center; }
    .auth-card { width: min(440px, 100%); padding: 12px; }
    mat-form-field { width: 100%; margin-top: 18px; }
    .auth-error { margin: 0; color: #9b1c1c; font-size: 0.88rem; }
  `
})
export class AuthPlaceholderPage {
  readonly username = new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/\S/)] });
  readonly authError = signal('');
  readonly saving = signal(false);

  constructor(
    private readonly api: ApiService,
    private readonly router: Router
  ) {}

  createUsername(): void {
    const username = this.getSubmittedUsername();

    if (!username) {
      return;
    }

    this.saving.set(true);
    this.api.register(username).subscribe({
      next: (response) => this.completeAuth(response),
      error: (error: HttpErrorResponse) => this.handleAuthError(error, 'Could not create username.'),
      complete: () => {
        this.saving.set(false);
      }
    });
  }

  signIn(): void {
    const username = this.getSubmittedUsername();

    if (!username) {
      return;
    }

    this.saving.set(true);
    this.api.login(username).subscribe({
      next: (response) => this.completeAuth(response),
      error: (error: HttpErrorResponse) => this.handleAuthError(error, 'Username not found. Create it first.'),
      complete: () => {
        this.saving.set(false);
      }
    });
  }

  private getSubmittedUsername(): string | null {
    this.authError.set('');

    if (this.username.invalid) {
      this.username.markAsTouched();
      return null;
    }

    const username = this.username.value.trim();

    if (!username) {
      this.username.markAsTouched();
      return null;
    }

    return username;
  }

  private completeAuth(response: AuthResponse): void {
    localStorage.setItem('financialCoachToken', response.accessToken);
    localStorage.setItem('financialCoachUserId', response.userId);
    localStorage.setItem('financialCoachUsername', response.username);
    localStorage.setItem('financialCoachDisplayName', response.username);
    void this.router.navigateByUrl('/dashboard');
  }

  private handleAuthError(error: HttpErrorResponse, fallbackMessage: string): void {
    this.saving.set(false);
    this.authError.set(typeof error.error?.message === 'string' ? error.error.message : fallbackMessage);
  }
}