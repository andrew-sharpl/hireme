using System.ComponentModel.DataAnnotations;

namespace HireMe.API.DTOs;

/*
Defines DTO for a User logging into the application.
Note that password is not hashed since the service layer handles hashing.
*/
public class LoginRequest
{
    [Required]
    [EmailAddress]
    public string Email {get; set;} = string.Empty;

    [Required]
    public string Password {get; set;} = string.Empty;
}