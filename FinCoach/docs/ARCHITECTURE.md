# Architecture

Financial Coach is structured as a monorepo with a Clean Architecture backend and a mobile-first Angular frontend.

## Backend

- `FinancialCoach.Domain`: entities, enums, and calculation-friendly domain model rules.
- `FinancialCoach.Application`: DTOs, validators, repository interfaces, and use-case services.
- `FinancialCoach.Infrastructure`: EF Core SQLite persistence, migrations, and repository implementations.
- `FinancialCoach.API`: controllers, Swagger, CORS, validation, and dependency injection composition.
- `FinancialCoach.Tests`: focused unit tests for calculation behavior.

Dependencies flow inward: API references Application and Infrastructure; Infrastructure references Application and Domain; Application references Domain; Domain has no project dependencies.

## Frontend

- `core`: auth guard, HTTP interceptor, API service, and local financial store.
- `models`: TypeScript contracts matching the first API surface.
- `auth`: local MVP authentication placeholder.
- `dashboard`: first financial overview screen.
- `profile`: user profile setup.
- `monthly-planning`: income, recurring expense, investment, and variable budget planning.

The frontend uses standalone Angular routes and is prepared for Capacitor Android packaging.

## AI Boundary

AI is a coaching/advice layer only. Financial calculations are owned by application logic and domain services. Future AI features should receive processed financial snapshots and return explanations, recommendations, comparisons, and educational guidance.