using HireMe.API.DTOs;

namespace HireMe.API.Services;

public interface IJobService
{
    Task<PagedResponse<JobResponse>> GetJobs(int page, int pageSize, string? search, int? currentUserId);
    Task<ServiceResult<JobResponse>> GetJob(int id, int? currentUserId);
    Task<ServiceResult<JobResponse>> CreateJob(CreateJobRequest request, int userId);
    Task<ServiceResult<JobResponse>> UpdateJob(int id, UpdateJobRequest request, int userId);
    Task<ServiceResult<bool>> DeleteJob(int id, int userId);
    Task<ServiceResult<bool>> ToggleInterest(int jobId, int userId);
    Task<ServiceResult<List<string>>> GetInterestedUsers(int jobId, int userId);
}