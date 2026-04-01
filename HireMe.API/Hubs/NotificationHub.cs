using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace HireMe.API.Hubs;

[Authorize]
public class NotificationHub : Hub
{
    // When a User connects, add them to a group named after their userId,
    // allowing us to send notifications to a specific User.
    public override async Task OnConnectedAsync()
    {
        var userId = Context.UserIdentifier;
        if (userId != null)
            await Groups.AddToGroupAsync(Context.ConnectionId, userId);

        await base.OnConnectedAsync();
    }
}