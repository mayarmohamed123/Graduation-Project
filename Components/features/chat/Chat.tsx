"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchMyThreads, Thread } from "@/Services/chatServices";
import { useChat } from "@/hooks/useChat";
import { toast } from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import ChatThreadList from "./ChatThreadList";
import ChatMessages from "./ChatMessages";

interface ChatProps {
  basePath?: string;
}

export default function Chat({ basePath = "/user/chat" }: ChatProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<number | null>(null);
  const [isLoadingThreads, setIsLoadingThreads] = useState(true);

  const { messages, sendMessage, connectionStatus } = useChat(selectedThreadId || 0);

  // Load threads on mount
  useEffect(() => {
    const loadThreads = async () => {
      try {
        const data = await fetchMyThreads();
        setThreads(data);
        
        // Check if there's a threadId in URL params
        const urlThreadId = searchParams.get("threadId");
        if (urlThreadId) {
          const threadId = parseInt(urlThreadId, 10);
          if (data.some((t) => t.id === threadId)) {
            setSelectedThreadId(threadId);
          }
        } else if (data.length > 0) {
          // Auto-select first thread if no URL param
          setSelectedThreadId(data[0].id);
        }
      } catch (error) {
        console.error("Failed to load threads:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to load conversations"
        );
      } finally {
        setIsLoadingThreads(false);
      }
    };

    loadThreads();
  }, [searchParams]);

  const handleSelectThread = (threadId: number) => {
    setSelectedThreadId(threadId);
    // Update URL without navigation
    router.push(`${basePath}?threadId=${threadId}`, { scroll: false });
  };

  const handleSendMessage = async (text: string) => {
    if (!selectedThreadId) return;
    try {
      await sendMessage(text);
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to send message"
      );
    }
  };

  const currentUserId = user?.id || user?.email || "";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
      {/* Thread List - Left Sidebar */}
      <div className="md:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <ChatThreadList
          threads={threads}
          selectedThreadId={selectedThreadId}
          onSelectThread={handleSelectThread}
          isLoading={isLoadingThreads}
          currentUserId={currentUserId}
        />
      </div>

      {/* Messages - Right Side */}
      <div className="md:col-span-2">
        {selectedThreadId ? (
          <ChatMessages
            messages={messages}
            currentUserId={currentUserId}
            onSendMessage={handleSendMessage}
            isLoading={false}
            connectionStatus={connectionStatus}
          />
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
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
              <p className="text-gray-600 font-medium">Select a conversation</p>
              <p className="text-gray-500 text-sm mt-2">
                Choose a conversation from the list to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
