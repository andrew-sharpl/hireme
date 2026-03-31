using System.ComponentModel.DataAnnotations;

namespace HireMe.API.Models;

/* 
Defines the data model for a Job.
Contains reference to the User that created it, along with that User's ID (primary key).
InterestedUsers contains a list of records of which Users are interested in the Job.
*/
public class Job
{
    public int Id {get; set;}

    [Required]
    [MaxLength(50)]
    public string Title {get; set;} = string.Empty;

    [Required]
    [MaxLength(10_000)]
    public string Body {get; set;} = string.Empty;

    public DateTime PostedAt {get; set;} = DateTime.UtcNow;


    public User PostedBy {get; set;} = null!;
    public int PostedById {get; set;}

    // 
    public List<JobInterest> InterestedUsers {get; set;} = new();
}