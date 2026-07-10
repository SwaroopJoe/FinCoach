import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardSummary, MonthlyPlan, UserProfile } from '../models/finance.models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:5035/api';

  login(name: string): Observable<{ accessToken: string; expiresAtUtc: string; message: string }> {
    return this.http.post<{ accessToken: string; expiresAtUtc: string; message: string }>(`${this.baseUrl}/auth/login`, { name });
  }

  saveProfile(profile: Omit<UserProfile, 'id'>): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.baseUrl}/profile`, profile);
  }

  saveMonthlyPlan(plan: Omit<MonthlyPlan, 'id' | 'totalIncome' | 'totalAllocation' | 'remainingBalance' | 'savingsRate'>): Observable<MonthlyPlan> {
    return this.http.post<MonthlyPlan>(`${this.baseUrl}/monthly-plans`, plan);
  }

  getDashboard(userProfileId: string): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.baseUrl}/dashboard/${userProfileId}`);
  }
}