import { apiRequest } from "./api";
import { BloodDonation, RequestDonor } from "@/types/blood";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const bloodDonorService = {
  getMyDonations: async (): Promise<BloodDonation[]> => {
    try {
      return await apiRequest<BloodDonation[]>(
        `${API_BASE_URL}/BloodDonor/my-donations`,
        {
          method: "GET",
          requiresAuth: true,
        },
      );
    } catch (error) {
      console.error("Failed to fetch my donations:", error);
      throw error;
    }
  },

  deleteDonation: async (id: number): Promise<{ message: string }> => {
    try {
      return await apiRequest<{ message: string }>(
        `${API_BASE_URL}/BloodDonor/${id}`,
        {
          method: "DELETE",
          requiresAuth: true,
        },
      );
    } catch (error) {
      console.error(`Failed to delete donation ${id}:`, error);
      throw error;
    }
  },
  getDonorsByRequest: async (requestId: number): Promise<RequestDonor[]> => {
    try {
      return await apiRequest<RequestDonor[]>(
        `${API_BASE_URL}/BloodDonor/by-request/${requestId}`,
        {
          method: "GET",
          requiresAuth: true,
        },
      );
    } catch (error) {
      console.error(`Failed to fetch donors for request ${requestId}:`, error);
      throw error;
    }
  },
};
