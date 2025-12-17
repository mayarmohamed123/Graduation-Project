import { AppointmentInfo, AppointmentStats } from "@/types/appointments";
import { apiRequest } from "./api";

class AppointmentService {
  // Get Appointment Statistics
  async getAppointmentStats(): Promise<AppointmentStats> {
    return await apiRequest<AppointmentStats>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/doctors/stats`,
      {
        requiresAuth: true,
      }
    );
  }

  // Get All Appointments for Doctor
  async getDoctorAppointments(): Promise<AppointmentInfo[]> {
    return await apiRequest<AppointmentInfo[]>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/appointment/doctor`,
      {
        requiresAuth: true,
      }
    );
  }

  // Get Appointments by Status
  async getAppointmentsByStatus(status: string): Promise<AppointmentInfo[]> {
    return await apiRequest<AppointmentInfo[]>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/doctor/appointments?status=${status}`,
      {
        requiresAuth: true,
      }
    );
  }

  // Accept Appointment
  async acceptAppointment(appointmentId: string): Promise<void> {
    return await apiRequest<void>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Appointment/approve/${appointmentId}`,
      {
        method: "PUT",
        requiresAuth: true,
      }
    );
  }

  // Reject Appointment
  async rejectAppointment(appointmentId: string): Promise<void> {
    return await apiRequest<void>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Appointment/reject/${appointmentId}`,
      {
        method: "PUT",
        requiresAuth: true,
      }
    );
  }

  // Complete Appointment
  async completeAppointment(appointmentId: string): Promise<void> {
    return await apiRequest<void>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/appointment/complete/${appointmentId}`,
      {
        method: "PATCH",
        requiresAuth: true,
      }
    );
  }
}

// 👉 Export a single instance
export const appointmentService = new AppointmentService();
