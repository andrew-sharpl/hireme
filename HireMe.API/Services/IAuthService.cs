using HireMe.API.DTOs;

namespace HireMe.API.Services;

public interface IAuthService
{
    // LoginResponse may be null, indicating failed register/login.
    Task<ServiceResult<LoginResponse>> Register(RegisterRequest request);
    Task<ServiceResult<LoginResponse>> Login(LoginRequest request);
}