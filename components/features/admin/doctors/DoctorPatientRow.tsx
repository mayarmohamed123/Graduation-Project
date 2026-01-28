"use client";

import { CheckCircle2, XCircle, Calendar, Phone, User, Home } from "lucide-react";
import { DoctorPatient } from "@/types/admin";

interface DoctorPatientRowProps {
    patient: DoctorPatient;
}

export function DoctorPatientRow({ patient }: DoctorPatientRowProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "confirmed":
                return "bg-green-100 text-green-800";
            case "cancelled":
                return "bg-red-100 text-red-800";
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "completed":
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <tr className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                        <User className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="font-bold text-gray-900">{patient.patientName}</div>
                        <div className="text-xs text-gray-500 font-medium">{patient.patientAge} years • {patient.patientGender}</div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{patient.patientPhone}</span>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{formatDate(patient.startAt)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Home className="w-3.5 h-3.5 text-gray-300" />
                        <span>{patient.clinicName}</span>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="flex flex-col gap-1">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize w-fit ${getStatusColor(patient.status)}`}>
                        {patient.status}
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        {patient.isPaid ? (
                            <div className="flex items-center gap-1 text-[10px] font-bold text-green-600 uppercase tracking-tighter">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Paid</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1 text-[10px] font-bold text-red-500 uppercase tracking-tighter">
                                <XCircle className="w-3 h-3" />
                                <span>Unpaid</span>
                            </div>
                        )}
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 text-right">
                <span className="text-xs text-gray-400 font-mono">#{patient.appointmentId}</span>
            </td>
        </tr>
    );
}
