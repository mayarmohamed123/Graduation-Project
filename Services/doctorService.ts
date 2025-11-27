// services/doctorService.ts
import {
  AppointmentResponse,
  BookAppointmentData,
  CreateSessionResponse,
  Doctor,
  Review,
  VerifySessionResponse,
} from "@/types/doctors";
import { FilterParams, fetchWithAuth, postWithAuth } from "./api";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const doctorService = {
  // Get all doctors
  getAllDoctors: async (): Promise<Doctor[]> => {
    return await fetchWithAuth(
      `${baseUrl}/doctors/allDoctorsShowToRegularUser`
    );
  },

  // Get doctors by specialty
  getDoctorsBySpecialty: async (specialty: string): Promise<Doctor[]> => {
    return await fetchWithAuth(`${baseUrl}/doctors/specialty/${specialty}`);
  },

  // Get doctors with filters
  getDoctorsWithFilters: async (filters: FilterParams): Promise<Doctor[]> => {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });

    const url = `${baseUrl}/doctors/filterDoctors?${queryParams.toString()}`;
    return await fetchWithAuth(url);
  },

  // Combined method that handles all filtering scenarios
  getFilteredDoctors: async (filters: FilterParams): Promise<Doctor[]> => {
    // If specialty is specified, use specialty endpoint
    if (filters.specialty) {
      return await doctorService.getDoctorsBySpecialty(filters.specialty);
    }

    // Otherwise use the general filter endpoint
    return await doctorService.getDoctorsWithFilters(filters);
  },

  // Get doctor by ID
  getDoctorById: async (id: number): Promise<Doctor> => {
    return await fetchWithAuth(`${baseUrl}/doctors/${id}`);
  },

  // Book appointment in doctor clinic
  bookAppointmentInClinic: async (
    data: BookAppointmentData
  ): Promise<AppointmentResponse> => {
    return await postWithAuth(`${baseUrl}/appointment/book`, data);
  },

  // Get Doctor Reviews
  GetDoctorReviews: async (id: number): Promise<Review> => {
    return await fetchWithAuth(`${baseUrl}/Review/doctor/${id}`);
  },

  // add Review for Doctor
  addReview: async (data: {
    DoctorId: number;
    Rating: number;
    Comment: string;
  }) => {
    return await postWithAuth(`${baseUrl}/Review/add-review`, data);
  },

  // Update Review
  updateReview: async (
    reviewId: number,
    data: { Rating: number; Comment: string }
  ): Promise<{ message: string }> => {
    return await fetchWithAuth(`${baseUrl}/Review/${reviewId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // Delete Review
  deleteReview: async (reviewId: number): Promise<{ message: string }> => {
    return await fetchWithAuth(`${baseUrl}/Review/${reviewId}`, {
      method: "DELETE",
    });
  },

  // Create payment session after appointment
  createPaymentSession: async (
    appointmentId: number
  ): Promise<CreateSessionResponse> => {
    return await postWithAuth(`${baseUrl}/payments/create-session`, {
      paymentFor: "Appointment",
      appointmentId,
    });
  },

  // Verify payment session after appointment
  verifyPaymentSession: async (
    sessionId: string
  ): Promise<VerifySessionResponse> => {
    return await fetchWithAuth(
      `${baseUrl}/payments/verify-session?sessionId=${sessionId}`
    );
  },
};
