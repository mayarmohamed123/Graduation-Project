"use client";


import Chat from "@/Components/features/chat/Chat";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function MessagesPage() {
    return (
        <Suspense fallback={null}>
            <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Messages</h1>
                    <Chat basePath="/doctor/messages" />
                </div>
            </div>
        </Suspense>
    );
}