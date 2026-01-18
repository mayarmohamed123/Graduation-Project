import { apiRequest } from "../api";
import {
  AdminDoctor,
  AdminUser,
  UserOrder,
  DoctorPatient as AdminDoctorPatient,
  AdminPayment as AdminAdminPayment,
  AdminProfile as AdminAdminProfile,
  DoctorPatient,
  AdminPayment,
  AdminProfile,
} from "@/types/admin";
import { DashboardResponse, TopPerformersResponse } from "@/types/admin-stats";
import { DoctorAppointment } from "@/types/appointments";
import {
  UpdatePasswordData,
  UpdatePasswordResponse,
  Notification,
} from "@/types/user";
import { Message, Thread } from "../chatServices";

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
   * Get all regular users for admin view
   */
  async getAllRegularUsers(): Promise<AdminUser[]> {
    return await apiRequest<AdminUser[]>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Admin/getallregularusers`,
      { requiresAuth: true }
    );
  }

  /**
   * Get all orders for a specific user
   */
  async getUserOrders(userId: string): Promise<UserOrder[]> {
    return await apiRequest<UserOrder[]>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Admin/user-orders/${userId}`,
      { requiresAuth: true }
    );
  }

  /**
   * Get all appointments for a specific user
   */
  async getUserAppointments(userId: string): Promise<DoctorAppointment[]> {
    return await apiRequest<DoctorAppointment[]>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Admin/user-appointments/${userId}`,
      { requiresAuth: true }
    );
  }

  /**
   * Get all patients for a specific doctor
   */
  async getDoctorPatients(userId: string): Promise<DoctorPatient[]> {
    return await apiRequest<DoctorPatient[]>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Admin/patientsofdoctor/${userId}`,
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

  /**
   * Get all admin notifications
   */
  async getAdminNotifications(): Promise<{ notifications: Notification[] }> {
    return await apiRequest<{ notifications: Notification[] }>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Admin/admin-notifications`,
      { requiresAuth: true }
    );
  }

  /**
   * Mark a notification as read
   */
  async markNotificationAsRead(id: number): Promise<void> {
    return await apiRequest(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Notifications/${id}/read`,
      { method: "PUT", requiresAuth: true }
    );
  }

  /**
   * Mark all notifications as read
   */
  async markAllNotificationsAsRead(): Promise<void> {
    return await apiRequest(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Notifications/read-all`,
      { method: "PUT", requiresAuth: true }
    );
  }

  /**
   * Get order payments
   */
  async getOrderPayments(): Promise<AdminPayment[]> {
    return await apiRequest<AdminPayment[]>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Admin/payment/orders`,
      { requiresAuth: true }
    );
  }

  /**
   * Get appointment payments
   */
  async getAppointmentPayments(): Promise<AdminPayment[]> {
    return await apiRequest<AdminPayment[]>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Admin/payment/appointments`,
      { requiresAuth: true }
    );
  }

  /**
   * Get doctor registration payments
   */
  async getDoctorRegistrationPayments(): Promise<AdminPayment[]> {
    return await apiRequest<AdminPayment[]>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Admin/payment/doctor-registrations`,
      { requiresAuth: true }
    );
  }

  /**
   * Get pharmacist registration payments
   */
  async getPharmacistRegistrationPayments(): Promise<AdminPayment[]> {
    return await apiRequest<AdminPayment[]>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Admin/payment/pharmacist-registrations`,
      { requiresAuth: true }
    );
  }

  /**
   * Get admin profile
   */
  async getAdminProfile(): Promise<AdminProfile> {
    return await apiRequest<AdminProfile>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Admin/profile`,
      { requiresAuth: true, cache: "no-store" }
    );
  }

  /**
   * Update admin profile
   */
  async updateAdminProfile(formData: FormData): Promise<void> {
    return await apiRequest<void>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Admin/update-profile`,
      {
        method: "PUT",
        requiresAuth: true,
        data: formData,
      }
    );
  }

  /**
   * Update admin password
   */
  async updateAdminPassword(
    data: UpdatePasswordData
  ): Promise<UpdatePasswordResponse> {
    return await apiRequest<UpdatePasswordResponse>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Admin/update-password`,
      {
        method: "PUT",
        requiresAuth: true,
        data,
      }
    );
  }

  /**
   * Get dashboard statistics
   */
  async getDashboardStats(): Promise<DashboardResponse> {
    return await apiRequest<DashboardResponse>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Admin/dashboard-stats`,
      { requiresAuth: true }
    );
  }

  /**
   * Get top performers
   */
  async getTopPerformers(): Promise<TopPerformersResponse> {
    return await apiRequest<TopPerformersResponse>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Admin/top-performers`,
      { requiresAuth: true }
    );
  }

  /**
   * Get all admin chat threads
   */
  async getAdminThreads(): Promise<Thread[]> {
    return await apiRequest<Thread[]>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/chat/my-threads`,
      { requiresAuth: true, cache: "no-store" }
    );
  }

  /**
   * Start chat with a doctor
   */
  async startChatWithDoctor(doctorId: number): Promise<Thread> {
    return await apiRequest<Thread>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Admin/chat/start-with-doctor?doctorId=${doctorId}`,
      { method: "POST", requiresAuth: true }
    );
  }

  /**
   * Start chat with a pharmacist
   */
  async startChatWithPharmacist(pharmacistId: number): Promise<Thread> {
    return await apiRequest<Thread>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Admin/chat/start-with-pharmacist?pharmacistId=${pharmacistId}`,
      { method: "POST", requiresAuth: true }
    );
  }

  /**
   * Get messages for a specific admin chat thread
   */
  async getThreadMessages(threadId: number): Promise<Message[]> {
    return await apiRequest<Message[]>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Admin/chat/${threadId}/messages`,
      { requiresAuth: true, cache: "no-store" }
    );
  }

  /**
   * Send a message from admin
   */
  async sendAdminMessage(threadId: number, text: string): Promise<Message> {
    return await apiRequest<Message>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Admin/chat/send`,
      {
        method: "POST",
        requiresAuth: true,
        data: { ThreadId: threadId, text },
      }
    );
  }
}

export const adminService = new AdminService();
