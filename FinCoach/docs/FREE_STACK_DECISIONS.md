# Free Stack Decisions

The first increment uses only free/open-source or free local tooling.

- Angular, Ionic, Capacitor, and Angular Material are free for app development.
- ASP.NET Core, EF Core, and SQLite are free.
- Swagger/OpenAPI tooling is free.
- xUnit and Angular build tooling are free.

## Database Decision

SQLite is used now because it has no hosting cost, no server dependency, and fits an Android-first/offline-friendly MVP. Postgres is a better future option when the app needs cloud sync, multi-device accounts, family accounts, or shared data.

## Authentication Decision

Authentication is intentionally a placeholder in this increment. A production identity flow can be selected later without blocking the domain model, planning logic, or UI shell.