import { apiRequest } from "../api";
import { 
  AdminOverviewResponse, 
  DailyRevenueReport, 
  DailyRegistrationReport,
  SpecialtyDoctorCount,
  DoctorRegistrationStatusReport,
  DailyOrdersReport,
  DailyAppointmentsReport,
  PharmacistRegistrationStatusReport
} from "@/types";

class AdminAnalyticsService {
  /**
   * Get admin overview analytics
   */
  async getAdminOverview(): Promise<AdminOverviewResponse> {
    return await apiRequest<AdminOverviewResponse>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Admin/admin-overview`,
      { requiresAuth: true }
    );
  }

  /**
   * Get daily revenue report
   */
  async getDailyRevenueReport(month: number, year: number): Promise<DailyRevenueReport[]> {
    return await apiRequest<DailyRevenueReport[]>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Admin/daily-revenue-report?month=${month}&year=${year}`,
      { requiresAuth: true }
    );
  }

  /**
   * Get daily registration report
   */
  async getDailyRegistrationReport(month: number, year: number): Promise<DailyRegistrationReport[]> {
    return await apiRequest<DailyRegistrationReport[]>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Admin/daily-registration-count-report?month=${month}&year=${year}`,
      { requiresAuth: true }
    );
  }

  /**
   * Get specialty doctor count report
   */
  async getSpecialtyDoctorCountReport(): Promise<SpecialtyDoctorCount[]> {
    return await apiRequest<SpecialtyDoctorCount[]>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Admin/specialty-doctor-count-report`,
      { requiresAuth: true }
    );
  }

  /**
   * Get daily doctor registration status report
   */
  async getDoctorRegistrationStatusReport(month: number, year: number): Promise<DoctorRegistrationStatusReport[]> {
    return await apiRequest<DoctorRegistrationStatusReport[]>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Admin/daily-doctor-registration-status-report?month=${month}&year=${year}`,
      { requiresAuth: true }
    );
  }

  /**
   * Get daily pharmacist registration status report
   */
  async getPharmacistRegistrationStatusReport(month: number, year: number): Promise<PharmacistRegistrationStatusReport[]> {
    return await apiRequest<PharmacistRegistrationStatusReport[]>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Admin/daily-pharmacist-registration-status-report?month=${month}&year=${year}`,
      { requiresAuth: true }
    );
  }

  /**
   * Get daily orders report
   */
  async getDailyOrdersReport(month: number, year: number): Promise<DailyOrdersReport[]> {
    return await apiRequest<DailyOrdersReport[]>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Admin/daily-orders-report?month=${month}&year=${year}`,
      { requiresAuth: true }
    );
  }

  /**
   * Get daily appointments report
   */
  async getDailyAppointmentsReport(month: number, year: number): Promise<DailyAppointmentsReport[]> {
    return await apiRequest<DailyAppointmentsReport[]>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Admin/daily-appointments-report?month=${month}&year=${year}`,
      { requiresAuth: true }
    );
  }
}

export const adminAnalyticsService = new AdminAnalyticsService();
