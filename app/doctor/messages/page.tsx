"use client";


import Chat from "@/components/features/chat/Chat";
import { Suspense } from "react";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component
import { MessageSquarePlus } from "lucide-react";
import { startConversationWithAdmin } from "@/Services/chatServices";
import { useRouter, usePathname } from "next/navigation"; // Changed context to navigation for app dir
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
            <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
                        <Button onClick={handleContactAdmin} className="gap-2">
                            <MessageSquarePlus className="w-4 h-4" />
                            Contact Admin
                        </Button>
                    </div>
                    <Chat basePath="/doctor/messages" />
                </div>
            </div>
        </Suspense>
    );
}