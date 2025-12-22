"use client";

import Chat from "@/Components/features/chat/Chat";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function ChatPage() {
  return (
    <Suspense fallback={null}>
      <div className="flex flex-col h-[calc(100vh-4rem)] bg-gray-50">
        <div className="flex-shrink-0 px-4 md:px-6 pt-6 pb-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900">Chat</h1>
          </div>
        </div>
        <div className="flex-1 min-h-0 px-4 md:px-6 pb-6">
          <div className="max-w-7xl mx-auto h-full">
            <Chat basePath="/user/chat" />
          </div>
        </div>
      </div>
    </Suspense>
  );
}
