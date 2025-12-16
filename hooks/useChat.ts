// src/hooks/useChat.ts
"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setMessagesForThread,
  setCurrentThread,
} from "@/store/slices/chatSlice";
import { fetchMessagesOfThread, sendMessageApi, Message } from "@/Services/chatServices";
import { signalRService } from "@/Services/signalRServices";
import { RootState } from "@/store/store";

const EMPTY_MESSAGES: Message[] = [];

export function useChat(threadId: number | null) {
  const dispatch = useDispatch();

  const messages =
    useSelector((state: RootState) => (threadId ? state.chat.messages[threadId] : undefined)) || EMPTY_MESSAGES;

  const connectionStatus = useSelector(
    (state: RootState) => state.chat.status
  );

  // load thread messages + start real-time connection
  useEffect(() => {
    if (!threadId) return;

    dispatch(setCurrentThread(threadId));

    fetchMessagesOfThread(threadId).then((msgs) => {
      dispatch(setMessagesForThread({ threadId, messages: msgs }));
    });

    signalRService.start(threadId);

    return () => {
      signalRService.stop();
    };
  }, [threadId, dispatch]);

  // send message
  const sendMessage = async (text: string) => {
    if (!threadId) return;
    await sendMessageApi(threadId, text);
  };

  return { messages, sendMessage, connectionStatus };
}
