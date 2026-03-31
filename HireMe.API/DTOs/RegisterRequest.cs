using System.ComponentModel.DataAnnotations;
using HireMe.API.Models;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace HireMe.API.DTOs;

public class RegisterRequest
{
    [Required]
    [MaxLength(50)]
    public string Username {get; set;} = string.Empty;

    [Required]
    [EmailAddress(ErrorMessage = "Invalid email address")]
    [MaxLength(100)]
    public string Email {get; set;} = string.Empty;

    [Required]
    [MinLength(6, ErrorMessage = "Password must be at least 6 characters")]
    [MaxLength(100)]
    public string Password {get; set;} = string.Empty;

    [Required]
    public UserRole Role {get; set;}
}