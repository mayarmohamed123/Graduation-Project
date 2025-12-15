// src/store/slices/chatSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Message } from "@/Services/chatServices";

interface ChatState {
  currentThreadId: number | null;
  messages: Record<number, Message[]>; // threadId → messages
  status: "idle" | "connecting" | "connected" | "reconnecting" | "disconnected" | "error";
}

const initialState: ChatState = {
  currentThreadId: null,
  messages: {},
  status: "idle",
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setCurrentThread(state, action: PayloadAction<number>) {
      state.currentThreadId = action.payload;
    },

    setMessagesForThread(
      state,
      action: PayloadAction<{ threadId: number; messages: Message[] }>
    ) {
      state.messages[action.payload.threadId] = action.payload.messages;
    },

    messageReceived(
      state,
      action: PayloadAction<{
        senderId: string;
        text: string;
        sentAt: string;
        threadId: number;
      }>
    ) {
      const msg: Message = {
        id: Date.now(),
        senderId: action.payload.senderId,
        text: action.payload.text,
        sentAt: action.payload.sentAt,
        threadId: action.payload.threadId,
        read: false,
      };

      if (!state.messages[action.payload.threadId]) {
        state.messages[action.payload.threadId] = [];
      }
      state.messages[action.payload.threadId].push(msg);
    },

    setConnectionStatus(state, action: PayloadAction<ChatState["status"]>) {
      state.status = action.payload;
    },
  },
});

export const {
  setCurrentThread,
  setMessagesForThread,
  messageReceived,
  setConnectionStatus,
} = chatSlice.actions;

export default chatSlice.reducer;
