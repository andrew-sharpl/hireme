using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HireMe.API.DTOs;
using HireMe.API.Services;

namespace HireMe.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class JobsController : ControllerBase
{
    private readonly IJobService _jobService;

    public JobsController(IJobService jobService)
    {
        _jobService = jobService;
    }

    // Helper to get the current user's ID from the JWT
    private int GetUserId() =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> GetJobs([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? search = null)
    {
        var result = await _jobService.GetJobs(page, pageSize, search, GetUserId());
        
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetJob(int id)
    {
        var result = await _jobService.GetJob(id, GetUserId());

        if (!result.Success)
            return NotFound(new {error = result.Error});
        
        return Ok(result.Data);
    }

    [HttpPost]
    [Authorize(Roles = "Poster")]
    public async Task<IActionResult> CreateJob(CreateJobRequest request)
    {
        var result = await _jobService.CreateJob(request, GetUserId());

        if (!result.Success)
            return BadRequest(new {error = result.Error});

        return Ok(result.Data);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Poster")]
    public async Task<IActionResult> UpdateJob(int id, UpdateJobRequest request)
    {
        var result = await _jobService.UpdateJob(id, request, GetUserId());

        if (!result.Success)
            return BadRequest(new {error = result.Error});

        return Ok(result.Data);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Poster")]
    public async Task<IActionResult> DeleteJob(int id)
    {
        var result = await _jobService.DeleteJob(id, GetUserId());

        if (!result.Success)
            return BadRequest(new {error = result.Error});

        return Ok(new {message = "Job deleted successfully."});
    }
}