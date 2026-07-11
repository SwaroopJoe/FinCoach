using FinancialCoach.Application;
using FinancialCoach.Infrastructure;
using FinancialCoach.Infrastructure.Persistence;
using FluentValidation.AspNetCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
});
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
    ?? ["http://localhost:4200", "http://localhost:8100", "https://localhost"];
allowedOrigins = allowedOrigins
    .Concat(["http://localhost:4200", "http://localhost:8100", "https://localhost"])
    .Distinct(StringComparer.OrdinalIgnoreCase)
    .ToArray();
builder.Services.AddCors(options =>
{
    options.AddPolicy("LocalFrontend", policy => policy
        .WithOrigins(allowedOrigins)
        .AllowAnyHeader()
        .AllowAnyMethod());
});
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (bool.TryParse(app.Configuration["Database:AutoCreate"], out var autoCreateDatabase) && autoCreateDatabase)
{
    using var scope = app.Services.CreateScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<FinancialCoachDbContext>();
    await dbContext.Database.EnsureCreatedAsync();

    try
    {
        await dbContext.AppUsers.AnyAsync();
    }
    catch (Exception exception) when (exception is DbUpdateException or InvalidOperationException or Npgsql.PostgresException)
    {
        var databaseCreator = dbContext.Database.GetService<IRelationalDatabaseCreator>();
        await databaseCreator.CreateTablesAsync();
    }

    await EnsureFeedbackEntriesTableAsync(dbContext);
    await EnsureInvestmentTenureColumnAsync(dbContext);
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("LocalFrontend");

app.UseAuthorization();

app.MapGet("/health", () => Results.Ok(new { status = "healthy" }));
app.MapControllers();

app.Run();

static async Task EnsureFeedbackEntriesTableAsync(FinancialCoachDbContext dbContext)
{
    var provider = dbContext.Database.ProviderName ?? string.Empty;

    if (provider.Contains("Npgsql", StringComparison.OrdinalIgnoreCase))
    {
        await dbContext.Database.ExecuteSqlRawAsync("""
            CREATE TABLE IF NOT EXISTS "FeedbackEntries" (
                "Id" uuid NOT NULL,
                "UserProfileId" uuid NULL,
                "Type" integer NOT NULL,
                "Title" character varying(140) NOT NULL,
                "Description" character varying(2000) NOT NULL,
                "ContactEmail" character varying(180) NOT NULL,
                "Status" character varying(40) NOT NULL,
                "CreatedAtUtc" timestamp with time zone NOT NULL,
                "UpdatedAtUtc" timestamp with time zone NULL,
                "SyncVersion" bigint NOT NULL,
                CONSTRAINT "PK_FeedbackEntries" PRIMARY KEY ("Id"),
                CONSTRAINT "FK_FeedbackEntries_UserProfiles_UserProfileId" FOREIGN KEY ("UserProfileId") REFERENCES "UserProfiles" ("Id") ON DELETE SET NULL
            );
            CREATE INDEX IF NOT EXISTS "IX_FeedbackEntries_CreatedAtUtc" ON "FeedbackEntries" ("CreatedAtUtc");
            CREATE INDEX IF NOT EXISTS "IX_FeedbackEntries_UserProfileId" ON "FeedbackEntries" ("UserProfileId");
            """);
        return;
    }

    await dbContext.Database.ExecuteSqlRawAsync("""
        CREATE TABLE IF NOT EXISTS "FeedbackEntries" (
            "Id" TEXT NOT NULL CONSTRAINT "PK_FeedbackEntries" PRIMARY KEY,
            "UserProfileId" TEXT NULL,
            "Type" INTEGER NOT NULL,
            "Title" TEXT NOT NULL,
            "Description" TEXT NOT NULL,
            "ContactEmail" TEXT NOT NULL,
            "Status" TEXT NOT NULL,
            "CreatedAtUtc" TEXT NOT NULL,
            "UpdatedAtUtc" TEXT NULL,
            "SyncVersion" INTEGER NOT NULL,
            CONSTRAINT "FK_FeedbackEntries_UserProfiles_UserProfileId" FOREIGN KEY ("UserProfileId") REFERENCES "UserProfiles" ("Id") ON DELETE SET NULL
        );
        CREATE INDEX IF NOT EXISTS "IX_FeedbackEntries_CreatedAtUtc" ON "FeedbackEntries" ("CreatedAtUtc");
        CREATE INDEX IF NOT EXISTS "IX_FeedbackEntries_UserProfileId" ON "FeedbackEntries" ("UserProfileId");
        """);
}

static async Task EnsureInvestmentTenureColumnAsync(FinancialCoachDbContext dbContext)
{
    var provider = dbContext.Database.ProviderName ?? string.Empty;

    if (provider.Contains("Npgsql", StringComparison.OrdinalIgnoreCase))
    {
        await dbContext.Database.ExecuteSqlRawAsync("""
            ALTER TABLE "InvestmentHoldings" ADD COLUMN IF NOT EXISTS "TenureYears" integer NOT NULL DEFAULT 5;
            """);
        return;
    }

    try
    {
        await dbContext.Database.ExecuteSqlRawAsync("""
            ALTER TABLE "InvestmentHoldings" ADD COLUMN "TenureYears" INTEGER NOT NULL DEFAULT 5;
            """);
    }
    catch (Exception exception) when (exception.Message.Contains("duplicate column", StringComparison.OrdinalIgnoreCase))
    {
    }
}
