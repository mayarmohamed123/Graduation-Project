// src/hooks/useChat.ts
"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setMessagesForThread,
  setCurrentThread,
} from "@/store/slices/chatSlice";
import {
  fetchMessagesOfThread,
  sendMessageApi,
  Message,
} from "@/Services/chatServices";
import { signalRService } from "@/Services/signalRServices";
import { RootState } from "@/store/store";

const EMPTY_MESSAGES: Message[] = [];

export function useChat(
  threadId: number | null,
  customFetchMessages?: (id: number) => Promise<Message[]>,
  customSendMessage?: (id: number, text: string) => Promise<Message>
) {
  const dispatch = useDispatch();

  const messages =
    useSelector((state: RootState) =>
      threadId ? state.chat.messages[threadId] : undefined
    ) || EMPTY_MESSAGES;

  const connectionStatus = useSelector((state: RootState) => state.chat.status);

  // load thread messages + start real-time connection
  useEffect(() => {
    if (!threadId) return;

    dispatch(setCurrentThread(threadId));

    const fetchFn = customFetchMessages || fetchMessagesOfThread;
    fetchFn(threadId).then((msgs) => {
      dispatch(setMessagesForThread({ threadId, messages: msgs }));
    });

    signalRService.start(threadId);

    // Cleanup: stop is handled by signalRService.start() when switching threads
    // Only stop if component unmounts (threadId becomes null)
    return () => {
      // Don't stop here - let the next start() handle it
      // This prevents race conditions with React StrictMode
    };
  }, [threadId, dispatch, customFetchMessages]);

  // send message
  const sendMessage = async (text: string) => {
    if (!threadId) return;
    const sendFn = customSendMessage || sendMessageApi;
    await sendFn(threadId, text);
  };

  return { messages, sendMessage, connectionStatus };
}
