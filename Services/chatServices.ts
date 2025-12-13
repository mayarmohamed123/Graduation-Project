// Services/chatApi.ts
import { apiRequest } from "./api";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

// Thread interface matching the API response
export interface Participant {
  userId: string;
  userName: string;
}

export interface Thread {
  id: number;
  title: string;
  participants: Participant[];
  lastMessage?: {
    text: string;
    sentAt: string;
  };
}

export interface Message {
  id: number;
  threadId: number;
  senderId: string;
  text: string;
  sentAt: string;
  read: boolean;
  thread?: string | null;
  sender?: string | null;
}

export async function fetchMyThreads(): Promise<Thread[]> {
  return apiRequest<Thread[]>(`${API_BASE}/chat/my-threads`, {
    next: { revalidate: 30 },
  });
}

export async function fetchMessagesOfThread(
  threadId: number
): Promise<Message[]> {
  return apiRequest<Message[]>(`${API_BASE}/chat/${threadId}/messages`, {
    next: { revalidate: 30 },
  });
}

export async function sendMessageApi(
  threadId: number,
  content: string
): Promise<Message> {
  return apiRequest<Message>(`${API_BASE}/chat/send`, {
    method: "POST",
    data: { ThreadId: threadId, text: content },
  });
}

export async function startConversationWithDoctor(
  doctorId: string
): Promise<Thread> {
  return apiRequest<Thread>(
    `${API_BASE}/chat/start-with-doctor?doctorId=${doctorId}`,
    {
      method: "POST",
    }
  );
}

export async function startConversationWithPharmacist(
  pharmacistId: string
): Promise<Thread> {
  return apiRequest<Thread>(
    `${API_BASE}/chat/start-with-pharmacist?pharmacistId=${pharmacistId}`,
    {
      method: "POST",
    }
  );
}
