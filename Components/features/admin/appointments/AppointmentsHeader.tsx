"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function AppointmentsHeader() {
    const router = useRouter();

    return (
        <div className="flex items-center gap-4">
            <button
                onClick={() => router.back()}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
                <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Doctor Appointments</h1>
        </div>
    );
}
