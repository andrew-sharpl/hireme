using Microsoft.EntityFrameworkCore;
using HireMe.API.Models;

namespace HireMe.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    // Table creation
    public DbSet<User> Users { get; set; }
    public DbSet<Job> Jobs { get; set; }
    public DbSet<JobInterest> JobInterests { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User to Jobs is a one-to-many relationship.
        // If a User is deleted, so are their jobs.
        modelBuilder.Entity<Job>()
        .HasOne(j => j.PostedBy)
        .WithMany(u => u.Jobs)
        .HasForeignKey(j => j.PostedById)
        .OnDelete(DeleteBehavior.Cascade);

        // Job to JobInterest and User to JobInterest are one-to-many relationships.
        modelBuilder.Entity<JobInterest>()
        .HasOne(ji => ji.Job)
        .WithMany(j => j.JobInterests)
        .HasForeignKey(ji => ji.JobId)
        .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<JobInterest>()
        .HasOne(ji => ji.User)
        .WithMany(u => u.JobInterests)
        .HasForeignKey(ji => ji.UserId)
        .OnDelete(DeleteBehavior.Cascade);

        // Prevent a user from expressing interest in the same job twice.
        modelBuilder.Entity<JobInterest>()
        .HasIndex(ji => new { ji.JobId, ji.UserId })
        .IsUnique();

        // Auto-filter out jobs older than 2 months.
        modelBuilder.Entity<Job>()
        .HasQueryFilter(j => j.PostedAt > DateTime.UtcNow.AddMonths(-2));

        modelBuilder.Entity<JobInterest>()
        .HasQueryFilter(ji => ji.Job.PostedAt > DateTime.UtcNow.AddMonths(-2));
    }
}