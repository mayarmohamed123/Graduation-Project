// services/doctorService.ts
import {
  AppointmentResponse,
  AppointmentSlot,
  BookAppointmentData,
  CreateSessionResponse,
  Doctor,
  PatientAppointment,
  Review,
  VerifySessionResponse,
  AnalyticsAppointments,
  AnalyticsRevenue,
  AnalyticsGender,
  AnalyticsAge,
  AnalyticsStatus,
  AnalyticsPatientRetention,
  Clinic,
} from "@/types/doctors";
import { Notification } from "@/types";
import { FilterParams, apiRequest } from "./api";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const doctorService = {
  // Get all doctors
  getAllDoctors: async (): Promise<Doctor[]> => {
    return await apiRequest<Doctor[]>(
      `${baseUrl}/doctors/allDoctorsShowToRegularUser`,
      { cache: "no-store" }
    );
  },

  // Get doctors with filters
  getFilteredDoctors: async (filters: FilterParams): Promise<Doctor[]> => {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });

    const url = `${baseUrl}/doctors/filterDoctors?${queryParams.toString()}`;
    return await apiRequest<Doctor[]>(url, { cache: "no-store" });
  },

  // Get doctor by ID
  getDoctorById: async (id: number): Promise<Doctor> => {
    return await apiRequest<Doctor>(`${baseUrl}/doctors/${id}`, {
      cache: "no-store",
    });
  },
  // Get available slots for a doctor on a specific date
  getDoctorAvailableSlots: async (
    doctorId: number,
    date: string
  ): Promise<AppointmentSlot[]> => {
    return await apiRequest<AppointmentSlot[]>(
      `${baseUrl}/Appointment/available-slots?doctorId=${doctorId}&date=${date}`,
      {
        method: "GET",
        requiresAuth: true,
      }
    );
  },

  // Book appointment in doctor clinic
  bookAppointmentInClinic: async (
    data: BookAppointmentData
  ): Promise<AppointmentResponse> => {
    return await apiRequest<AppointmentResponse>(
      `${baseUrl}/appointment/book`,
      {
        method: "POST",
        data,
      }
    );
  },

  // Get Doctor Reviews
  GetDoctorReviews: async (id: number): Promise<Review[]> => {
    return await apiRequest<Review[]>(`${baseUrl}/Review/doctor/${id}`, {
      cache: "no-store",
    });
  },

  // add Review for Doctor
  addReview: async (data: {
    DoctorId: number;
    Rating: number;
    Comment: string;
  }) => {
    return await apiRequest<{ message: string }>(
      `${baseUrl}/Review/add-review`,
      {
        method: "POST",
        data,
      }
    );
  },

  // Update Review
  updateReview: async (
    reviewId: number,
    data: { Rating: number; Comment: string }
  ): Promise<{ message: string }> => {
    return await apiRequest<{ message: string }>(
      `${baseUrl}/Review/${reviewId}`,
      {
        method: "PUT",
        data,
      }
    );
  },

  // Delete Review
  deleteReview: async (reviewId: number): Promise<{ message: string }> => {
    return await apiRequest<{ message: string }>(
      `${baseUrl}/Review/${reviewId}`,
      {
        method: "DELETE",
      }
    );
  },

  // Create payment session after appointment
  createPaymentSession: async (
    appointmentId: number
  ): Promise<CreateSessionResponse> => {
    return await apiRequest<CreateSessionResponse>(
      `${baseUrl}/payments/create-session`,
      {
        method: "POST",
        data: {
          paymentFor: "Appointment",
          appointmentId,
        },
      }
    );
  },

  // Create payment session for doctor subscription
  createSubscriptionSession: async (
    doctorId: number
  ): Promise<CreateSessionResponse> => {
    return await apiRequest<CreateSessionResponse>(
      `${baseUrl}/payments/create-session`,
      {
        method: "POST",
        data: {
          doctorId,
          paymentFor: "DoctorRegistration",
          amount: 100,
        },
      }
    );
  },

  // Verify payment session after appointment
  verifyPaymentSession: async (
    sessionId: string
  ): Promise<VerifySessionResponse> => {
    return await apiRequest<VerifySessionResponse>(
      `${baseUrl}/payments/verify-session?sessionId=${sessionId}`
    );
  },

  // Register doctor with FormData
  registerDoctor: async (
    formData: FormData
  ): Promise<{
    message: string;
    userId: string;
    doctorId: number;
    email: string;
    role: string;
  }> => {
    interface RawRegisterResponse {
      message: string;
      userId: string;
      email: string;
      role: string;
      doctorProfileId?: number;
      doctorId?: number;
      DoctorId?: number;
      id?: number;
    }

    const response = await apiRequest<RawRegisterResponse>(`${baseUrl}/doctors/register`, {
      method: "POST",
      data: formData,
      requiresAuth: false,
    });
    
    // Handle different possible field names for ID (Mapping from API doctorProfileId)
    const doctorId = response.doctorId || response.doctorProfileId || response.DoctorId || response.id || 0;
    
    return {
      message: response.message,
      userId: response.userId,
      email: response.email,
      role: response.role,
      doctorId
    };
  },

  // Update doctor profile with FormData
  updateDoctorProfile: async (
    formData: FormData
  ): Promise<{ message: string }> => {
    return await apiRequest<{ message: string }>(
      `${baseUrl}/doctors/update-profile`,
      {
        method: "PUT",
        data: formData,
        requiresAuth: true,
      }
    );
  },

  // Get doctor notifications
  getDoctorNotifications: async (): Promise<{
    appointmentRequests: Notification[];
  }> => {
    return await apiRequest<{ appointmentRequests: Notification[] }>(
      `${baseUrl}/notifications/user`,
      {
        cache: "no-store",
      }
    );
  },
  // Update clinic information with FormData
  updateClinicData: async (
    formData: FormData
  ): Promise<{ message: string }> => {
    return await apiRequest<{ message: string }>(
      `${baseUrl}/doctors/update-clinic`,
      {
        method: "PUT",
        data: formData,
        requiresAuth: true,
      }
    );
  },

  // Mark notification as read
  markNotificationAsRead: async (id: number): Promise<void> => {
    return await apiRequest<void>(`${baseUrl}/Notifications/${id}/read`, {
      method: "PUT",
    });
  },

  // Mark all notifications as read
  markAllNotificationsAsRead: async (): Promise<void> => {
    return await apiRequest<void>(`${baseUrl}/Notifications/read-all`, {
      method: "PUT",
    });
  },
  // Get all patients for a doctor
  getAllPatients: async (): Promise<PatientAppointment[]> => {
    return await apiRequest<PatientAppointment[]>(
      `${baseUrl}/Appointment/patients`,
      {
        method: "GET",
        requiresAuth: true,
      }
    );
  },
  // Get top rated doctors
  getTopRatedDoctors: async (): Promise<Doctor[]> => {
    return await apiRequest<Doctor[]>(`${baseUrl}/doctors/top-doctors`, {
      cache: "no-store",
      credentials: "omit", // Don't send tokens
      requiresAuth: false,
    });
  },
  // Analytics: Appointments
  getAnalyticsAppointments: async (): Promise<AnalyticsAppointments[]> => {
    return await apiRequest<AnalyticsAppointments[]>(
      `${baseUrl}/doctors/weekly-appointments`,
      { requiresAuth: true }
    );
  },

  // Analytics: Revenue
  getAnalyticsRevenue: async (): Promise<AnalyticsRevenue[]> => {
    return await apiRequest<AnalyticsRevenue[]>(
      `${baseUrl}/doctors/weekly-revenue`,
      { requiresAuth: true }
    );
  },

  // Analytics: Gender
  getAnalyticsGender: async (): Promise<AnalyticsGender> => {
    return await apiRequest<AnalyticsGender>(
      `${baseUrl}/doctors/gender-stats`,
      {
        requiresAuth: true,
      }
    );
  },

  // Analytics: Age
  getAnalyticsAge: async (): Promise<AnalyticsAge[]> => {
    return await apiRequest<AnalyticsAge[]>(`${baseUrl}/doctors/age-ranges`, {
      requiresAuth: true,
    });
  },

  // Analytics: Status
  getAnalyticsStatus: async (): Promise<AnalyticsStatus[]> => {
    return await apiRequest<AnalyticsStatus[]>(
      `${baseUrl}/doctors/weekly-status`,
      {
        requiresAuth: true,
      }
    );
  },
  // Analytics: Patient Retention
  getAnalyticsPatientRetention: async (): Promise<
    AnalyticsPatientRetention[]
  > => {
    return await apiRequest<AnalyticsPatientRetention[]>(
      `${baseUrl}/doctors/weekly-patients`,
      {
        requiresAuth: true,
      }
    );
  },
  // Analytics: Daily Revenue & Appointments
  getDailyRevenue: async (
    year: number,
    month: number
  ): Promise<
    { date: string; appointmentsCount: number; totalRevenue: number }[]
  > => {
    return await apiRequest<
      { date: string; appointmentsCount: number; totalRevenue: number }[]
    >(`${baseUrl}/doctors/daily-revenue?year=${year}&month=${month}`, {
      requiresAuth: true,
    });
  },
  getDailyAppointments: async (
    year: number,
    month: number
  ): Promise<
    { date: string; appointmentsCount: number; totalRevenue: number }[]
  > => {
    return await apiRequest<
      { date: string; appointmentsCount: number; totalRevenue: number }[]
    >(`${baseUrl}/doctors/daily-appointments?year=${year}&month=${month}`, {
      requiresAuth: true,
    });
  },

  // Get clinic info of the logged-in doctor
  getClinicOfDoctor: async (): Promise<Clinic> => {
    return await apiRequest<Clinic>(`${baseUrl}/doctors/GetClinicOfDoctor`, {
      cache: "no-store",
      requiresAuth: true,
    });
  },
};
