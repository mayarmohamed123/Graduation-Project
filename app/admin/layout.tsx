"use client";

import React from "react";
import DashboardSidebar from "@/Components/layout/DashboardSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex bg-gray-50">
            <DashboardSidebar role="admin" />
            <div className="flex-1 flex flex-col min-h-screen">
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
