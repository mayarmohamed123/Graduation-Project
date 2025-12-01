"use client";

import { Chat } from "@/Components";

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Chat</h1>
        <Chat />
      </div>
    </div>
  );
}
