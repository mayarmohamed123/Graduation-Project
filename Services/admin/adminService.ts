import { apiRequest } from "../api";
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
   * Update doctor info
   */
  async updateDoctor(id: number, data: Partial<AdminDoctor>): Promise<void> {
    return await apiRequest(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Admin/update-doctorprofile/${id}`,
      { method: "PUT", data, requiresAuth: true }
    );
  }
}

export const adminService = new AdminService();
