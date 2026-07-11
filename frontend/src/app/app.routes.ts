import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
	{
		path: 'auth',
		loadComponent: () => import('./auth/auth-placeholder.page').then((page) => page.AuthPlaceholderPage)
	},
	{
		path: 'profile',
		canActivate: [authGuard],
		loadComponent: () => import('./profile/profile-setup.page').then((page) => page.ProfileSetupPage)
	},
	{
		path: 'dashboard',
		canActivate: [authGuard],
		loadComponent: () => import('./dashboard/dashboard.page').then((page) => page.DashboardPage)
	},
	{
		path: 'monthly-planning',
		canActivate: [authGuard],
		loadComponent: () => import('./monthly-planning/monthly-planning.page').then((page) => page.MonthlyPlanningPage)
	},
	{
		path: 'investments',
		canActivate: [authGuard],
		loadComponent: () => import('./investments/investments.page').then((page) => page.InvestmentsPage)
	},
	{
		path: 'goals',
		canActivate: [authGuard],
		loadComponent: () => import('./goals/goals.page').then((page) => page.GoalsPage)
	},
	{
		path: 'feedback',
		canActivate: [authGuard],
		loadComponent: () => import('./feedback/feedback.page').then((page) => page.FeedbackPage)
	},
	{ path: '', pathMatch: 'full', redirectTo: 'auth' },
	{ path: '**', redirectTo: 'auth' }
];
