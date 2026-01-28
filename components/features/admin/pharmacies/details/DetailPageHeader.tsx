"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

interface DetailPageHeaderProps {
    pharmacyName: string;
    isApproved: boolean;
    isReject: boolean;
}

export function DetailPageHeader({ pharmacyName, isApproved, isReject }: DetailPageHeaderProps) {
    const router = useRouter();

    return (
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Pharmacy Details</h1>
                <p className="text-sm text-gray-500">View information and inventory for {pharmacyName}</p>
            </div>
            <div className="ml-auto flex gap-2">
                <Badge variant="outline" className={`px-3 py-1 ${
                    isApproved ? "bg-green-50 text-green-700 border-green-200" :
                    isReject ? "bg-red-50 text-red-700 border-red-200" :
                    "bg-yellow-50 text-yellow-700 border-yellow-200"
                }`}>
                    {isApproved ? "Approved" : isReject ? "Rejected" : "Pending"}
                </Badge>
            </div>
        </div>
    );
}
