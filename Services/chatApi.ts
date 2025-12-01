// services/chatApi.ts
import { fetchWithAuth, postWithAuth } from "./api";
import type {
  StartConversationResponse,
  GetThreadsResponse,
  GetMessagesResponse,
  SendMessageRequest,
  SendMessageResponse,
  ChatThread,
  ChatMessage
} from "@/types/chat";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const chatApi = {
  // Start conversations
  startConversationWithPharmacist: async (pharmacistId: string | number): Promise<StartConversationResponse> => {
    return postWithAuth(
      `${API_BASE_URL}/chat/start-with-pharmacist?pharmacistId=${pharmacistId}`,
      {}
    );
  },

  startConversationWithDoctor: async (doctorId: string | number): Promise<StartConversationResponse> => {
    return postWithAuth(
      `${API_BASE_URL}/chat/start-with-doctor?doctorId=${doctorId}`,
      {}
    );
  },

  // Send message
  sendMessage: async (threadId: number, content: string): Promise<SendMessageResponse> => {
    const messageData: SendMessageRequest = {
      ThreadId: threadId,
      text: content,
    };
    return postWithAuth(`${API_BASE_URL}/chat/send`, messageData);
  },

  // Get messages
  getMessages: async (threadId: number): Promise<GetMessagesResponse> => {
    return fetchWithAuth(`${API_BASE_URL}/chat/${threadId}/messages`);
  },

  // Get threads
  getMyThreads: async (): Promise<GetThreadsResponse> => {
    return fetchWithAuth(`${API_BASE_URL}/chat/my-threads`);
  }
};