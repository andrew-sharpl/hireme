using Microsoft.AspNetCore.Mvc;
using HireMe.API.DTOs;
using HireMe.API.Services;
using Microsoft.AspNetCore.Authorization;

namespace HireMe.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        var result = await _authService.Register(request);

        if (!result.Success)
            return BadRequest(new {error = result.Error});

        return Ok(result.Data);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var result = await _authService.Login(request);

        if (!result.Success)
            return Unauthorized(new {error = result.Error});
    
        return Ok(result.Data);
    }
}