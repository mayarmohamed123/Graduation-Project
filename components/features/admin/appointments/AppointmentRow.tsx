"use client";

import Image from "next/image";
import { Calendar, Clock, User, Phone, DollarSign, Check, X, CheckCircle } from "lucide-react";
import { DoctorAppointment } from "@/types/appointments";

interface AppointmentRowProps {
    appointment: DoctorAppointment;
    onAction?: (action: 'approve' | 'reject' | 'complete', appointmentId: number) => void;
    isProcessing?: boolean;
}

export function AppointmentRow({ appointment, onAction, isProcessing }: AppointmentRowProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "completed":
                return "bg-green-100 text-green-800";
            case "confirmed":
                return "bg-blue-100 text-blue-800";
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "cancelled":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const currentStatus = appointment.status.toLowerCase();

    return (
        <tr className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{appointment.patientName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        <span>{appointment.patientPhone}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                        {appointment.patientAge} years • {appointment.patientGender}
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="relative h-8 w-8 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                        {appointment.userImageLogged ? (
                            <Image
                                src={appointment.userImageLogged}
                                alt={appointment.userNameLogged}
                                fill
                                sizes="32px"
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <span className="text-xs uppercase">{appointment.userNameLogged.substring(0, 2)}</span>
                            </div>
                        )}
                    </div>
                    <span className="text-sm text-gray-700">{appointment.userNameLogged}</span>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-900">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{formatDate(appointment.startAt)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{formatTime(appointment.startAt)} - {formatTime(appointment.endAt)}</span>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-1 text-sm font-semibold text-gray-900">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span>{appointment.appointmentAmount.toFixed(2)}</span>
                </div>
            </td>
            <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                </span>
            </td>
            <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                    {currentStatus === 'pending' && (
                        <>
                            <button
                                onClick={() => onAction?.('approve', appointment.id)}
                                disabled={isProcessing}
                                className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors disabled:opacity-50"
                                title="Approve Appointment"
                            >
                                <Check className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => onAction?.('reject', appointment.id)}
                                disabled={isProcessing}
                                className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                                title="Reject Appointment"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </>
                    )}
                    {currentStatus === 'confirmed' && (
                        <>
                            <button
                                onClick={() => onAction?.('complete', appointment.id)}
                                disabled={isProcessing}
                                className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-50"
                                title="Complete Appointment"
                            >
                                <CheckCircle className="w-4 h-4" />
                            </button>
                        </>
                    )}
                </div>
            </td>
        </tr>
    );
}
