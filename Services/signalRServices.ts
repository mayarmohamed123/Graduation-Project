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

  async start(threadId: number) {
    const store = await getStore();

    if (this.connection && this.currentThreadId === threadId) return;

    if (this.connection) {
      await this.stop();
    }

    this.currentThreadId = threadId;

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(
        `${process.env.NEXT_PUBLIC_HUB_URL}/hubs/chat?threadId=${threadId}`,
        { withCredentials: false }
      )
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

    try {
      await this.connection.start();
      store.dispatch(setConnectionStatus("connected"));
    } catch (err) {
      store.dispatch(setConnectionStatus("error"));
    }
  }

  async stop() {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
      this.currentThreadId = null;
    }
  }
}

export const signalRService = new SignalRService();
