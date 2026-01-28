"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, Hospital, Droplet, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import dynamic from "next/dynamic";
import { bloodRequestService } from "@/Services/bloodRequestService";
import PageHeaderWithBack from "@/components/common/PageHeaderWithBack";
import toast from "react-hot-toast";

const LocationPickerMap = dynamic(() => import("@/components/features/donation/LocationPickerMap"), {
    ssr: false,
    loading: () => (
        <div className="h-[300px] w-full bg-gray-50 animate-pulse rounded-2xl flex items-center justify-center border border-gray-100 italic text-gray-400">
            Map is loading...
        </div>
    ),
});

const bloodTypes = [
    { id: 0, label: "A+" },
    { id: 1, label: "A-" },
    { id: 2, label: "B+" },
    { id: 3, label: "B-" },
    { id: 4, label: "AB+" },
    { id: 5, label: "AB-" },
    { id: 6, label: "O+" },
    { id: 7, label: "O-" },
];

export default function BloodRequestPage() {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [urgencyValue, setUrgencyValue] = useState(24);
    const [urgencyUnit, setUrgencyUnit] = useState<"hours" | "days">("hours");

    const [formData, setFormData] = useState({
        RequiredType: 0,
        HospitalName: "",
        HospitalCity: "",
        HospitalCountry: "Egypt",
        HospitalLatitude: 30.764,
        HospitalLongitude: 32.954,
        Units: 1,
        NeedWithin: "24 hours",
    });

    const calculatePriority = () => {
        const totalHours = urgencyUnit === "hours" ? urgencyValue : urgencyValue * 24;
        if (totalHours <= 24) return { label: "Urgent", color: "text-red-500", bg: "bg-red-50 border-red-200" };
        if (totalHours <= 72) return { label: "High", color: "text-amber-500", bg: "bg-amber-50 border-amber-200" };
        return { label: "Regular", color: "text-emerald-500", bg: "bg-emerald-50 border-emerald-200" };
    };

    const priority = calculatePriority();

    const handleLocationChange = (lat: number, lng: number) => {
        setFormData(prev => ({
            ...prev,
            HospitalLatitude: lat,
            HospitalLongitude: lng
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.HospitalName || !formData.HospitalCity) {
            toast.error("Please fill in all hospital details.");
            return;
        }

        const consolidatedFormData = {
            ...formData,
            NeedWithin: `${urgencyValue} ${urgencyUnit}`
        };

        setSubmitting(true);
        try {
            const response = await bloodRequestService.createBloodRequest(consolidatedFormData);
            toast.success(response.message || "Blood request created successfully!");
            router.push("/user/donation/drive"); // Redirect to the search page to see the new request
        } catch (error) {
            console.error("Failed to create request:", error);
            toast.error("Failed to create blood request. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 pb-10 space-y-8">
            <PageHeaderWithBack title="Request Blood Donation" />

            {/* Header Content */}
            <div className="space-y-2 px-1">
                <p className="text-gray-500">Every second counts. Fill in the details to reach nearby donors.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100 space-y-8">
                {/* Blood Type & Amount */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <Label className="flex items-center gap-2 text-primary font-bold">
                            <Droplet size={18} />
                            Required Blood Type
                        </Label>
                        <select
                            className="flex h-12 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={formData.RequiredType}
                            onChange={(e) => setFormData({ ...formData, RequiredType: Number(e.target.value) })}
                        >
                            {bloodTypes.map(type => (
                                <option key={type.id} value={type.id}>{type.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-3">
                        <Label className="flex items-center gap-2 text-primary font-bold">
                            <ClipboardList size={18} />
                            Urgency (Need Within)
                        </Label>
                        <div className="flex gap-2">
                            <Input
                                type="number"
                                min={1}
                                value={urgencyValue}
                                onChange={(e) => setUrgencyValue(Number(e.target.value))}
                                className="h-12 rounded-xl flex-1"
                            />
                            <select
                                className="flex h-12 w-32 rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                value={urgencyUnit}
                                onChange={(e) => setUrgencyUnit(e.target.value as "hours" | "days")}
                            >
                                <option value="hours">Hours</option>
                                <option value="days">Days</option>
                            </select>
                        </div>
                        <div className={`mt-2 p-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-between ${priority.bg}`}>
                            <span className="text-gray-500 uppercase tracking-wider">Calculated Priority:</span>
                            <span className={priority.color}>{priority.label}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <Label className="flex items-center gap-2 text-primary font-bold">
                            <Droplet size={18} />
                            Required Units
                        </Label>
                        <Input
                            type="number"
                            min={1}
                            value={formData.Units}
                            onChange={(e) => setFormData({ ...formData, Units: Number(e.target.value) })}
                            className="h-12 rounded-xl"
                        />
                    </div>
                </div>

                <hr className="border-gray-100" />

                {/* Hospital Details */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                        <Hospital size={20} />
                        Hospital Information
                    </h3>

                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-3">
                            <Label className="font-semibold">Hospital Name</Label>
                            <Input
                                value={formData.HospitalName}
                                onChange={(e) => setFormData({ ...formData, HospitalName: e.target.value })}
                                placeholder="Enter full hospital name"
                                className="h-12 rounded-xl"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <Label className="font-semibold text-gray-700">Hospital City</Label>
                            <Input
                                value={formData.HospitalCity}
                                onChange={(e) => setFormData({ ...formData, HospitalCity: e.target.value })}
                                placeholder="e.g., Shebin, Cairo"
                                className="h-12 rounded-xl"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="font-semibold text-gray-700">Hospital Country</Label>
                            <Input
                                value={formData.HospitalCountry}
                                onChange={(e) => setFormData({ ...formData, HospitalCountry: e.target.value })}
                                placeholder="e.g., Egypt"
                                className="h-12 rounded-xl"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Label className="font-semibold text-gray-700 flex items-center justify-between">
                            Hospital Location
                            <span className="text-[10px] text-primary/60 font-medium">Click on map to pick location</span>
                        </Label>
                        <LocationPickerMap
                            lat={formData.HospitalLatitude}
                            lng={formData.HospitalLongitude}
                            onChange={handleLocationChange}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 rounded-xl px-4 py-2 border border-gray-100">
                                <span className="text-[10px] text-gray-400 block">Latitude</span>
                                <span className="text-sm font-mono text-gray-600">{formData.HospitalLatitude.toFixed(6)}</span>
                            </div>
                            <div className="bg-gray-50 rounded-xl px-4 py-2 border border-gray-100">
                                <span className="text-[10px] text-gray-400 block">Longitude</span>
                                <span className="text-sm font-mono text-gray-600">{formData.HospitalLongitude.toFixed(6)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/95 text-white text-lg font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
                >
                    {submitting ? (
                        "Creating Request..."
                    ) : (
                        <div className="flex items-center gap-2">
                            <Send size={20} />
                            Post Blood Request
                        </div>
                    )}
                </Button>
            </form>
        </div>
    );
}
