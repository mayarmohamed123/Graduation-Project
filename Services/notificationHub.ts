"use client";

import * as signalR from "@microsoft/signalr";

let connection: signalR.HubConnection | null = null;

/**
 * Creates or returns existing SignalR connection for notifications
 * @returns SignalR HubConnection instance
 */
export function createNotificationConnection(): signalR.HubConnection {
  if (connection) return connection;

  // Use local path to go through Next.js proxy (same-origin = cookies work)
  // SignalR will negotiate via HTTP, then fall back to Long Polling
  connection = new signalR.HubConnectionBuilder()
    .withUrl("/hubs/notification", {
      withCredentials: true,
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
