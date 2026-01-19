"use client";
import Chat from "@/Components/features/chat/Chat";
import { adminService } from "@/Services/admin/adminService";

export default function AdminMessagesPage() {
  return (
    <Chat
      basePath="/admin/messages"
      fetchThreadsFn={adminService.getAdminThreads}
      fetchMessagesFn={adminService.getThreadMessages}
      sendMessageFn={adminService.sendAdminMessage}
    />
  );
}
