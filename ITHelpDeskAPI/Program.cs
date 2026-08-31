using ITHelpDeskAPI.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// =========================================================
// RENDER / FILE WATCHER
// =========================================================

Environment.SetEnvironmentVariable(
    "DOTNET_USE_POLLING_FILE_WATCHER",
    "1"
);

AppContext.SetSwitch(
    "Microsoft.Extensions.Configuration.FileSystemWatcher",
    false
);

// =========================================================
// DATABASE
// =========================================================

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")
    );
});

// =========================================================
// CORS
// =========================================================

const string CorsPolicy = "AllowReact";

builder.Services.AddCors(options =>
{
    options.AddPolicy(CorsPolicy, policy =>
    {
        policy
            .SetIsOriginAllowed(origin =>
                origin == "http://localhost:5173" ||
                origin == "https://it-help-desk-frontend-vjcz.onrender.com"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// =========================================================
// CONTROLLERS
// =========================================================

builder.Services.AddControllers();

// =========================================================
// HTTP CLIENT
// =========================================================

builder.Services.AddHttpClient();

// =========================================================
// JWT AUTHENTICATION
// =========================================================

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme =
        JwtBearerDefaults.AuthenticationScheme;

    options.DefaultChallengeScheme =
        JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters =
        new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer =
                builder.Configuration["Jwt:Issuer"],

            ValidAudience =
                builder.Configuration["Jwt:Audience"],

            IssuerSigningKey =
                new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(
                        builder.Configuration["Jwt:Key"]!
                    )
                )
        };
});

// =========================================================
// AUTHORIZATION
// =========================================================

builder.Services.AddAuthorization();

// =========================================================
// SWAGGER
// =========================================================

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition(
        "Bearer",
        new OpenApiSecurityScheme
        {
            Name = "Authorization",
            Type = SecuritySchemeType.Http,
            Scheme = "Bearer",
            BearerFormat = "JWT",
            In = ParameterLocation.Header,
            Description = "Enter: Bearer {your JWT token}"
        }
    );

    options.AddSecurityRequirement(
        new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                },
                Array.Empty<string>()
            }
        }
    );
});

// =========================================================
// BUILD
// =========================================================

var app = builder.Build();

// =========================================================
// CORS
// =========================================================

// MUST be before authentication and controllers
app.UseCors(CorsPolicy);

// =========================================================
// STATIC FILES
// =========================================================

app.UseStaticFiles();

// =========================================================
// AUTHENTICATION
// =========================================================

app.UseAuthentication();

// =========================================================
// AUTHORIZATION
// =========================================================

app.UseAuthorization();

// =========================================================
// CONTROLLERS
// =========================================================

app.MapControllers();

// =========================================================
// RUN
// =========================================================

app.Run();




