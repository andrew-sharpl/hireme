using System.ComponentModel.DataAnnotations;

namespace HireMe.API.DTOs;

/*
Defines DTO that is created when a new Job is made by a poster.
*/
public class CreateJobRequest
{
    [Required]
    [MaxLength(50)]
    public string Title {get; set;} = string.Empty;

    [Required]
    [MaxLength(10_000)]
    public string Body {get; set;} = string.Empty;
}