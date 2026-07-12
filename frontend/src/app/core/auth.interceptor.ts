import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const token = localStorage.getItem('financialCoachToken');
  const userId = localStorage.getItem('financialCoachUserId');

  if (!token && !userId) {
    return next(request);
  }

  return next(request.clone({
    setHeaders: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(userId ? { 'X-FinancialCoach-UserId': userId } : {})
    }
  }));
};