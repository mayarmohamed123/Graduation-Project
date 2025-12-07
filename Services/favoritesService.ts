// Services/favoritesService.ts
import { fetchWithAuth, postWithAuthText, deleteWithAuthText } from "./api";
import {
  FavoriteDoctor,
  FavoriteMedicine,
  FavoriteClinic,
} from "@/types/favorites";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const favoritesService = {
  // Get all favorite doctors
  getFavoriteDoctors: async (): Promise<FavoriteDoctor[]> => {
    return await fetchWithAuth(`${baseUrl}/FavouriteDoctor/user`, {
      next: { revalidate: 0 }, // Don't cache favorites
    });
  },

  // Get all favorite medicines
  getFavoriteMedicines: async (): Promise<FavoriteMedicine[]> => {
    return await fetchWithAuth(`${baseUrl}/FavoriteMedication/favorites`, {
      next: { revalidate: 0 },
    });
  },

  // Get all favorite clinics
  getFavoriteClinics: async (): Promise<FavoriteClinic[]> => {
    return await fetchWithAuth(`${baseUrl}/FavoriteClinic/favorites`, {
      next: { revalidate: 0 },
    });
  },

  // Add doctor to favorites
  addDoctorToFavorites: async (doctorId: number): Promise<string> => {
    return await postWithAuthText(
      `${baseUrl}/FavouriteDoctor/add/${doctorId}`,
      undefined,
      {
        method: "POST",
      }
    );
  },

  // Add medicine to favorites
  addMedicineToFavorites: async (medicineId: number): Promise<string> => {
    return await postWithAuthText(
      `${baseUrl}/FavoriteMedication/${medicineId}/favorite`,
      undefined,
      {
        method: "POST",
      }
    );
  },

  // Add clinic to favorites
  addClinicToFavorites: async (clinicId: number): Promise<string> => {
    return await postWithAuthText(
      `${baseUrl}/FavoriteClinic/${clinicId}/favorite`,
      undefined,
      {
        method: "POST",
      }
    );
  },

  // Remove doctor from favorites
  removeDoctorFromFavorites: async (doctorId: number): Promise<string> => {
    return await deleteWithAuthText(
      `${baseUrl}/FavouriteDoctor/remove/${doctorId}`
    );
  },

  // Remove medicine from favorites
  removeMedicineFromFavorites: async (medicineId: number): Promise<string> => {
    return await deleteWithAuthText(
      `${baseUrl}/FavoriteMedication/${medicineId}/favorite`
    );
  },

  // Remove clinic from favorites
  removeClinicFromFavorites: async (clinicId: number): Promise<string> => {
    return await deleteWithAuthText(
      `${baseUrl}/FavoriteClinic/${clinicId}/favorite`
    );
  },

  // Note: Check methods (isDoctorFavorite, isMedicineFavorite, isClinicFavorite)
  // are not implemented as they don't exist in the current API.
  // If needed in the future, you can check by fetching all favorites and searching for the ID.
};
