// Services/favoritesService.ts
import { apiRequest } from "./api";
import {
  FavoriteDoctor,
  FavoriteMedicine,
  FavoriteClinic,
} from "@/types/favorites";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const favoritesService = {
  // Get all favorite doctors
  getFavoriteDoctors: async (): Promise<FavoriteDoctor[]> => {
    return await apiRequest<FavoriteDoctor[]>(
      `${baseUrl}/FavouriteDoctor/user`,
      {}
    );
  },

  // Get all favorite medicines
  getFavoriteMedicines: async (): Promise<FavoriteMedicine[]> => {
    return await apiRequest<FavoriteMedicine[]>(
      `${baseUrl}/FavoriteMedication/favorites`,
      {}
    );
  },

  // Get all favorite clinics
  getFavoriteClinics: async (): Promise<FavoriteClinic[]> => {
    return await apiRequest<FavoriteClinic[]>(
      `${baseUrl}/FavoriteClinic/favorites`,
      {}
    );
  },

  // Add doctor to favorites
  addDoctorToFavorites: async (doctorId: number): Promise<string> => {
    return await apiRequest<string>(
      `${baseUrl}/FavouriteDoctor/add/${doctorId}`,
      {
        method: "POST",
        returnType: "text",
      }
    );
  },

  // Add medicine to favorites
  addMedicineToFavorites: async (medicineId: number): Promise<string> => {
    return await apiRequest<string>(
      `${baseUrl}/FavoriteMedication/${medicineId}/favorite`,
      {
        method: "POST",
        returnType: "text",
      }
    );
  },

  // Add clinic to favorites
  addClinicToFavorites: async (clinicId: number): Promise<string> => {
    return await apiRequest<string>(
      `${baseUrl}/FavoriteClinic/${clinicId}/favorite`,
      {
        method: "POST",
        returnType: "text",
      }
    );
  },

  // Remove doctor from favorites
  removeDoctorFromFavorites: async (doctorId: number): Promise<string> => {
    return await apiRequest<string>(
      `${baseUrl}/FavouriteDoctor/remove/${doctorId}`,
      {
        method: "DELETE",
        returnType: "text",
      }
    );
  },

  // Remove medicine from favorites
  removeMedicineFromFavorites: async (medicineId: number): Promise<string> => {
    return await apiRequest<string>(
      `${baseUrl}/FavoriteMedication/${medicineId}/favorite`,
      {
        method: "DELETE",
        returnType: "text",
      }
    );
  },

  // Remove clinic from favorites
  removeClinicFromFavorites: async (clinicId: number): Promise<string> => {
    return await apiRequest<string>(
      `${baseUrl}/FavoriteClinic/${clinicId}/favorite`,
      {
        method: "DELETE",
        returnType: "text",
      }
    );
  },

  // Note: Check methods (isDoctorFavorite, isMedicineFavorite, isClinicFavorite)
  // are not implemented as they don't exist in the current API.
  // If needed in the future, you can check by fetching all favorites and searching for the ID.
};
