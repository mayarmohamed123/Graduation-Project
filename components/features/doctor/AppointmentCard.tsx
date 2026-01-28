import React from 'react';
import { Calendar, Clock, User, Phone } from 'lucide-react';
import { AppointmentInfo } from '@/types/appointments';

interface AppointmentCardProps {
    appointment: AppointmentInfo;
    onAccept?: (appointmentId: string) => void;
    onReject?: (appointmentId: string) => void;
    onComplete?: (appointmentId: string) => void;
}

export default function AppointmentCard({
    appointment,
    onAccept,
    onReject,
    onComplete,
}: AppointmentCardProps) {
    // Format date and time
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Get status badge styling
    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-orange-100 text-orange-600 border-orange-200';
            case 'completed':
                return 'bg-teal-100 text-teal-600 border-teal-200';
            case 'cancelled':
                return 'bg-red-100 text-red-600 border-red-200';
            case 'confirmed':
                return 'bg-blue-100 text-blue-600 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    return (
        <div className="bg-white rounded-2xl border-2 border-gray-100 p-6 hover:border-primary/30 hover:shadow-lg transition-all duration-300">
            <div className="space-y-4">
                {/* Header: Patient Name & Status */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        {/* Patient Avatar */}
                        <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary to-primary/70 flex items-center justify-center shrink-0">
                            <User className="w-6 h-6 text-white" />
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg text-gray-900">
                                {appointment.patientName}
                            </h3>
                            <p className="text-sm text-gray-500">
                                {appointment.patientAge} years • {appointment.patientGender}
                            </p>
                        </div>
                    </div>

                    {/* Status Badge */}
                    <span
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusStyle(
                            appointment.status
                        )}`}
                    >
                        {appointment.status}
                    </span>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100"></div>

                {/* Appointment Details */}
                <div className="grid grid-cols-1 gap-3">
                    {/* Date & Time */}
                    <div className="flex items-center gap-2 text-gray-600">
                        <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
                            <Calendar className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium text-gray-900">
                                {formatDate(appointment.startAt)}
                            </span>
                            <span className="text-gray-400">•</span>
                            <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                    {formatTime(appointment.startAt)} - {formatTime(appointment.endAt)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Phone Number */}
                    <div className="flex items-center gap-2 text-gray-600">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                            <Phone className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                            {appointment.patientPhone}
                        </span>
                    </div>
                </div>

                {/* Action Buttons for Pending Appointments */}
                {appointment.status === 'pending' && (onAccept || onReject) && (
                    <>
                        {/* Divider */}
                        <div className="border-t border-gray-100"></div>

                        <div className="flex gap-3">
                            {onAccept && (
                                <button
                                    onClick={() => onAccept(appointment.id)}
                                    className="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-all duration-200 hover:shadow-md active:scale-95"
                                >
                                    Accept
                                </button>
                            )}
                            {onReject && (
                                <button
                                    onClick={() => onReject(appointment.id)}
                                    className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all duration-200 hover:shadow-md active:scale-95"
                                >
                                    Reject
                                </button>
                            )}
                        </div>
                    </>
                )}

                {/* Action Button for Confirmed Appointments */}
                {appointment.status === 'confirmed' && onComplete && (
                    <>
                        <div className="border-t border-gray-100"></div>
                        <button
                            onClick={() => onComplete(appointment.id)}
                            className="w-full px-4 py-2.5 bg-primary hover:bg-teal-700 text-white rounded-xl font-medium transition-all duration-200 hover:shadow-md active:scale-95"
                        >
                            Mark as Completed
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
