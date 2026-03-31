using Microsoft.EntityFrameworkCore;
using HireMe.API.Data;
using HireMe.API.DTOs;
using HireMe.API.Models;

namespace HireMe.API.Services;

public class JobService : IJobService
{
    private readonly AppDbContext _context;

    public JobService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<PagedResponse<JobResponse>> GetJobs(int page, int pageSize, string? search, int? currentUserId)
    {
        // Gets jobs from database. Includes date for sorting and job interests for display.
        var query = _context.Jobs
            .Include(j => j.PostedBy)
            .Include(j => j.JobInterests)
            .AsQueryable();

        // Filters by search term if one was provided
        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(j => j.Title.Contains(search) || j.Body.Contains(search));
        }

        var totalCount = await query.CountAsync();

        // Gets list of jobs on the page and creates a list of JobResponse items.
        var jobs = await query
            .OrderByDescending(j => j.PostedAt)
            .Skip(pageSize * (page - 1))
            .Take(pageSize)
            .Select(j => new JobResponse
            {
                Id = j.Id,
                Title = j.Title,
                Body = j.Body,
                PostedAt = j.PostedAt,
                PostedByUsername = j.PostedBy.Username,
                InterestCount = j.JobInterests.Count,
                IsInterestedByCurrentUser = currentUserId.HasValue && j.JobInterests.Any(ji => ji.UserId == currentUserId.Value)
            }).ToListAsync();

        return new PagedResponse<JobResponse>
        {
            Items = jobs,
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount
        };
    }

    public async Task<ServiceResult<JobResponse>> GetJob(int id, int? currentUserId)
    {
        // Gets job from database by id
        var job = await _context.Jobs
            .Include(j => j.PostedBy)
            .Include(j => j.JobInterests)
            .FirstOrDefaultAsync(j => j.Id == id);

        if (job == null)
            return ServiceResult<JobResponse>.Fail("Job not found.");
        
        return ServiceResult<JobResponse>.Ok(new JobResponse
        {
            Id = job.Id,
            Title = job.Title,
            Body = job.Body,
            PostedAt = job.PostedAt,
            PostedByUsername = job.PostedBy.Username,
            InterestCount = job.JobInterests.Count,
            IsInterestedByCurrentUser = currentUserId.HasValue && job.JobInterests.Any(ji => ji.UserId == currentUserId.Value)
        });
    }

    public async Task<ServiceResult<JobResponse>> CreateJob(CreateJobRequest request, int userId)
    {
        var job = new Job
        {
            Title = request.Title,
            Body = request.Body,
            PostedAt = DateTime.UtcNow,
            PostedById = userId
        };

        // Updated database with new job
        _context.Jobs.Add(job);
        await _context.SaveChangesAsync();

        // Loads the User object for PostedBy on the new job
        await _context.Entry(job).Reference(j => j.PostedBy).LoadAsync();

        return ServiceResult<JobResponse>.Ok(new JobResponse
        {
            Id = job.Id,
            Title = job.Title,
            Body = job.Body,
            PostedAt = job.PostedAt,
            PostedByUsername = job.PostedBy.Username,
            InterestCount = 0,
            IsInterestedByCurrentUser = false
        });
    }

    public async Task<ServiceResult<JobResponse>> UpdateJob(int id, UpdateJobRequest request, int userId)
    {
        // Gets job from database by id
        var job = await _context.Jobs
            .Include(j => j.PostedBy)
            .Include(j => j.JobInterests)
            .FirstOrDefaultAsync(j => j.Id == id);

        if (job == null)
            return ServiceResult<JobResponse>.Fail("Job not found.");

        if (job.PostedById != userId)
            return ServiceResult<JobResponse>.Fail("You can only edit your own jobs.");

        // Updating job data and pushing it to database
        job.Title = request.Title;
        job.Body = request.Body;
        await _context.SaveChangesAsync();

        // Returns the updated job
        return ServiceResult<JobResponse>.Ok(new JobResponse
        {
            Id = job.Id,
            Title = job.Title,
            Body = job.Body,
            PostedAt = job.PostedAt,
            PostedByUsername = job.PostedBy.Username,
            InterestCount = job.JobInterests.Count,
            IsInterestedByCurrentUser = false
        });
    }

    public async Task<ServiceResult<bool>> DeleteJob(int id, int userId)
    {
        var job = await _context.Jobs.FindAsync(id);

        if (job == null)
            return ServiceResult<bool>.Fail("Job not found.");

        if (job.PostedById != userId)
            return ServiceResult<bool>.Fail("You can only delete your own jobs.");

        // Removes job from database
        _context.Jobs.Remove(job);
        await _context.SaveChangesAsync();

        return ServiceResult<bool>.Ok(true);
    }

    public async Task<ServiceResult<bool>> ToggleInterest(int jobId, int userId)
    {
        var job = await _context.Jobs.FindAsync(jobId);
        if (job == null)
            return ServiceResult<bool>.Fail("Job not found.");

        // Looks for existing interest record connecting this Job to the User
        var existing = await _context.JobInterests
            .FirstOrDefaultAsync(ji => ji.JobId == jobId && ji.UserId == userId);

        // Removes interest if already interested
        if (existing != null)
        {
            _context.JobInterests.Remove(existing);
            await _context.SaveChangesAsync();
            return ServiceResult<bool>.Ok(false); // false = interest removed
        }

        // Adds interest if not already interested
        _context.JobInterests.Add(new JobInterest
        {
            JobId = jobId,
            UserId = userId,
            InterestedAt = DateTime.UtcNow
        });

        await _context.SaveChangesAsync();
        return ServiceResult<bool>.Ok(true); // true = interest added
    }

    public async Task<ServiceResult<List<string>>> GetInterestedUsers(int jobId, int userId)
    {
        var job = await _context.Jobs.FindAsync(jobId);

        if (job == null)
            return ServiceResult<List<string>>.Fail("Job not found.");

        if (job.PostedById != userId)
            return ServiceResult<List<string>>.Fail("You can only view interest on your own jobs.");

        var usernames = await _context.JobInterests
            .Where(ji => ji.JobId == jobId)
            .Include(ji => ji.User)
            .Select(ji => ji.User.Username)
            .ToListAsync();

        return ServiceResult<List<string>>.Ok(usernames);
    }
}