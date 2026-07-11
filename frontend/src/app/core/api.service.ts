import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardSummary, FeedbackEntry, FinancialGoal, GoalContribution, InvestmentContribution, InvestmentHolding, InvestmentSummary, MonthlyPlan, UserProfile } from '../models/finance.models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = localStorage.getItem('financialCoachApiBaseUrl') ?? environment.apiBaseUrl;

  register(username: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/register`, { username });
  }

  login(username: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, { username });
  }

  getProfile(): Observable<UserProfile | null> {
    return this.http.get<UserProfile | null>(`${this.baseUrl}/profile`);
  }

  saveProfile(profile: Omit<UserProfile, 'id'>): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.baseUrl}/profile`, profile);
  }

  getCurrentMonthlyPlan(userProfileId: string): Observable<MonthlyPlan | null> {
    return this.http.get<MonthlyPlan | null>(`${this.baseUrl}/monthly-plans/current/${userProfileId}`);
  }

  getMonthlyPlanForMonth(userProfileId: string, year: number, month: number): Observable<MonthlyPlan | null> {
    return this.http.get<MonthlyPlan | null>(`${this.baseUrl}/monthly-plans/${userProfileId}/${year}/${month}`);
  }

  saveMonthlyPlan(plan: Omit<MonthlyPlan, 'id' | 'totalIncome' | 'totalAllocation' | 'remainingBalance' | 'totalBorrowingShortage' | 'savingsRate'>): Observable<MonthlyPlan> {
    return this.http.post<MonthlyPlan>(`${this.baseUrl}/monthly-plans`, plan);
  }

  resetCurrentMonthlyPlan(userProfileId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/monthly-plans/current/${userProfileId}`);
  }

  resetMonthlyPlanForMonth(userProfileId: string, year: number, month: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/monthly-plans/${userProfileId}/${year}/${month}`);
  }

  getDashboard(userProfileId: string): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.baseUrl}/dashboard/${userProfileId}`);
  }

  getDashboardForMonth(userProfileId: string, year: number, month: number): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.baseUrl}/dashboard/${userProfileId}/${year}/${month}`);
  }

  getInvestments(userProfileId: string): Observable<InvestmentSummary> {
    return this.http.get<InvestmentSummary>(`${this.baseUrl}/investments/${userProfileId}`);
  }

  createInvestment(holding: Omit<InvestmentHolding, 'id' | 'investedAmount' | 'currentValue' | 'gainLoss' | 'gainLossPercent' | 'projectedValueOneYear' | 'projectedValueThreeYears' | 'projectedValueFiveYears' | 'projectedMaturityValue' | 'contributions'>): Observable<InvestmentHolding> {
    return this.http.post<InvestmentHolding>(`${this.baseUrl}/investments`, holding);
  }

  updateInvestment(id: string, holding: Omit<InvestmentHolding, 'id' | 'investedAmount' | 'currentValue' | 'gainLoss' | 'gainLossPercent' | 'projectedValueOneYear' | 'projectedValueThreeYears' | 'projectedValueFiveYears' | 'projectedMaturityValue' | 'contributions'>): Observable<InvestmentHolding> {
    return this.http.put<InvestmentHolding>(`${this.baseUrl}/investments/${id}`, holding);
  }

  deleteInvestment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/investments/${id}`);
  }

  addInvestmentContribution(holdingId: string, contribution: Omit<InvestmentContribution, 'id' | 'investmentHoldingId'> & { userProfileId: string }): Observable<InvestmentContribution> {
    return this.http.post<InvestmentContribution>(`${this.baseUrl}/investments/${holdingId}/contributions`, contribution);
  }

  getGoals(userProfileId: string): Observable<FinancialGoal[]> {
    return this.http.get<FinancialGoal[]>(`${this.baseUrl}/goals/${userProfileId}`);
  }

  createGoal(goal: Omit<FinancialGoal, 'id' | 'currentAmount' | 'remainingAmount' | 'progressPercent' | 'isCompleted' | 'contributions'>): Observable<FinancialGoal> {
    return this.http.post<FinancialGoal>(`${this.baseUrl}/goals`, goal);
  }

  updateGoal(id: string, goal: Omit<FinancialGoal, 'id' | 'currentAmount' | 'remainingAmount' | 'progressPercent' | 'isCompleted' | 'contributions'>): Observable<FinancialGoal> {
    return this.http.put<FinancialGoal>(`${this.baseUrl}/goals/${id}`, goal);
  }

  deleteGoal(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/goals/${id}`);
  }

  addGoalContribution(goalId: string, contribution: Omit<GoalContribution, 'id' | 'financialGoalId'>): Observable<GoalContribution> {
    return this.http.post<GoalContribution>(`${this.baseUrl}/goals/${goalId}/contributions`, contribution);
  }

  getFeedbackEntries(): Observable<FeedbackEntry[]> {
    return this.http.get<FeedbackEntry[]>(`${this.baseUrl}/feedback`);
  }

  createFeedbackEntry(entry: Omit<FeedbackEntry, 'id' | 'status' | 'createdAtUtc'>): Observable<FeedbackEntry> {
    return this.http.post<FeedbackEntry>(`${this.baseUrl}/feedback`, entry);
  }
}

export interface AuthResponse {
  userId: string;
  username: string;
  accessToken: string;
  expiresAtUtc: string;
  message: string;
}