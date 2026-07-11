# Hosting Financial Coach with Neon and Render

This is the recommended free MVP hosting path:

- Database: Neon free Postgres
- API: Render free Web Service using `backend/Dockerfile`
- Local development: SQLite remains the default

## Important

Never commit your Neon connection string. Store it only as a Render environment variable.

## Backend Configuration

Local defaults are in `backend/FinancialCoach.API/appsettings.json`:

```json
"Database": {
  "Provider": "Sqlite",
  "AutoCreate": false
}
```

For Render, add these environment variables:

```text
Database__Provider=Postgres
Database__AutoCreate=true
ConnectionStrings__DefaultConnection=<your Neon pooled connection string>
Cors__AllowedOrigins__0=https://localhost
Cors__AllowedOrigins__1=https://<your-web-frontend-domain>
```

`Database__AutoCreate=true` creates the fresh Neon schema from the current EF model. The existing migrations are SQLite-focused and should continue to be used for local SQLite development.

## Render Setup

1. Push the repo to GitHub.
2. In Render, choose Blueprint or Web Service.
3. Choose the `SwaroopJoe/FinCoach` repo.
4. If using Blueprint, Render reads `render.yaml` and creates `financial-coach-api`.
5. If using Web Service manually, use Docker and set the root directory to `backend` if Render asks for one.
6. Add `ConnectionStrings__DefaultConnection` as a secret environment variable.
7. Deploy.

The API exposes `/health` for Render health checks.

After deployment, Render gives a URL like:

```text
https://financial-coach-api.onrender.com
```

Your API base URL will be:

```text
https://financial-coach-api.onrender.com/api
```

## Frontend / Android API URL

Set `frontend/src/environments/environment.prod.ts`:

```ts
export const environment = {
  production: true,
  apiBaseUrl: 'https://financial-coach-api.onrender.com/api'
};
```

Then build/sync Android:

```powershell
Set-Location c:\Projects\FinCoach\frontend
npm run build
npx cap sync android
```

## Local Override

The app also supports a browser localStorage override for testing:

```js
localStorage.setItem('financialCoachApiBaseUrl', 'https://your-api.onrender.com/api')
```

Remove it with:

```js
localStorage.removeItem('financialCoachApiBaseUrl')
```