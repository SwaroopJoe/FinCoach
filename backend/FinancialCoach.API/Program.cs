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
