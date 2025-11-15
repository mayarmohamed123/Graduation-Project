// services/doctorService.ts
import { Doctor } from "@/types/doctors";
import { FilterParams, fetchWithAuth } from "./api";

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
};
