using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using ITHelpDeskAPI.Data;
using ITHelpDeskAPI.Models;

var builder = WebApplication.CreateBuilder(args);

// =========================
// DATABASE
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
// CONTROLLERS
// =========================

builder.Services.AddControllers();

// =========================
// SWAGGER
// =========================

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// =========================
// JWT
// =========================

var jwtKey = builder.Configuration["Jwt:Key"];

if (string.IsNullOrWhiteSpace(jwtKey))
{
    throw new InvalidOperationException(
        "JWT Key is missing.");
}

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
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
// AUTHORIZATION
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

// =====================================================
// DATABASE MIGRATION + SEED DATA
// =====================================================

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;

    try
    {
        var db =
            services.GetRequiredService<AppDbContext>();

        // Apply migrations
        db.Database.Migrate();

        // =========================
        // ROLES
        // =========================

        var adminRole =
            db.Roles.FirstOrDefault(r => r.Name == "Admin");

        if (adminRole == null)
        {
            adminRole = new Role
            {
                Name = "Admin"
            };

            db.Roles.Add(adminRole);
            db.SaveChanges();
        }

        var agentRole =
            db.Roles.FirstOrDefault(r => r.Name == "Agent");

        if (agentRole == null)
        {
            agentRole = new Role
            {
                Name = "Agent"
            };

            db.Roles.Add(agentRole);
            db.SaveChanges();
        }

        var employeeRole =
            db.Roles.FirstOrDefault(r => r.Name == "Employee");

        if (employeeRole == null)
        {
            employeeRole = new Role
            {
                Name = "Employee"
            };

            db.Roles.Add(employeeRole);
            db.SaveChanges();
        }

        // =========================
        // ADMIN USER
        // =========================

        var adminUser =
            db.Users.FirstOrDefault(
                u => u.Email == "admin@test.com"
            );

        if (adminUser == null)
        {
            adminUser = new User
            {
                Name = "Admin",
                Email = "admin@test.com",
                Password = "Admin123!",
                RoleId = adminRole.Id
            };

            db.Users.Add(adminUser);
            db.SaveChanges();
        }
        else
        {
            // Make sure existing admin has correct role/password
            adminUser.Name = "Admin";
            adminUser.Password = "Admin123!";
            adminUser.RoleId = adminRole.Id;

            db.SaveChanges();
        }

        Console.WriteLine(
            "======================================"
        );

        Console.WriteLine(
            "DATABASE MIGRATION SUCCESSFUL"
        );

        Console.WriteLine(
            "ADMIN USER READY: admin@test.com"
        );

        Console.WriteLine(
            "======================================"
        );
    }
    catch (Exception ex)
    {
        Console.WriteLine(
            "DATABASE INITIALIZATION ERROR:"
        );

        Console.WriteLine(ex.Message);

        if (ex.InnerException != null)
        {
            Console.WriteLine(
                ex.InnerException.Message
            );
        }
    }
}

// =========================
// SWAGGER
// =========================

// IMPORTANT:
// Swagger is enabled in production too
app.UseSwagger();

app.UseSwaggerUI();

// =========================
// CORS
// =========================

app.UseCors("AllowFrontend");

// =========================
// AUTHENTICATION
// =========================

app.UseAuthentication();

app.UseAuthorization();

// =========================
// CONTROLLERS
// =========================

app.MapControllers();

// =========================
// RUN
// =========================

app.Run();