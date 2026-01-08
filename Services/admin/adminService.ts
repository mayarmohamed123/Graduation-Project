import { apiRequest } from "../api";
import { AdminDoctor } from "@/types/admin";
import { DoctorAppointment } from "@/types/appointments";

class AdminService {
  /**
   * Get all doctors for admin view
   */
  async getAllDoctors(): Promise<AdminDoctor[]> {
    return await apiRequest<AdminDoctor[]>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Admin/allDoctorsShowToAdmin`,
      { requiresAuth: true }
    );
  }

  /**
   * Approve a doctor
   */
  async approveDoctor(id: number): Promise<void> {
    return await apiRequest(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Admin/approvedoctor/${id}`,
      { method: "PUT", requiresAuth: true }
    );
  }

  /**
   * Reject a doctor
   */
  async rejectDoctor(id: number): Promise<void> {
    return await apiRequest(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Admin/rejectdoctor/${id}`,
      { method: "PUT", requiresAuth: true }
    );
  }

  /**
   * Delete a doctor
   */
  async deleteDoctor(id: number): Promise<void> {
    return await apiRequest(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Admin/deletedoctorwithclinic/${id}`,
      { method: "DELETE", requiresAuth: true }
    );
  }

  /**
   * Update doctor profile info
   */
  async updateDoctorProfile(userId: string, formData: FormData): Promise<void> {
    return await apiRequest(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Admin/update-doctorprofile/${userId}`,
      { method: "PUT", requiresAuth: true, data: formData }
    );
  }

  /**
   * Update doctor clinic info
   */
  async updateClinic(userId: string, formData: FormData): Promise<void> {
    return await apiRequest(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Admin/update-clinic/${userId}`,
      { method: "PUT", requiresAuth: true, data: formData }
    );
  }

  /**
   * Get all appointments for a doctor
   */
  async getDoctorAppointments(userId: string): Promise<DoctorAppointment[]> {
    return await apiRequest<DoctorAppointment[]>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Admin/doctorappointments/${userId}`,
      { requiresAuth: true }
    );
  }

  /**
   * Approve an appointment
   */
  async approveAppointment(
    appointmentId: number,
    userId: string
  ): Promise<void> {
    return await apiRequest(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Admin/approveappointment/${appointmentId}/${userId}`,
      { method: "PUT", requiresAuth: true }
    );
  }

  /**
   * Reject an appointment
   */
  async rejectAppointment(appointmentId: number): Promise<void> {
    return await apiRequest(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Admin/rejectappointment/${appointmentId}`,
      { method: "PUT", requiresAuth: true }
    );
  }

  /**
   * Complete an appointment
   */
  async completeAppointment(appointmentId: number): Promise<void> {
    return await apiRequest(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Admin/completeappointment/${appointmentId}`,
      { method: "PATCH", requiresAuth: true }
    );
  }
}

export const adminService = new AdminService();
