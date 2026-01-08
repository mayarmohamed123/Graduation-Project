"use client";

import { DoctorAppointment } from "@/types/appointments";
import { AppointmentRow } from "./AppointmentRow";

interface AppointmentsTableProps {
    appointments: DoctorAppointment[];
    onAction?: (action: 'approve' | 'reject' | 'complete', appointmentId: number) => void;
    processingId?: number | null;
}

export function AppointmentsTable({ appointments, onAction, processingId }: AppointmentsTableProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {appointments.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                    No appointments found for this doctor.
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Patient Info
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Booked By
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Appointment Time
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {appointments.map((appointment) => (
                                <AppointmentRow
                                    key={appointment.id}
                                    appointment={appointment}
                                    onAction={onAction}
                                    isProcessing={processingId === appointment.id}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
