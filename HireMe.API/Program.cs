using Microsoft.EntityFrameworkCore;
using HireMe.API.Data;

var builder = WebApplication.CreateBuilder(args);

// Registers DbContext to connect to MySQL database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))
    ));

var app = builder.Build();
app.MapGet("/", () => "Hello World!");

app.Run();
