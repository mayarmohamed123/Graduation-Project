import { apiRequest } from "./api";
import { BloodRequest } from "@/types/blood";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const bloodRequestService = {
  getUnfulfilledRequests: async (): Promise<BloodRequest[]> => {
    try {
      return await apiRequest<BloodRequest[]>(
        `${API_BASE_URL}/BloodRequest/unfulfilled`,
        {
          requiresAuth: false,
        }
      );
    } catch (error) {
      console.error("Failed to fetch unfulfilled blood requests:", error);
      throw error;
    }
  },

  donateBlood: async (data: {
    BloodRequestId: number;
    Latitude: number;
    Longitude: number;
    City: string;
    Country: string;
    PhoneNumber: string;
  }): Promise<{ message: string }> => {
    try {
      return await apiRequest<{ message: string }>(
        `${API_BASE_URL}/BloodDonor/Donate`,
        {
          method: "POST",
          data,
          requiresAuth: true,
        },
      );
    } catch (error) {
      console.error("Donation action failed:", error);
      throw error;
    }
  },

  createBloodRequest: async (data: {
    RequiredType: number;
    HospitalLatitude: number;
    HospitalLongitude: number;
    HospitalCity: string;
    HospitalCountry: string;
    HospitalName: string;
    Units: number;
    NeedWithin: string;
  }): Promise<{ message: string }> => {
    try {
      return await apiRequest<{ message: string }>(
        `${API_BASE_URL}/BloodRequest`,
        {
          method: "POST",
          data,
          requiresAuth: true,
        },
      );
    } catch (error) {
      console.error("Failed to create blood request:", error);
      throw error;
    }
  },

  getMyRequests: async (): Promise<BloodRequest[]> => {
    try {
      return await apiRequest<BloodRequest[]>(
        `${API_BASE_URL}/BloodRequest/my-requests`,
        {
          method: "GET",
          requiresAuth: true,
        },
      );
    } catch (error) {
      console.error("Failed to fetch my blood requests:", error);
      throw error;
    }
  },

  getBloodRequestById: async (id: number): Promise<BloodRequest> => {
    try {
      return await apiRequest<BloodRequest>(
        `${API_BASE_URL}/BloodRequest/${id}`,
        {
          method: "GET",
          requiresAuth: true,
        },
      );
    } catch (error) {
      console.error(`Failed to fetch blood request ${id}:`, error);
      throw error;
    }
  },

  updateBloodRequest: async (
    id: number,
    data: {
      RequiredType: number;
      HospitalLatitude: number;
      HospitalLongitude: number;
      HospitalCity: string;
      HospitalCountry: string;
      HospitalName: string;
      Units: number;
      NeedWithin: string;
    },
  ): Promise<{ message: string }> => {
    try {
      return await apiRequest<{ message: string }>(
        `${API_BASE_URL}/BloodRequest/${id}`,
        {
          method: "PUT",
          data,
          requiresAuth: true,
        },
      );
    } catch (error) {
      console.error(`Failed to update blood request ${id}:`, error);
      throw error;
    }
  },

  deleteBloodRequest: async (id: number): Promise<{ message: string }> => {
    try {
      return await apiRequest<{ message: string }>(
        `${API_BASE_URL}/BloodRequest/${id}`,
        {
          method: "DELETE",
          requiresAuth: true,
        },
      );
    } catch (error) {
      console.error(`Failed to delete blood request ${id}:`, error);
      throw error;
    }
  },
};
