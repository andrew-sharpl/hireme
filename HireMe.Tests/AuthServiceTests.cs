using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using HireMe.API.Data;
using HireMe.API.DTOs;
using HireMe.API.Models;
using HireMe.API.Services;

namespace HireMe.Tests;

public class AuthServiceTests
{
    // Creates a fresh in-memory database and AuthService for each test
    private (AppDbContext, AuthService) CreateSut(string dbName)
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(dbName)
            .Options;

        var context = new AppDbContext(options);

        var config = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:Key"] = "super-secret-test-key-that-is-long-enough",
                ["Jwt:Issuer"] = "test-issuer",
                ["Jwt:Audience"] = "test-audience"
            })
            .Build();

        var service = new AuthService(context, config);
        return (context, service);
    }

    [Fact]
    public async Task Register_WithValidData_ReturnsToken()
    {
        var (_, service) = CreateSut(nameof(Register_WithValidData_ReturnsToken));

        var result = await service.Register(new RegisterRequest
        {
            Username = "alice",
            Email = "alice@example.com",
            Password = "password123",
            Role = UserRole.Viewer
        });

        Assert.True(result.Success);
        Assert.NotNull(result.Data);
        Assert.NotEmpty(result.Data.Token);
        Assert.Equal("alice", result.Data.Username);
        Assert.Equal("Viewer", result.Data.Role);
    }

    [Fact]
    public async Task Register_WithDuplicateEmail_ReturnsError()
    {
        var (_, service) = CreateSut(nameof(Register_WithDuplicateEmail_ReturnsError));

        var request = new RegisterRequest
        {
            Username = "alice",
            Email = "alice@example.com",
            Password = "password123",
            Role = UserRole.Viewer
        };
        await service.Register(request);    // Register the first time
                                            // Register again with the same email
        var result = await service.Register(request);

        Assert.False(result.Success);
        Assert.Equal("Email is already registered", result.Error);
    }

    [Fact]
    public async Task Login_WithValidCredentials_ReturnsToken()
    {
        var (_, service) = CreateSut(nameof(Login_WithValidCredentials_ReturnsToken));

        await service.Register(new RegisterRequest
        {
            Username = "bob",
            Email = "bob@example.com",
            Password = "mypassword",
            Role = UserRole.Poster
        });

        var result = await service.Login(new LoginRequest
        {
            Email = "bob@example.com",
            Password = "mypassword"
        });

        Assert.True(result.Success);
        Assert.NotNull(result.Data);
        Assert.Equal("bob", result.Data.Username);
        Assert.Equal("Poster", result.Data.Role);
    }

    [Fact]
    public async Task Login_WithWrongPassword_ReturnsError()
    {
        var (_, service) = CreateSut(nameof(Login_WithWrongPassword_ReturnsError));

        await service.Register(new RegisterRequest
        {
            Username = "carol",
            Email = "carol@example.com",
            Password = "correctpassword",
            Role = UserRole.Viewer
        });

        var result = await service.Login(new LoginRequest
        {
            Email = "carol@example.com",
            Password = "wrongpassword"
        });

        Assert.False(result.Success);
        Assert.Equal("Invalid email or password", result.Error);
    }

    [Fact]
    public async Task Login_WithNonExistentEmail_ReturnsError()
    {
        var (_, service) = CreateSut(nameof(Login_WithNonExistentEmail_ReturnsError));

        var result = await service.Login(new LoginRequest
        {
            Email = "nobody@example.com",
            Password = "password"
        });

        Assert.False(result.Success);
        Assert.Equal("Invalid email or password", result.Error);
    }

}
