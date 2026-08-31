
using ITHelpDeskAPI.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Microsoft.OpenApi;
using System.Text;

// =========================================================
// RENDER CONFIG
// =========================================================

Environment.SetEnvironmentVariable(
    "DOTNET_hostBuilder:reloadConfigOnChange",
    "false"
);

Environment.SetEnvironmentVariable(
    "ASPNETCORE_hostBuilder:reloadConfigOnChange",
    "false"
);

Environment.SetEnvironmentVariable(
    "DOTNET_USE_POLLING_FILE_WATCHER",
    "1"
);

var builder = WebApplication.CreateBuilder(args);

// =========================================================
// DATABASE
// =========================================================

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);

// =========================================================
// CORS
// =========================================================

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
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
// JWT
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
                    Reference =
                        new OpenApiReference
                        {
                            Type =
                                ReferenceType.SecurityScheme,
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
// SWAGGER
// =========================================================

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// =========================================================
// CORS
// MUST BE BEFORE AUTHENTICATION / AUTHORIZATION
// =========================================================

app.UseCors("AllowReact");

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



