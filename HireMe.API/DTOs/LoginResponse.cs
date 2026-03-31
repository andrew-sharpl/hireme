namespace HireMe.API.DTOs;

/*
Defines DTO for when a User logs in.
Token represents a JWT token.
Username, email, and role are primarily used for UI elements.
*/
public class LoginResponse
{
    public string Token { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}