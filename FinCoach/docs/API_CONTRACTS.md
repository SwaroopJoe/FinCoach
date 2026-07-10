# API Contracts

Base path: `/api`

## Auth Placeholder

`POST /auth/login`

Request:

```json
{ "name": "Aarav" }
```

Response:

```json
{
  "accessToken": "local-placeholder-token",
  "expiresAtUtc": "2026-07-10T20:00:00Z",
  "message": "Welcome, Aarav. Authentication is running in local placeholder mode."
}
```

## Profile

`GET /profile`

Returns the default local user profile.

`PUT /profile`

Request:

```json
{
  "name": "Aarav",
  "salary": 120000,
  "salaryCreditDay": 1,
  "preferredCurrency": "INR",
  "notificationTimes": ["12:00", "14:00", "19:00"],
  "familySize": 3,
  "financialPreferences": "Prioritize emergency fund and long-term investing."
}
```

## Monthly Plans

`GET /monthly-plans/current/{userProfileId}`

Returns the current month plan if it exists.

`POST /monthly-plans`

Request:

```json
{
  "userProfileId": "00000000-0000-0000-0000-000000000000",
  "planMonth": "2026-07-01T00:00:00Z",
  "incomeItems": [{ "name": "Salary", "amount": 120000 }],
  "recurringExpenses": [{ "name": "Rent", "amount": 32000 }],
  "investments": [{ "name": "SIP", "amount": 18000 }],
  "variableBudgets": [{ "category": "Grocery", "budgetAmount": 16000, "spentAmount": 0 }]
}
```

Response includes application-calculated `totalIncome`, `totalAllocation`, `remainingBalance`, and `savingsRate`.

## Dashboard

`GET /dashboard/{userProfileId}`

Returns monthly income, expenses, remaining budget, investments, loan placeholders, budget utilization, goal placeholder, and financial health score.