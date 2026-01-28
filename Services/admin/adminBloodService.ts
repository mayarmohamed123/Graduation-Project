import { apiRequest } from "../api";
import { BloodRequest, AdminBloodDonation, RequestDonor } from "@/types/blood";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface BloodRequestStats {
  totalRequests: number;
  fulfilledRequests: number;
  unfulfilledRequests: number;
  urgentRequests: number;
}

export interface BloodDonationStats {
  totalDonations: number;
  availableDonors: number;
  donationsByType: Record<string, number>;
}

export interface UpdateBloodRequestData {
  RequiredType?: number;
  HospitalLatitude?: number;
  HospitalLongitude?: number;
  HospitalCity?: string;
  HospitalCountry?: string;
  HospitalName?: string;
  Units?: number;
  NeedWithin?: string;
  Fulfilled?: boolean;
}

export const adminBloodService = {
  // Get all blood requests (admin view)
  getAllBloodRequests: async (): Promise<BloodRequest[]> => {
    try {
      return await apiRequest<BloodRequest[]>(
        `${API_BASE_URL}/Admin/bloodrequest/getall`,
        {
          method: "GET",
          requiresAuth: true,
        },
      );
    } catch (error) {
      console.error("Failed to fetch all blood requests:", error);
      return [];
    }
  },

  // Get all blood donations (admin view)
  getAllBloodDonations: async (): Promise<AdminBloodDonation[]> => {
    try {
      return await apiRequest<AdminBloodDonation[]>(
        `${API_BASE_URL}/admin/blooddonor/getall`,
        {
          method: "GET",
          requiresAuth: true,
        },
      );
    } catch (error) {
      console.error("Failed to fetch all blood donations:", error);
      return [];
    }
  },

  // Get blood request by ID (admin)
  getBloodRequestById: async (id: number): Promise<BloodRequest> => {
    try {
      return await apiRequest<BloodRequest>(
        `${API_BASE_URL}/Admin/bloodrequest/${id}`,
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

  // Get donors by request ID (admin)
  getDonorsByRequestId: async (requestId: number): Promise<RequestDonor[]> => {
    try {
      return await apiRequest<RequestDonor[]>(
        `${API_BASE_URL}/admin/blooddonor/getbyrequestid/${requestId}`,
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

  // Delete a blood request (admin)
  deleteBloodRequest: async (id: number): Promise<{ message: string }> => {
    try {
      return await apiRequest<{ message: string }>(
        `${API_BASE_URL}/admin/BloodRequest/${id}`,
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

  // Delete a blood donation (admin)
  deleteBloodDonation: async (id: number): Promise<{ message: string }> => {
    try {
      return await apiRequest<{ message: string }>(
        `${API_BASE_URL}/admin/blooddonor/${id}`,
        {
          method: "DELETE",
          requiresAuth: true,
        },
      );
    } catch (error) {
      console.error(`Failed to delete blood donation ${id}:`, error);
      throw error;
    }
  },

  // Update blood request (admin)
  updateBloodRequest: async (
    id: number,
    data: UpdateBloodRequestData,
  ): Promise<{ message: string }> => {
    try {
      return await apiRequest<{ message: string }>(
        `${API_BASE_URL}/admin/bloodrequest/${id}`,
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

  // Convenience method to mark request as fulfilled
  markRequestFulfilled: async (id: number): Promise<{ message: string }> => {
    return adminBloodService.updateBloodRequest(id, { Fulfilled: true });
  },
};
