"use client";

import Image from "next/image";
import { MapPin } from "lucide-react";
import { DoctorAppointment } from "@/types/appointments";

interface DoctorInfoCardProps {
    doctorInfo: DoctorAppointment | null;
    totalAppointments: number;
}

export function DoctorInfoCard({ doctorInfo, totalAppointments }: DoctorInfoCardProps) {
    if (!doctorInfo) return null;

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                    {doctorInfo.doctorImage ? (
                        <Image
                            src={doctorInfo.doctorImage}
                            alt={doctorInfo.doctorName}
                            fill
                            sizes="64px"
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <span className="text-xl uppercase">{doctorInfo.doctorName.substring(0, 2)}</span>
                        </div>
                    )}
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">{doctorInfo.doctorName}</h2>
                    <p className="text-sm text-gray-600">{doctorInfo.doctorSpeciality}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{doctorInfo.clinicName}</span>
                    </div>
                </div>
                <div className="ml-auto text-right">
                    <p className="text-sm text-gray-500">Total Appointments</p>
                    <p className="text-2xl font-bold text-primary">{totalAppointments}</p>
                </div>
            </div>
        </div>
    );
}
