"use client";

import * as signalR from "@microsoft/signalr";

let connection: signalR.HubConnection | null = null;

/**
 * Creates or returns existing SignalR connection for notifications
 * @param token - JWT access token for authentication
 * @returns SignalR HubConnection instance
 */
export function createNotificationConnection(token: string): signalR.HubConnection {
  if (connection) return connection;

  connection = new signalR.HubConnectionBuilder()
    .withUrl(
      "https://e-healthhub-dfcjb0cuazc3crfj.australiaeast-01.azurewebsites.net/hubs/notification",
      {
        accessTokenFactory: () => token,
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      }
    )
    .withAutomaticReconnect()
    .build();

  return connection;
}

/**
 * Stops and destroys the notification connection
 */
export function destroyNotificationConnection(): void {
  if (connection) {
    connection.stop();
    connection = null;
  }
}

/**
 * Gets the current connection status
 */
export function getNotificationConnectionState(): signalR.HubConnectionState | null {
  return connection?.state ?? null;
}
