import { apiRequest } from "../api";
import { AdminPharmacist } from "@/types/admin";

/**
 * Get all pharmacists for admin view
 */
export const getAdminPharmacists = async (): Promise<AdminPharmacist[]> => {
  return await apiRequest<AdminPharmacist[]>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/Admin/allpharmacists`,
    { requiresAuth: true }
  );
};
/**
 * Approve a pharmacist
 */
export const approvePharmacist = async (id: number): Promise<{ message: string }> => {
  return await apiRequest<{ message: string }>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/Admin/approvepharmacist/${id}`,
    { method: "PUT", requiresAuth: true }
  );
};

/**
 * Update pharmacist profile
 */
export const updatePharmacistProfile = async (
  userId: string,
  data: Partial<AdminPharmacist>
): Promise<{ message: string }> => {
  return await apiRequest<{ message: string }>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/Admin/updatepharmacist-profile/${userId}`,
    { method: "PUT", data, requiresAuth: true }
  );
};

/**
 * Reject a pharmacist
 */
export const rejectPharmacist = async (id: number): Promise<{ message: string }> => {
  return await apiRequest<{ message: string }>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/Admin/rejectpharmacist/${id}`,
    { method: "PUT", requiresAuth: true }
  );
};

/**
 * Delete a pharmacist with pharmacy
 */
export const deletePharmacist = async (id: number): Promise<{ message: string }> => {
  return await apiRequest<{ message: string }>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/Admin/deletepharmacistwithpharmacy/${id}`,
    { method: "DELETE", requiresAuth: true }
  );
};
