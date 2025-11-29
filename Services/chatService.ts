// Services/chatService.ts
import { fetchWithAuth, postWithAuth } from "./api";
import type {
  StartConversationResponse,
  GetThreadsResponse,
  GetMessagesResponse,
  SendMessageRequest,
  SendMessageResponse,
} from "@/types/chat";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const HUB_URL = process.env.NEXT_PUBLIC_HUB_URL;

class ChatService {
  /**
   * Start a conversation with a doctor
   * @param doctorId - The ID of the doctor to start conversation with
   * @returns Promise with conversation details
   */
  async startConversationWithDoctor(
    doctorId: number
  ): Promise<StartConversationResponse> {
    return postWithAuth(
      `${API_BASE_URL}/chat/start-with-doctor?doctorId=${doctorId}`,
      {}
    );
  }

  /**
   * Start a conversation with a pharmacist
   * @param pharmacistId - The ID of the pharmacist to start conversation with
   * @returns Promise with conversation details
   */
  async startConversationWithPharmacist(
    pharmacistId: number
  ): Promise<StartConversationResponse> {
    return postWithAuth(
      `${API_BASE_URL}/chat/start-with-pharmacist?pharmacistId=${pharmacistId}`,
      {}
    );
  }

  /**
   * Send a message to a thread
   * @param threadId - The ID of the thread to send message to
   * @param text - The message text
   * @returns Promise with sent message details
   */
  async sendMessage(
    threadId: number,
    text: string
  ): Promise<SendMessageResponse> {
    const messageData: SendMessageRequest = {
      ThreadId: threadId,
      text: text,
    };
    return postWithAuth(`${API_BASE_URL}/chat/send`, messageData);
  }

  /**
   * Get the SignalR chat hub URL for a specific thread
   * @param threadId - The ID of the thread to connect to
   * @returns The full SignalR hub URL
   */
  getChatHubUrl(threadId: number): string {
    return `${HUB_URL}/hubs/chat?threadId=${threadId}`;
  }

  /**
   * Get all chat threads for the current user
   * @returns Promise with array of chat threads
   */
  async getMyThreads(): Promise<GetThreadsResponse> {
    return fetchWithAuth(`${API_BASE_URL}/chat/my-threads`);
  }

  /**
   * Get all messages for a specific thread
   * @param threadId - The ID of the thread to fetch messages for
   * @returns Promise with array of messages
   */
  async getThreadMessages(threadId: number): Promise<GetMessagesResponse> {
    return fetchWithAuth(`${API_BASE_URL}/chat/${threadId}/messages`);
  }
}

export const chatService = new ChatService();
