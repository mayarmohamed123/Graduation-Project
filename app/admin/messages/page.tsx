"use client";

import { Suspense } from "react";
import Chat from "@/components/features/chat/Chat";
import { adminService } from "@/Services/admin/adminService";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function AdminMessagesPage() {
  return (
    <Suspense fallback={
      <div className="flex h-[70vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    }>
      <Chat
        basePath="/admin/messages"
        fetchThreadsFn={adminService.getAdminThreads}
        fetchMessagesFn={adminService.getThreadMessages}
        sendMessageFn={adminService.sendAdminMessage}
      />
    </Suspense>
  );
}
