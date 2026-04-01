import * as signalR from "@microsoft/signalr";

/* 
Builds a SignalR connection to the notification hub,
passing the JWT as a query parameter since WebSockets can't send headers.
*/
export function buildConnection(token: string): signalR.HubConnection {
  return new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5264/hubs/notifications", {
      accessTokenFactory: () => token,
    })
    .withAutomaticReconnect()
    .build();
}
