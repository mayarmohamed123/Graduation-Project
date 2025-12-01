"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Send, Paperclip, Image as ImageIcon, ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import { formatTime } from "@/lib/dateUtils";
import { useChat } from "@/hook/useChat";
import { useUser } from "@/hook/useUser";

export default function Chat() {
  const { 
    threads, 
    messages, 
    currentThread, 
    loading, 
    loadThreads, 
    selectThread, 
    sendMessage, 
    connect 
  } = useChat();
  
  const { user } = useUser();
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Connect to SignalR and load threads on mount
  useEffect(() => {
    connect();
    loadThreads();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle thread selection on mobile
  const handleThreadSelect = (threadId: number) => {
    selectThread(threadId);
    // Hide sidebar on mobile when a thread is selected
    if (window.innerWidth < 768) {
      setShowSidebar(false);
    }
  };

  // Handle back button on mobile
  const handleBackToThreads = () => {
    // We don't have a clearThread action exposed in useChat yet, 
    // but selecting null or just hiding sidebar works for UI.
    // Ideally we should deselect thread in Redux too if we want to clear messages.
    // For now just UI toggle.
    setShowSidebar(true);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentThread) return;

    try {
      await sendMessage(newMessage);
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

  // Helper to get other participant
  const getOtherParticipant = (participants: any[]) => {
    return participants.find(p => p.userId !== user?.id) || participants[0];
  };

  if (loading && threads.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-200px)] md:h-[calc(100vh-150px)] bg-white rounded-lg md:rounded-2xl shadow-sm overflow-hidden">
      {/* Left Sidebar - Thread List */}
      <div 
        className={`${
          showSidebar ? 'flex' : 'hidden'
        } md:flex w-full md:w-80 lg:w-96 border-r border-gray-200 flex-col ${
          currentThread && !showSidebar ? 'hidden' : ''
        }`}
      >
        {/* Search Bar */}
        <div className="p-3 md:p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 md:pl-10 pr-4 py-2 md:py-2.5 bg-gray-100 rounded-lg text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Thread List */}
        <div className="flex-1 overflow-y-auto">
          {filteredThreads.map((thread) => {
            const participant = getOtherParticipant(thread.participants);
            const lastMessageTime = thread.lastMessage?.sentAt;
            const isSelected = currentThread?.id === thread.id;
            
            return (
              <button
                key={thread.id}
                onClick={() => handleThreadSelect(thread.id)}
                className={`w-full p-3 md:p-4 flex items-start gap-2 md:gap-3 hover:bg-gray-50 transition ${
                  isSelected ? "bg-gray-100" : ""
                }`}
              >
                {/* Avatar */}
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-semibold text-base md:text-lg">
                    {participant?.userName.substring(0, 2).toUpperCase()}
                  </span>
                </div>

                {/* Thread Info */}
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-semibold text-sm md:text-base text-gray-900 truncate">
                      {participant?.userName}
                    </h3>
                    <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                      {lastMessageTime && formatTime(lastMessageTime)}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600 truncate">
                    {thread.lastMessage?.text}
                  </p>
                </div>

                {/* Unread indicator - if we had unread count */}
                {/* <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2"></div> */}
              </button>
            );
          })}

          {filteredThreads.length === 0 && (
            <div className="p-8 text-center text-gray-500 text-sm md:text-base">
              No conversations found
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Conversation View */}
      {currentThread ? (
        <div className={`${
          !showSidebar ? 'flex' : 'hidden'
        } md:flex flex-1 flex-col w-full`}>
          {/* Chat Header */}
          <div className="p-3 md:p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3">
              {/* Back button for mobile */}
              <button
                onClick={handleBackToThreads}
                className="md:hidden p-2 hover:bg-gray-100 rounded-full transition"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              
              {(() => {
                const otherParticipant = getOtherParticipant(currentThread.participants);
                return (
                  <>
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary font-semibold text-sm md:text-base">
                        {otherParticipant?.userName.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <h2 className="font-semibold text-sm md:text-base text-gray-900 truncate">
                      {otherParticipant?.userName}
                    </h2>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-3 md:space-y-4">
            {messages.map((message) => {
              const isOwnMessage = message.senderId === user?.id;
              
              return (
                <div
                  key={message.id}
                  className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-3 md:px-4 py-2 ${
                      isOwnMessage
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-900"
                    }`}
                  >
                    <p className="text-xs md:text-sm break-words">{message.text}</p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-3 md:p-4 border-t border-gray-200">
            <div className="flex items-center gap-2 md:gap-3">
              <input
                type="text"
                placeholder="Message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 px-3 md:px-4 py-2 md:py-3 bg-gray-100 rounded-full text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button className="hidden sm:block p-2 md:p-3 hover:bg-gray-100 rounded-full transition">
                <Paperclip className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
              </button>
              <button className="hidden sm:block p-2 md:p-3 hover:bg-gray-100 rounded-full transition">
                <ImageIcon className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
              </button>
              <button
                onClick={handleSendMessage}
                className="p-2 md:p-3 bg-primary text-white rounded-full hover:bg-primary/90 transition"
              >
                <Send className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center text-gray-500">
          <p className="text-sm md:text-base">Select a conversation to start chatting</p>
        </div>
      )}
    </div>
  );
}
