export const dynamic = "force-dynamic";

import { appointmentService } from "@/Services/appointmentServices";
import { doctorService } from "@/Services/doctorService";
import { authService } from "@/Services/authService";
import { AppointmentInfo, AppointmentStats } from "@/types/appointments";
import { Notification, User } from "@/types";
import DoctorDashboardClient from "./DoctorDashboardClient";

export default async function DoctorDashboardPage() {
  let stats: AppointmentStats | null = null;
  let appointments: AppointmentInfo[] = [];
  let notifications: Notification[] = [];
  let user: User | null = null;

  try {
    const [statsData, appointmentsData, notificationsData, userData] = await Promise.all([
      appointmentService.getAppointmentStats(),
      appointmentService.getDoctorAppointments(),
      doctorService.getDoctorNotifications(),
      authService.getProfile(),
    ]);

    stats = statsData;
    appointments = appointmentsData;
    notifications = notificationsData.appointmentRequests;
    user = userData;
  } catch (error) {
    console.error("Error fetching dashboard data on server:", error);
    // You might want to redirect or show an error state here
  }

  return (
    <DoctorDashboardClient 
      initialData={{
        stats,
        appointments,
        notifications,
        user
      }} 
    />
  );
}
