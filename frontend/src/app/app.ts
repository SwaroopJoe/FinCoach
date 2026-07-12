import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { IonApp } from '@ionic/angular/standalone';
import { FinancialStoreService } from './core/financial-store.service';
import { NotificationService } from './core/notification.service';

@Component({
  selector: 'app-root',
  imports: [IonApp, MatButtonModule, MatToolbarModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  constructor(
    private readonly router: Router,
    private readonly store: FinancialStoreService,
    private readonly notifications: NotificationService
  ) {
    this.applyStoredTheme();
    void this.restoreProfileReminders();
  }

  isAuthenticated(): boolean {
    return Boolean(localStorage.getItem('financialCoachToken')) && !this.router.url.startsWith('/auth');
  }

  logout(): void {
    this.store.resetForAuthChange();
    void this.notifications.cancelProfileReminders();
    localStorage.removeItem('financialCoachToken');
    localStorage.removeItem('financialCoachUserId');
    localStorage.removeItem('financialCoachUsername');
    localStorage.removeItem('financialCoachDisplayName');
    void this.router.navigateByUrl('/auth');
  }

  private applyStoredTheme(): void {
    const theme = localStorage.getItem('financialCoachTheme') ?? 'light';
    document.body.classList.toggle('fc-dark-theme', theme === 'dark');
  }

  private async restoreProfileReminders(): Promise<void> {
    if (!localStorage.getItem('financialCoachToken')) {
      return;
    }

    const profile = this.store.profile() ?? await this.store.loadProfile();

    if (profile) {
      await this.notifications.scheduleProfileReminders(profile);
    }
  }
}
