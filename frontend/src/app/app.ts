import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { IonApp } from '@ionic/angular/standalone';
import { FinancialStoreService } from './core/financial-store.service';

@Component({
  selector: 'app-root',
  imports: [IonApp, MatButtonModule, MatToolbarModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  constructor(
    private readonly router: Router,
    private readonly store: FinancialStoreService
  ) {}

  isAuthenticated(): boolean {
    return Boolean(localStorage.getItem('financialCoachToken')) && !this.router.url.startsWith('/auth');
  }

  logout(): void {
    this.store.resetForAuthChange();
    localStorage.removeItem('financialCoachToken');
    localStorage.removeItem('financialCoachUserId');
    localStorage.removeItem('financialCoachUsername');
    localStorage.removeItem('financialCoachDisplayName');
    void this.router.navigateByUrl('/auth');
  }
}
