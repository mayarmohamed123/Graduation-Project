import { apiRequest } from "./api";
import { BloodRequest } from "@/types/blood";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const bloodRequestService = {
  getUnfulfilledRequests: async (): Promise<BloodRequest[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/BloodRequest/unfulfilled`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }
      return await response.json();
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
};
