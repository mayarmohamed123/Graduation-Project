import { apiRequest } from "./api";
import { AdminDoctor } from "@/types/admin";

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
}

export const adminService = new AdminService();
