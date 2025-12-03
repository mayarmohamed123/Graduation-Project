// Services/chatApi.ts
import { fetchWithAuth } from './api';
import { authService } from './authService';

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

// Custom POST function without body (for starting conversations)
async function postWithAuthNoBody(url: string): Promise<any> {
  const token = authService.getToken();

  if (!token) {
    throw new Error("No authentication token found. Please log in again.");
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    authService.logout();
    throw new Error("Session expired. Please log in again.");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message || `API error: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

export async function fetchMyThreads(): Promise<Thread[]> {
  return fetchWithAuth(`${API_BASE}/chat/my-threads`);
}

export async function fetchMessagesOfThread(threadId: number): Promise<Message[]> {
  return fetchWithAuth(`${API_BASE}/chat/${threadId}/messages`);
}

export async function sendMessageApi(threadId: number, content: string): Promise<Message> {
  const token = authService.getToken();

  if (!token) {
    throw new Error("No authentication token found. Please log in again.");
  }

  const response = await fetch(`${API_BASE}/chat/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ThreadId: threadId, text: content }),
  });

  if (response.status === 401) {
    authService.logout();
    throw new Error("Session expired. Please log in again.");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message || `API error: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

export async function startConversationWithDoctor(doctorId: string): Promise<Thread> {
  return postWithAuthNoBody(`${API_BASE}/chat/start-with-doctor?doctorId=${doctorId}`);
}

export async function startConversationWithPharmacist(pharmacistId: string): Promise<Thread> {
  return postWithAuthNoBody(`${API_BASE}/chat/start-with-pharmacist?pharmacistId=${pharmacistId}`);
}
