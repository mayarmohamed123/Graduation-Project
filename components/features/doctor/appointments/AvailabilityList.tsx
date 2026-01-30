"use client";

import { DoctorAvailability } from "@/types/doctors";
import { Trash2, Edit2, Clock, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AvailabilityListProps {
    availabilities: DoctorAvailability[];
    onEdit: (availability: DoctorAvailability) => void;
    onDelete: (id: number) => void;
    isDeleting: number | null;
}

const dayNames = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
];

export function AvailabilityList({ availabilities, onEdit, onDelete, isDeleting }: AvailabilityListProps) {
    if (availabilities.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900">No availabilities set</h3>
                <p className="text-gray-500 max-w-xs mx-auto mt-1">
                    Add your working hours so patients can book appointments with you.
                </p>
            </div>
        );
    }

    // Group by day for better organization if needed, but for now just list them
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availabilities.map((slot) => (
                <div 
                    key={slot.id} 
                    className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-1 h-full bg-teal-500" />
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                            {typeof slot.dayOfWeek === 'number' ? dayNames[slot.dayOfWeek] : slot.dayOfWeek}
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-blue-600 hover:bg-blue-50 rounded-xl"
                                onClick={() => onEdit(slot)}
                            >
                                <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-red-600 hover:bg-red-50 rounded-xl"
                                onClick={() => onDelete(slot.id)}
                                disabled={isDeleting === slot.id}
                            >
                                <Trash2 className={`w-4 h-4 ${isDeleting === slot.id ? 'animate-pulse' : ''}`} />
                            </Button>
                        </div>
                    </div>
                    
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-gray-700">
                            <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                                <Clock className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase leading-none mb-1">Duration</p>
                                <p className="text-sm font-semibold">{slot.startTime.split(':').slice(0, 2).join(':')} - {slot.endTime.split(':').slice(0, 2).join(':')}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700">
                            <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                                <Clock className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase leading-none mb-1">Slot Type</p>
                                <p className="text-sm font-semibold">{slot.slotDurationInMinutes} Minutes Session</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
