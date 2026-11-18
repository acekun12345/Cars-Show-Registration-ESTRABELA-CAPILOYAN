using System.Text.Json.Serialization;
using Api.Features.Registrations;
using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Application.Features.Registrations;
using Application.Features.Registrations.CreateRegistration;
using Application.Features.Registrations.GetRegistrationById;
using Application.Features.Registrations.GetRegistrations;
using Application.Features.Registrations.GetRegistrationSummary;
using Domain.Common;
using FluentValidation;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Database (SQLite file inside the Api folder)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (string.IsNullOrEmpty(connectionString) || connectionString.Contains("carshow.db"))
{
    var dbPath = Path.Combine(builder.Environment.ContentRootPath, "carshow.db");
    connectionString = $"Data Source={dbPath}";
}
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(connectionString));
builder.Services.AddScoped<IAppDbContext>(sp => sp.GetRequiredService<AppDbContext>());

// Validators
builder.Services.AddValidatorsFromAssembly(typeof(IAppDbContext).Assembly);

// Handlers
builder.Services.AddScoped<ICommandHandler<CreateRegistrationCommand, Result<RegistrationResponse>>, CreateRegistrationHandler>();
builder.Services.AddScoped<IQueryHandler<GetRegistrationsQuery, Result<PagedResponse<RegistrationResponse>>>, GetRegistrationsHandler>();
builder.Services.AddScoped<IQueryHandler<GetRegistrationByIdQuery, Result<RegistrationResponse>>, GetRegistrationByIdHandler>();
builder.Services.AddScoped<IQueryHandler<GetRegistrationSummaryQuery, Result<RegistrationSummaryResponse>>, GetRegistrationSummaryHandler>();

// JSON: enums as strings (reject integer enum values)
builder.Services.ConfigureHttpJsonOptions(options =>
    options.SerializerOptions.Converters.Add(new JsonStringEnumConverter(allowIntegerValues: false)));

// ProblemDetails service
builder.Services.AddProblemDetails();

// CORS: React dev server
builder.Services.AddCors(options => options.AddPolicy("react", policy =>
    policy.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod()));

// API
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi(options =>
{
    options.AddDocumentTransformer((document, _, _) =>
    {
        document.Info.Title = "Car Show Registration API";
        document.Info.Description = "Vertical Slice API for Car Show 2027 registrations";
        return Task.CompletedTask;
    });
});

var app = builder.Build();

// Apply migrations at startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await db.Database.MigrateAsync();
}

app.UseCors("react");

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

// Root endpoint
app.MapGet("/", () => "Car Show Registration API. Go to /scalar/v1 for API documentation.");

// Map endpoints
app.MapRegistrationEndpoints();

app.Run();
