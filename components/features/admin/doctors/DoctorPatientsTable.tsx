"use client";

import { DoctorPatient } from "@/types/admin";
import { DoctorPatientRow } from "./DoctorPatientRow";
import { Users } from "lucide-react";

interface DoctorPatientsTableProps {
    patients: DoctorPatient[];
}

export function DoctorPatientsTable({ patients }: DoctorPatientsTableProps) {
    if (patients.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="w-16 h-16 bg-blue-50 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">No patients found</h3>
                <p className="text-gray-500 max-w-sm mx-auto">This doctor hasn&apos;t had any patients yet.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Patient Name</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Contact</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Appointment & Clinic</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status & Payment</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">ID</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {patients.map((patient) => (
                            <DoctorPatientRow key={patient.appointmentId} patient={patient} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
