// src/hooks/useChat.ts
"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setMessagesForThread,
  setCurrentThread,
} from "@/store/slices/chatSlice";
import { fetchMessagesOfThread, sendMessageApi } from "@/Services/chatServices";
import { signalRService } from "@/Services/signalRServices";
import { RootState } from "@/store/store";

export function useChat(threadId: number) {
  const dispatch = useDispatch();

  const messages =
    useSelector((state: RootState) => state.chat.messages[threadId]) || [];

  const connectionStatus = useSelector(
    (state: RootState) => state.chat.status
  );

  // load thread messages + start real-time connection
  useEffect(() => {
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
    await sendMessageApi(threadId, text);
  };

  return { messages, sendMessage, connectionStatus };
}
