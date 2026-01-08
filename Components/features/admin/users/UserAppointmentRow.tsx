"use client";

import Image from "next/image";
import { User, Calendar, Clock, MapPin, Stethoscope } from "lucide-react";
import { DoctorAppointment } from "@/types/appointments";

interface UserAppointmentRowProps {
    appointment: DoctorAppointment;
}

export function UserAppointmentRow({ appointment }: UserAppointmentRowProps) {
    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
            }),
            time: date.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
            }),
        };
    };

    const dateTime = formatDateTime(appointment.startAt);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "confirmed":
                return "bg-green-100 text-green-800";
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "completed":
                return "bg-blue-100 text-blue-800";
            case "cancelled":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <tr className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                        {appointment.doctorImage ? (
                            <Image
                                src={appointment.doctorImage}
                                alt={appointment.doctorName}
                                fill
                                sizes="48px"
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <User className="w-6 h-6" />
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="font-bold text-gray-900 line-clamp-1">{appointment.doctorName}</div>
                        <div className="flex items-center gap-1.5 text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-md mt-1 w-fit">
                            <Stethoscope className="w-3 h-3" />
                            <span>{appointment.doctorSpeciality}</span>
                        </div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{dateTime.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{dateTime.time}</span>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="line-clamp-1">{appointment.clinicName}</span>
                    </div>
                    <div className="text-xs text-gray-400 font-medium ml-6">
                        EGP {appointment.appointmentAmount ? appointment.appointmentAmount.toFixed(2) : "0.00"}
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="space-y-2">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Patient Info</div>
                    <div className="text-sm font-bold text-gray-900">{appointment.patientName}</div>
                    <div className="text-xs text-gray-500">{appointment.patientAge} years • {appointment.patientGender}</div>
                </div>
            </td>
            <td className="px-6 py-4 text-right">
                <span className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize inline-block ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                </span>
            </td>
        </tr>
    );
}
