import { MapPin, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { BloodRequestWithPriority, PriorityLevel } from "@/types/blood";
import { cn } from "@/lib/utils";
import { formatBloodType } from "@/lib/bloodUtils";

interface BloodRequestCardProps {
    request: BloodRequestWithPriority;
    onDonate?: (request: BloodRequestWithPriority) => void;
}

const priorityConfig: Record<PriorityLevel, { color: string; bg: string; text: string; label: string }> = {
    Urgent: {
        color: "#FF0000",
        bg: "bg-red-50",
        text: "text-red-600",
        label: "Urgent Need"
    },
    High: {
        color: "#F59E0B",
        bg: "bg-amber-50",
        text: "text-amber-600",
        label: "High Priority"
    },
    Regular: {
        color: "#10B981",
        bg: "bg-emerald-50",
        text: "text-emerald-600",
        label: "Regular Need"
    }
};


export default function BloodRequestCard({ request, onDonate }: BloodRequestCardProps) {
    const config = priorityConfig[request.priority];

    const openGoogleMaps = () => {
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${request.latitude},${request.longitude}`, '_blank');
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-md transition-shadow">
            <div className="space-y-3 flex-1">
                <h3 className="text-xl font-bold text-[#2BBBC5]">{request.hospitalName}</h3>

                <div className="flex flex-col gap-1">
                    <p className="text-lg font-semibold text-gray-800">
                        Blood Type: <span className="text-primary">{formatBloodType(request.requiredType)}</span>
                    </p>
                    <p className={cn("font-medium", config.text)}>
                        {config.label}: {request.needWithin}
                    </p>
                </div>

                <div className="space-y-2">
                    <button
                        onClick={openGoogleMaps}
                        className="flex items-center gap-2 text-gray-500 hover:text-[#2BBBC5] transition-colors group"
                        title="View on Google Maps"
                    >
                        <MapPin size={18} className="text-[#2BBBC5] group-hover:scale-110 transition-transform" />
                        <span className="flex items-center gap-1.5 underline-offset-4 group-hover:underline">
                            Location: {request.city}, {request.country}
                            <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </span>
                    </button>
                    <div className="flex items-center gap-2 text-gray-500">
                        <Clock size={18} className="text-[#2BBBC5]" />
                        <span>10:30 AM - 5:00 PM (Mon-Sat)</span>
                    </div>
                </div>
            </div>

            <div className="w-full md:w-auto">
                <Button
                    onClick={() => onDonate?.(request)}
                    className={cn(
                        "w-full md:w-32 h-12 rounded-full font-bold text-white shadow-lg transition-transform active:scale-95",
                        request.priority === "Urgent" ? "bg-red-600 hover:bg-red-700" :
                            request.priority === "High" ? "bg-amber-500 hover:bg-amber-600" :
                                "bg-emerald-500 hover:bg-emerald-600"
                    )}
                >
                    Donate Now
                </Button>
            </div>
        </div>
    );
}
