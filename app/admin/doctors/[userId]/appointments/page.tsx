"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { DoctorAppointment } from "@/types/appointments";
import { DoctorInfoCard } from "@/components/features/admin/appointments/DoctorInfoCard";
import { AppointmentsTable } from "@/components/features/admin/appointments/AppointmentsTable";
import { AppointmentsHeader } from "@/components/features/admin/appointments/AppointmentsHeader";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { adminService } from "@/Services/admin/adminService";
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
            const data = await adminService.getDoctorAppointments(userId);
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

        try {
            switch (action) {
                case 'approve':
                    await adminService.approveAppointment(appointmentId, userId);
                    break;
                case 'reject':
                    await adminService.rejectAppointment(appointmentId);
                    break;
                case 'complete':
                    await adminService.completeAppointment(appointmentId);
                    break;
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
