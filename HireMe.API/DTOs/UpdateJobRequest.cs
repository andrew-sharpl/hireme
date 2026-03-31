using System.ComponentModel.DataAnnotations;

namespace HireMe.API.DTOs;

/*
Defines a DTO that is created when a poster updates a Job.
*/
public class UpdateJobRequest
{
    [Required]
    [MaxLength(50)]
    public string Title {get; set;} = string.Empty;

    [Required]
    [MaxLength(10_000)]
    public string Body {get; set;} = string.Empty;
}