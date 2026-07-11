# Financial Coach

Financial Coach is an Android-first mobile app and web app for personal finance planning. The first implementation increment includes a .NET 8 Clean Architecture API, SQLite persistence, an Angular/Ionic/Capacitor frontend shell, authentication placeholder, dashboard, profile setup, and monthly planning.

## Philosophy

Plan your money. Adapt when life changes. Always know where you're headed.

The product should encourage users and never shame them for unexpected financial situations.

## Stack

- Frontend: Angular, Ionic Angular, Capacitor, Angular Material 3
- Backend: ASP.NET Core .NET 8 Web API
- Database: SQLite for MVP, with EF Core boundaries for future Postgres/cloud sync
- Cost: free/open-source local development stack

## First Increment

- Backend folder structure and solution projects
- Domain models for profile, monthly planning, expenses, budget versions, and sync metadata
- SQLite database schema via EF Core migration
- API contracts for auth placeholder, profile, monthly plans, and dashboard summary
- Angular routing and navigation
- Authentication placeholder
- Dashboard screen
- Monthly planning module

## Run Backend

```powershell
Set-Location backend
dotnet restore
dotnet build
dotnet test
dotnet ef database update --project FinancialCoach.Infrastructure --startup-project FinancialCoach.API
dotnet run --project FinancialCoach.API
```

Swagger is available from the API development URL at `/swagger`.

## Run Frontend

```powershell
Set-Location frontend
npm install
npm run build
npm start
```

## Android Readiness

```powershell
Set-Location frontend
npm run cap:add:android
npm run cap:sync
```

Running on an emulator or device requires the Android SDK to be installed locally.