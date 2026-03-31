using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using HireMe.API.Data;
using HireMe.API.DTOs;
using HireMe.API.Models;

namespace HireMe.API.Services;


public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthService(AppDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    public async Task<ServiceResult<LoginResponse>> Register(RegisterRequest request)
    {
        // Check if email exists
        if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            return ServiceResult<LoginResponse>.Fail("Email is already registered");


        var user = new User
        {
            Username = request.Username,
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = request.Role,
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return ServiceResult<LoginResponse>.Ok(new LoginResponse
        {
            Token = GenerateToken(user),
            Username = user.Username,
            Email = user.Email,
            Role = user.Role.ToString()
        });
    }

        public async Task<ServiceResult<LoginResponse>> Login(LoginRequest request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return ServiceResult<LoginResponse>.Fail("Invalid email or password");

        return ServiceResult<LoginResponse>.Ok(new LoginResponse
        {
            Token = GenerateToken(user),
            Username = user.Username,
            Email = user.Email,
            Role = user.Role.ToString()
        });
    }

    private string GenerateToken(User user)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Name, user.Username),
            new(ClaimTypes.Role, user.Role.ToString())
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));

        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(24),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}