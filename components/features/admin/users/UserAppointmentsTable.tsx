"use client";

import { DoctorAppointment } from "@/types/appointments";
import { UserAppointmentRow } from "./UserAppointmentRow";
import { Calendar } from "lucide-react";

interface UserAppointmentsTableProps {
    appointments: DoctorAppointment[];
}

export function UserAppointmentsTable({ appointments }: UserAppointmentsTableProps) {
    if (appointments.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="w-16 h-16 bg-purple-50 text-purple-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">No bookings found</h3>
                <p className="text-gray-500 max-w-sm mx-auto">This user hasn&apos;t booked any medical appointments yet.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Doctor & Specialty</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Appointment Time</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Clinic & Cost</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Patient Details</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {appointments.map((appointment) => (
                            <UserAppointmentRow key={appointment.id} appointment={appointment} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
