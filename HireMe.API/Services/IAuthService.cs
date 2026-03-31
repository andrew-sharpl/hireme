using HireMe.API.DTOs;

namespace HireMe.API.Services;

public interface IAuthService
{
    // LoginResponse may be null, indicating failed register/login.
    Task<LoginResponse?> Register(RegisterRequest request);
    Task<LoginResponse?> Login(LoginRequest request);
}