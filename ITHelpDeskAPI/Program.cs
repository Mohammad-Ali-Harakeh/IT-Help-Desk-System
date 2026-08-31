using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using ITHelpDeskAPI.Data;
using ITHelpDeskAPI.Models;

var builder = WebApplication.CreateBuilder(args);

// =========================
// Database
// =========================

var connectionString =
    builder.Configuration.GetConnectionString("DefaultConnection");

if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException(
        "Connection string 'DefaultConnection' was not found.");
}

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// =========================
// Controllers
// =========================

builder.Services.AddControllers();

// =========================
// Swagger
// =========================

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// =========================
// JWT Authentication
// =========================

var jwtKey = builder.Configuration["Jwt:Key"];

if (string.IsNullOrWhiteSpace(jwtKey))
{
    throw new InvalidOperationException("JWT Key is missing.");
}

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,

                IssuerSigningKey =
                    new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(jwtKey)
                    ),

                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = true
            };
    });

// =========================
// Authorization
// =========================

builder.Services.AddAuthorization();

// =========================
// CORS
// =========================

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins(
                "https://it-help-desk-frontend-vjcz.onrender.com",
                "http://localhost:5173"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// =========================
// DATABASE MIGRATION + SEED
// =========================

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;

    var context = services.GetRequiredService<AppDbContext>();

    // Apply migrations
    context.Database.Migrate();

    // =========================
    // SEED ROLES
    // =========================

    if (!context.Roles.Any())
    {
        context.Roles.AddRange(
            new Role
            {
                Id = 1,
                Name = "Admin"
            },
            new Role
            {
                Id = 2,
                Name = "Agent"
            },
            new Role
            {
                Id = 3,
                Name = "Employee"
            }
        );

        context.SaveChanges();
    }

    // =========================
    // SEED ADMIN USER
    // =========================

    var adminExists =
        context.Users.Any(u =>
            u.Email == "admin@test.com");

    if (!adminExists)
    {
        context.Users.Add(
            new User
            {
                Name = "Admin",
                Email = "admin@test.com",
                Password = "Admin123!",
                RoleId = 1
            });

        context.SaveChanges();
    }
}

// =========================
// Middleware
// =========================

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();