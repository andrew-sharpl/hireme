using System.ComponentModel.DataAnnotations;

namespace HireMe.API.Models;

public enum UserRole
{
    Viewer,
    Poster
}

/*
Defines the data model for a User.
Contains a list of references to Jobs the User created if they are a Poster.
Contains a list of references to JobInterests the User is intererested in if they are a Viewer.
*/
public class User
{
    public int Id {get; set;}

    [Required]
    [MaxLength(50)]
    public string Username {get; set;} = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(100)]
    public string Email {get; set;} = string.Empty;

    [Required]
    public string PasswordHash {get; set;} = string.Empty;

    [Required]
    public UserRole Role {get; set;}

    public DateTime CreatedAt {get; set;} = DateTime.UtcNow;

    public List<Job> Jobs {get; set;} = new();
    public List<JobInterest> JobInterests {get; set;} = new();
}