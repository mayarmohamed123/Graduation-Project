"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Send, Paperclip, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { chatService } from "@/Services/chatService";
import { toast } from "react-hot-toast";
import { formatDate, formatTime } from "@/lib/dateUtils";
import type { ChatThread, ChatMessage } from "@/types/chat";
import { profile2UserIcon } from "@/assets";

export default function Chat() {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch threads on mount
  useEffect(() => {
    const loadThreads = async () => {
      try {
        const data = await chatService.getMyThreads();
        setThreads(data);
      } catch (error) {
        toast.error("Failed to load chat threads");
      } finally {
        setIsLoading(false);
      }
    };
    loadThreads();
  }, []);

  // Load messages when thread is selected
  useEffect(() => {
    if (selectedThread) {
      const loadMessages = async () => {
        try {
          const data = await chatService.getThreadMessages(selectedThread);
          setMessages(data);
        } catch (error) {
          toast.error("Failed to load messages");
        }
      };
      loadMessages();
    }
  }, [selectedThread]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedThread) return;

    try {
      const sentMessage = await chatService.sendMessage(selectedThread, newMessage);
      setMessages([...messages, sentMessage]);
      setNewMessage("");
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  const filteredThreads = threads.filter((thread) =>
    thread.participants.some((p) =>
      p.userName.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const currentThread = threads.find((t) => t.id === selectedThread);
  const otherParticipant = currentThread?.participants.find((p) => p.userId !== "current-user");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-200px)] bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Left Sidebar - Thread List */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        {/* Search Bar */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Thread List */}
        <div className="flex-1 overflow-y-auto">
          {filteredThreads.map((thread) => {
            const participant = thread.participants[0]; // Get first non-current user
            const lastMessageTime = thread.lastMessage?.sentAt;
            
            return (
              <button
                key={thread.id}
                onClick={() => setSelectedThread(thread.id)}
                className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition ${
                  selectedThread === thread.id ? "bg-gray-100" : ""
                }`}
              >
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-semibold text-lg">
                    {participant?.userName.substring(0, 2).toUpperCase()}
                  </span>
                </div>

                {/* Thread Info */}
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {participant?.userName}
                    </h3>
                    <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                      {lastMessageTime && formatTime(lastMessageTime)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {thread.lastMessage?.text}
                  </p>
                </div>

                {/* Unread indicator */}
                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2"></div>
              </button>
            );
          })}

          {filteredThreads.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No conversations found
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Conversation View */}
      {selectedThread ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-semibold">
                  {otherParticipant?.userName.substring(0, 2).toUpperCase()}
                </span>
              </div>
              <h2 className="font-semibold text-gray-900">
                {otherParticipant?.userName}
              </h2>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => {
              const isOwnMessage = message.senderId === "current-user-id"; // Replace with actual user ID
              
              return (
                <div
                  key={message.id}
                  className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                      isOwnMessage
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-900"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 px-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button className="p-3 hover:bg-gray-100 rounded-full transition">
                <Paperclip className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-3 hover:bg-gray-100 rounded-full transition">
                <ImageIcon className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={handleSendMessage}
                className="p-3 bg-primary text-white rounded-full hover:bg-primary/90 transition"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <p>Select a conversation to start chatting</p>
        </div>
      )}
    </div>
  );
}
