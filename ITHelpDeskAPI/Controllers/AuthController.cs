using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using ITHelpDeskAPI.Data;
using ITHelpDeskAPI.DTOs;
using Microsoft.EntityFrameworkCore;

namespace ITHelpDeskAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto request)
        {
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(x => x.Email == request.Email);

            if (existingUser != null)
            {
                return BadRequest("User already exists");
            }


            var role = await _context.Roles
                .FirstOrDefaultAsync(x => x.Id == request.RoleId);

            if (role == null)
            {
                return BadRequest("Role not found");
            }


            var user = new Models.User
            {
                Name = request.Name,
                Email = request.Email,
                Password = request.Password,
                RoleId = request.RoleId
            };


            _context.Users.Add(user);
            await _context.SaveChangesAsync();


            return Ok(new
            {
                message = "User registered successfully"
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto request)
        {
            var user = await _context.Users
                .Include(x => x.Role)
                .FirstOrDefaultAsync(x => x.Email == request.Email);


            if (user == null)
            {
                return Unauthorized("User not found");
            }

            if (user.Role == null)
            {
                return BadRequest("Role is null");
            }


            if (user.Password != request.Password)
            {
                return Unauthorized("Invalid Email or Password");
            }


            var token = GenerateJwtToken(user);


            return Ok(new
            {
                message = "Login successful",
                token = token,
                user = user.Name,
                role = user.Role.Name
            });
        }



        private string GenerateJwtToken(Models.User user)
        {
            var claims = new[]
            {
        new Claim(ClaimTypes.Name, user.Name),
        new Claim(ClaimTypes.Email, user.Email),
        new Claim(ClaimTypes.Role, user.Role?.Name ?? "User")
    };


            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!)
            );


            var creds = new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256
            );


            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(2),
                signingCredentials: creds
            );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}