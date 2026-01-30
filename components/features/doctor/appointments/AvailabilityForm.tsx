"use client";

import { useState, useEffect } from "react";
import { CreateAvailabilityData, UpdateAvailabilityData, DoctorAvailability } from "@/types/doctors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Calendar, Clock, Plus, Save } from "lucide-react";

interface AvailabilityFormProps {
    onSubmit: (data: CreateAvailabilityData | UpdateAvailabilityData) => Promise<void>;
    onCancel: () => void;
    initialData?: DoctorAvailability | null;
    isSubmitting: boolean;
}

const days = [
    { value: 0, label: "Sunday" },
    { value: 1, label: "Monday" },
    { value: 2, label: "Tuesday" },
    { value: 3, label: "Wednesday" },
    { value: 4, label: "Thursday" },
    { value: 5, label: "Friday" },
    { value: 6, label: "Saturday" },
];

export function AvailabilityForm({ onSubmit, onCancel, initialData, isSubmitting }: AvailabilityFormProps) {
    const [dayOfWeek, setDayOfWeek] = useState<number>(0);
    const [startTime, setStartTime] = useState("10:00");
    const [endTime, setEndTime] = useState("13:00");

    useEffect(() => {
        if (initialData) {
            // Mapping string day to number if necessary, or just using number
            let dayNum = 0;
            if (typeof initialData.dayOfWeek === 'string') {
                const dayMap: Record<string, number> = {
                    "sunday": 0, "monday": 1, "tuesday": 2, "wednesday": 3, "thursday": 4, "friday": 5, "saturday": 6
                };
                dayNum = dayMap[initialData.dayOfWeek.toLowerCase()] ?? 0;
            } else {
                dayNum = initialData.dayOfWeek;
            }
            
            setDayOfWeek(dayNum);
            setStartTime(initialData.startTime.split(':').slice(0, 2).join(':'));
            setEndTime(initialData.endTime.split(':').slice(0, 2).join(':'));
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Format to HH:mm:ss.0000000 as requested by the API format example
        const formattedStart = `${startTime}:00.0000000`;
        const formattedEnd = `${endTime}:00.0000000`;

        await onSubmit({
            DayOfWeek: dayOfWeek,
            StartTime: formattedStart,
            EndTime: formattedEnd,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-4xl border border-gray-100 shadow-xl space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600">
                    {initialData ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
                <div>
                    <h3 className="text-xl font-bold font-outfit text-gray-900">
                        {initialData ? "Edit Availability" : "Add New Availability"}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">Define your consultation hours</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="day" className="text-xs font-bold uppercase tracking-wider text-gray-400">Day of Week</Label>
                    <div className="relative">
                        <select
                            id="day"
                            value={dayOfWeek}
                            onChange={(e) => setDayOfWeek(parseInt(e.target.value))}
                            className="w-full h-11 bg-gray-50 border-gray-100 rounded-2xl px-10 text-sm font-medium focus:ring-teal-500 focus:border-teal-500 appearance-none"
                        >
                            {days.map((day) => (
                                <option key={day.value} value={day.value}>{day.label}</option>
                            ))}
                        </select>
                        <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="startTime" className="text-xs font-bold uppercase tracking-wider text-gray-400">Start Time</Label>
                    <div className="relative">
                        <Input
                            id="startTime"
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="h-11 bg-gray-50 border-gray-100 rounded-2xl px-10 text-sm font-medium"
                            required
                        />
                        <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="endTime" className="text-xs font-bold uppercase tracking-wider text-gray-400">End Time</Label>
                    <div className="relative">
                        <Input
                            id="endTime"
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="h-11 bg-gray-50 border-gray-100 rounded-2xl px-10 text-sm font-medium"
                            required
                        />
                        <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-50">
                <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={onCancel}
                    className="rounded-2xl px-6 font-bold text-gray-500 hover:bg-gray-50"
                >
                    Cancel
                </Button>
                <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-teal-500 hover:bg-teal-600 text-white rounded-2xl px-8 font-bold shadow-lg shadow-teal-100 min-w-[140px]"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                        </>
                    ) : initialData ? "Update Slot" : "Add Availability"}
                </Button>
            </div>
        </form>
    );
}
