"use client";
import { Thread } from "@/Services/chatServices";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

interface ChatThreadListProps {
  threads: Thread[];
  selectedThreadId: number | null;
  onSelectThread: (threadId: number) => void;
  isLoading: boolean;
}

export default function ChatThreadList({
  threads,
  selectedThreadId,
  onSelectThread,
  isLoading,
}: ChatThreadListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (threads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-10 h-10 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <p className="text-gray-600 font-medium">No conversations yet</p>
        <p className="text-gray-500 text-sm mt-2">
          Start a conversation from your appointments
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Messages</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {threads.map((thread) => (
          <button
            key={thread.id}
            onClick={() => onSelectThread(thread.id)}
            className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition border-b border-gray-100 ${
              selectedThreadId === thread.id ? "bg-primary/5 border-l-4 border-l-primary" : ""
            }`}
          >
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center flex-shrink-0 overflow-hidden">
                <span className="text-primary font-bold text-sm">
                  {(thread.participants[1].userName || "U").substring(0, 2).toUpperCase()}
                </span>
            </div>

            {/* Content */}
            <div className="flex-1 text-left min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-gray-900 truncate">
                  {thread.participants[1].userName}
                </h3>
                {thread.lastMessage && (
                  <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                    {formatDistanceToNow(new Date(thread.lastMessage.sentAt), {
                      addSuffix: true,
                    })}
                  </span>
                )}
              </div>
              {thread.lastMessage && (
                <p className="text-sm text-gray-600 truncate">
                  {thread.lastMessage.text}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
