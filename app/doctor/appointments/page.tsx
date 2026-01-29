import { appointmentService } from "@/Services/appointmentServices";
import DoctorAppointmentsClient from "./DoctorAppointmentsClient";
import { AppointmentInfo, AppointmentStats } from "@/types/appointments";

export const dynamic = "force-dynamic";

export default async function AppointmentsPage() {
    let stats: AppointmentStats | null = null;
    let appointments: AppointmentInfo[] = [];

    try {
        const [statsData, appointmentsData] = await Promise.all([
            appointmentService.getAppointmentStats(),
            appointmentService.getDoctorAppointments(),
        ]);
        stats = statsData;
        appointments = appointmentsData;
    } catch (error) {
        console.error("Error fetching doctor appointments data:", error);
    }

    return (
        <DoctorAppointmentsClient
            initialData={{
                stats,
                appointments,
            }}
        />
    );
}
