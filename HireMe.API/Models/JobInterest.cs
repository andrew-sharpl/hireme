namespace HireMe.API.Models;

/*
Record containing information of when a User expresses interest in a Job.`
*/
public class JobInterest
{
    public int Id {get; set;}

    public DateTime InterestedAt {get; set;} = DateTime.UtcNow;
    public Job Job {get; set;} = null!;
    public int JobId {get; set;}

    public User User {get; set;} = null!;
    public int UserId {get; set;}
    
}