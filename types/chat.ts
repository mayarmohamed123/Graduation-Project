// Chat-related TypeScript types

/**
 * Chat thread participant
 */
export interface ChatParticipant {
  userId: string;
  userName: string;
}

/**
 * Last message in a thread
 */
export interface LastMessage {
  text: string;
  sentAt: string;
}

/**
 * Chat thread
 */
export interface ChatThread {
  id: number;
  title: string;
  participants: ChatParticipant[];
  lastMessage: LastMessage;
}

/**
 * Start conversation response
 */
export interface StartConversationResponse {
  id: number;
  title: string;
  participantIds: string[];
}

/**
 * Chat message
 */
export interface ChatMessage {
  id: number;
  threadId: number;
  senderId: string;
  text: string;
  sentAt: string;
  read: boolean;
  thread: null;
  sender: null;
}

/**
 * Send message request
 */
export interface SendMessageRequest {
  ThreadId: number;
  text: string;
}

/**
 * Send message response
 */
export interface SendMessageResponse {
  id: number;
  threadId: number;
  senderId: string;
  text: string;
  sentAt: string;
  read: boolean;
  thread: null;
  sender: null;
}

/**
 * Get threads response
 */
export type GetThreadsResponse = ChatThread[];

/**
 * Get messages response
 */
export type GetMessagesResponse = ChatMessage[];
