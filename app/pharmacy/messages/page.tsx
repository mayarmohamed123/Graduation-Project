"use client";

import Chat from "@/Components/features/chat/Chat";
import { Suspense } from "react";
import { Button } from "@/Components/ui/button";
import { MessageSquarePlus } from "lucide-react";
import { startConversationWithAdmin } from "@/Services/chatServices";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-hot-toast";

export default function MessagesPage() {
  const router = useRouter();
  const pathname = usePathname();

  const handleContactAdmin = async () => {
    try {
      const thread = await startConversationWithAdmin();
      router.push(`${pathname}?threadId=${thread.id}`);
    } catch (error) {
      console.error("Failed to start chat with admin:", error);
      toast.error("Failed to start chat with admin");
    }
  };

  return (
    <Suspense fallback={null}>
      <div className="flex flex-col h-[calc(100vh-4rem)] bg-gray-50">
        <div className="flex-shrink-0 px-4 md:px-6 pt-6 pb-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
            <Button onClick={handleContactAdmin} className="gap-2">
              <MessageSquarePlus className="w-4 h-4" />
              Contact Admin
            </Button>
          </div>
        </div>
        <div className="flex-1 min-h-0 px-4 md:px-6 pb-6">
          <div className="max-w-7xl mx-auto h-full">
            <Chat basePath="/pharmacy/messages" />
          </div>
        </div>
      </div>
    </Suspense>
  );
}
