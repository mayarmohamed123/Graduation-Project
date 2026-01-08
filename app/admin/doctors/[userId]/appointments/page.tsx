"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { DoctorAppointment } from "@/types/appointments";
import { DoctorInfoCard } from "@/Components/features/admin/appointments/DoctorInfoCard";
import { AppointmentsTable } from "@/Components/features/admin/appointments/AppointmentsTable";
import { AppointmentsHeader } from "@/Components/features/admin/appointments/AppointmentsHeader";
import LoadingSpinner from "@/Components/common/LoadingSpinner";
import { toast } from "react-hot-toast";

export default function DoctorAppointmentsPage() {
    const params = useParams();
    const router = useRouter();
    const userId = params?.userId as string;

    const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [processingId, setProcessingId] = useState<number | null>(null);

    const fetchAppointments = useCallback(async () => {
        if (!userId) return;

        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://sehhaapi.runasp.net/api";
            const response = await fetch(`${baseUrl}/Admin/doctorappointments/${userId}`);

            if (!response.ok) {
                throw new Error("there is no appointments for this doctor");
            }

            const data = await response.json();
            setAppointments(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        }
    }, [userId]);

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    const handleStatusUpdate = async (action: 'approve' | 'reject' | 'complete', appointmentId: number) => {
        setProcessingId(appointmentId);
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://sehhaapi.runasp.net/api";

        try {
            let url = "";
            let method = "PUT";

            switch (action) {
                case 'approve':
                    url = `${baseUrl}/Admin/approveappointment/${appointmentId}/${userId}`;
                    method = "PUT";
                    break;
                case 'reject':
                    url = `${baseUrl}/Admin/rejectappointment/${appointmentId}`;
                    method = "PUT";
                    break;
                case 'complete':
                    url = `${baseUrl}/Admin/completeappointment/${appointmentId}`;
                    method = "PATCH";
                    break;
            }

            const response = await fetch(url, { method });

            if (!response.ok) {
                throw new Error(`Failed to ${action} appointment`);
            }

            toast.success(`Appointment ${action}d successfully`);
            await fetchAppointments();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : `Failed to ${action} appointment`);
        } finally {
            setProcessingId(null);
        }
    };

    const doctorInfo = appointments.length > 0 ? appointments[0] : null;

    return (
        <div className="space-y-6">
            <AppointmentsHeader />
            <Suspense fallback={<LoadingSpinner />}>
                <>
                    <DoctorInfoCard doctorInfo={doctorInfo} totalAppointments={appointments.length} />
                    <AppointmentsTable
                        appointments={appointments}
                        onAction={handleStatusUpdate}
                        processingId={processingId}
                    />
                </>
            </Suspense>
        </div>
    );
}
