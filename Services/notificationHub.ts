"use client";

import * as signalR from "@microsoft/signalr";

let connection: signalR.HubConnection | null = null;

/**
 * Creates or returns existing SignalR connection for notifications
 * @returns SignalR HubConnection instance
 */
export function createNotificationConnection(): signalR.HubConnection {
  if (connection) return connection;

  connection = new signalR.HubConnectionBuilder()
    .withUrl(`${process.env.NEXT_PUBLIC_HUB_URL}/hubs/notification`, {
      withCredentials: true, // Use cookies
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets,
    })
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
