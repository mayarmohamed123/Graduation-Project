// services/doctorService.ts
import {
  AppointmentResponse,
  BookAppointmentData,
  CreateSessionResponse,
  Doctor,
  PatientAppointment,
  Review,
  VerifySessionResponse,
} from "@/types/doctors";
import { FilterParams, apiRequest } from "./api";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const doctorService = {
  // Get all doctors
  getAllDoctors: async (): Promise<Doctor[]> => {
    return await apiRequest<Doctor[]>(
      `${baseUrl}/doctors/allDoctorsShowToRegularUser`,
      { next: { revalidate: 60 } }
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
    return await apiRequest<Doctor[]>(url, { next: { revalidate: 60 } });
  },

  // Get doctor by ID
  getDoctorById: async (id: number): Promise<Doctor> => {
    return await apiRequest<Doctor>(`${baseUrl}/doctors/${id}`, {
      next: { revalidate: 60 },
    });
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
  GetDoctorReviews: async (id: number): Promise<Review> => {
    return await apiRequest<Review>(`${baseUrl}/Review/doctor/${id}`, {
      next: { revalidate: 60 },
    });
  },

  // add Review for Doctor
  addReview: async (data: {
    DoctorId: number;
    Rating: number;
    Comment: string;
  }) => {
    return await apiRequest<{ message: string }>(`${baseUrl}/Review/add-review`, {
      method: "POST",
      data,
    });
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

  // Verify payment session after appointment
  verifyPaymentSession: async (
    sessionId: string
  ): Promise<VerifySessionResponse> => {
    return await apiRequest<VerifySessionResponse>(
      `${baseUrl}/payments/verify-session?sessionId=${sessionId}`
    );
  },

  // Register doctor with FormData
  registerDoctor: async (formData: FormData): Promise<{
    message: string;
    userId: string;
    email: string;
    role: string;
  }> => {
    return await apiRequest(
      `${baseUrl}/doctors/register`,
      {
        method: "POST",
        data: formData,
        requiresAuth: false, 
      }
    );
  },

  // Update doctor profile with FormData
  updateDoctorProfile: async (formData: FormData): Promise<{ message: string }> => {
    return await apiRequest<{ message: string }>(
      `${baseUrl}/doctors/update-profile`,
      {
        method: "PUT",
        data: formData,
        requiresAuth: true,
      }
    );
  },

  // Update clinic information with FormData
  updateClinicData: async (formData: FormData): Promise<{ message: string }> => {
    return await apiRequest<{ message: string }>(
      `${baseUrl}/doctors/update-clinic`,
      {
        method: "PUT",
        data: formData,
        requiresAuth: true,
      }
    );
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
};
