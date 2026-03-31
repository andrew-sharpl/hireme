using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HireMe.API.Services;

namespace HireMe.API.Controllers;


[ApiController]
[Route("api/jobs/{jobid}")]
[Authorize]
public class InterestController : ControllerBase
{
    private readonly IJobService _jobService;

    public InterestController(IJobService jobService)
    {
        _jobService = jobService;
    }

    private int GetUserId() =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);


    [HttpPost("interest")]
    [Authorize(Roles = "Viewer")]
    public async Task<IActionResult> ToggleInterest(int jobId)
    {
        var result = await _jobService.ToggleInterest(jobId, GetUserId());

        if (!result.Success)
            return NotFound(new {error = result.Error});
        
        return Ok(new {interested = result.Data});
    }

    [HttpPost("interested")]
    [Authorize(Roles = "Poster")]
    public async Task<IActionResult> GetInterestedUsers(int jobId)
    {
        var result = await _jobService.GetInterestedUsers(jobId, GetUserId());

        if (!result.Success)
            return BadRequest(new {error = result.Error});
        
        return Ok(result.Data);
    }
}