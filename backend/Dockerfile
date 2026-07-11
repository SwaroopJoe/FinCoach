FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY FinancialCoach.sln ./
COPY FinancialCoach.API/FinancialCoach.API.csproj FinancialCoach.API/
COPY FinancialCoach.Application/FinancialCoach.Application.csproj FinancialCoach.Application/
COPY FinancialCoach.Domain/FinancialCoach.Domain.csproj FinancialCoach.Domain/
COPY FinancialCoach.Infrastructure/FinancialCoach.Infrastructure.csproj FinancialCoach.Infrastructure/
COPY FinancialCoach.Tests/FinancialCoach.Tests.csproj FinancialCoach.Tests/
RUN dotnet restore FinancialCoach.sln

COPY . .
RUN dotnet publish FinancialCoach.API/FinancialCoach.API.csproj -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "FinancialCoach.API.dll"]