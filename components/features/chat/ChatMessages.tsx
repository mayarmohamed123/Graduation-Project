"use client"
import { Message, Participant } from "@/Services/chatServices";
import { useEffect, useRef } from "react";
import { format } from "date-fns";
import { Send, ArrowLeft } from "lucide-react";
import Image from "next/image";

interface ChatMessagesProps {
  messages: Message[];
  currentUserId: string;
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  connectionStatus: string;
  onBack?: () => void;
  participants?: Participant[];
}

export default function ChatMessages({
  messages,
  currentUserId,
  onSendMessage,
  isLoading,
  connectionStatus,
  onBack,
  participants = [],
}: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = inputRef.current;
    if (input && input.value.trim()) {
      onSendMessage(input.value);
      input.value = "";
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="shrink-0 p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <h3 className="font-semibold text-gray-900">Conversation</h3>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${connectionStatus === "connected"
              ? "bg-green-500"
              : connectionStatus === "connecting" || connectionStatus === "reconnecting"
                ? "bg-yellow-500"
                : "bg-red-500"
              }`}
          ></div>
          <span className="text-xs text-gray-500 capitalize">{connectionStatus}</span>
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 min-h-0 overflow-y-scroll p-4 space-y-4 chat-scroll"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#D1D5DB #F3F4F6'
        }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <>
            {messages.map((message) => {
              const isCurrentUser = message.senderId === currentUserId;
              const sender = participants.find(p => p.userId === message.senderId);

              return (
                <div
                  key={message.id}
                  className={`flex gap-2 ${isCurrentUser ? "justify-end" : "justify-start"}`}
                >
                  {/* Avatar for other user */}
                  {!isCurrentUser && (
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary/20 to-primary/40 flex items-center justify-center shrink-0 overflow-hidden">
                      {sender?.profileImage ? (
                        <Image
                          src={sender.profileImage}
                          alt={sender.userName}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-primary font-bold text-xs">
                          {(sender?.userName || "U").substring(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                  )}

                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 ${isCurrentUser
                      ? "bg-primary text-white rounded-br-sm"
                      : "bg-gray-100 text-gray-900 rounded-bl-sm"
                      }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p
                      className={`text-xs mt-1 ${isCurrentUser ? "text-white/70" : "text-gray-500"
                        }`}
                    >
                      {format(new Date(message.sentAt), "h:mm a")}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="shrink-0 p-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            disabled={connectionStatus === "connecting" || connectionStatus === "reconnecting"}
          />
          <button
            type="submit"
            disabled={connectionStatus === "connecting" || connectionStatus === "reconnecting"}
            className="p-3 bg-primary text-white rounded-full hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
