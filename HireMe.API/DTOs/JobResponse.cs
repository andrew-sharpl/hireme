namespace HireMe.API.DTOs;

/*
Defines DTO that the frontend uses for Job information.
*/
public class JobResponse
{
    public int Id {get; set;}
    public string Title {get; set;} = string.Empty;
    public string Body {get; set;} = string.Empty;
    public DateTime PostedAt {get; set;}
    public string PostedByUsername {get; set;} = string.Empty;
    public int InterestCount {get; set;}
    public bool IsInterestedByCurrentUser {get; set;}
}