// src/Services/signalRServices.ts
"use client";

import * as signalR from "@microsoft/signalr";
import { messageReceived, setConnectionStatus } from "@/store/slices/chatSlice";

// dynamic import to avoid circular imports
const getStore = async () => {
  const { store } = await import("@/store/store");
  return store;
};

class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private currentThreadId: number | null = null;
  private isConnecting: boolean = false;

  async start(threadId: number) {
    console.log(`[SignalR] Starting connection for thread ${threadId}`);

    // 1. If currently connecting...
    if (this.isConnecting) {
      if (this.currentThreadId === threadId) {
        console.log(`[SignalR] Already connecting to thread ${threadId}`);
        return;
      }
      console.log(`[SignalR] Thread changed. Cancelling old attempt.`);
      await this.stop();
    }

    // 2. If already connected to the same thread, do nothing.
    if (
      this.connection &&
      this.connection.state === signalR.HubConnectionState.Connected &&
      this.currentThreadId === threadId
    ) {
      console.log(`[SignalR] Already connected to thread ${threadId}`);
      return;
    }

    // 3. If connected to a DIFFERENT thread, stop first.
    if (this.connection) {
      console.log(`[SignalR] Stopping existing connection`);
      await this.stop();
    }

    this.currentThreadId = threadId;
    this.isConnecting = true;

    try {
      const hubUrl = `${process.env.NEXT_PUBLIC_HUB_URL}/chat?threadId=${threadId}`;
      console.log(`[SignalR] Connecting to URL: ${hubUrl}`);

      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl, {
          withCredentials: true, // Use cookies
          // skipNegotiation: true,
          // transport: signalR.HttpTransportType.WebSockets,
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        })
        .withAutomaticReconnect()
        .build();

      // Receive real-time message
      this.connection.on(
        "ReceiveMessage",
        async (senderId: string, message: string, timestamp: string) => {
          const reduxStore = await getStore();
          reduxStore.dispatch(
            messageReceived({
              senderId,
              text: message,
              sentAt: timestamp,
              threadId,
            })
          );
        }
      );

      this.connection.onreconnecting(async () => {
        (await getStore()).dispatch(setConnectionStatus("reconnecting"));
      });

      this.connection.onreconnected(async () => {
        (await getStore()).dispatch(setConnectionStatus("connected"));
      });

      this.connection.onclose(async () => {
        (await getStore()).dispatch(setConnectionStatus("disconnected"));
      });

      await this.connection.start();
      const store = await getStore();
      store.dispatch(setConnectionStatus("connected"));
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);

      // These are expected errors if the connection is stopped while it's still starting
      if (
        errorMessage.includes(
          "Failed to start the HttpConnection before stop() was called"
        ) ||
        errorMessage.includes("The connection was stopped during negotiation")
      ) {
        console.log(`[SignalR] Connection cancelled/stopped during start`);
        const store = await getStore();
        store.dispatch(setConnectionStatus("disconnected"));
        return;
      }

      console.error("SignalR Connection Error:", err);
      const store = await getStore();
      store.dispatch(setConnectionStatus("error"));
    } finally {
      this.isConnecting = false;
    }
  }

  async stop() {
    if (this.connection) {
      try {
        await this.connection.stop();
      } catch (err) {
        console.error("Error stopping SignalR connection:", err);
      } finally {
        this.connection = null;
        this.currentThreadId = null;
        this.isConnecting = false;
      }
    }
  }
}

export const signalRService = new SignalRService();
