import { apiRequest } from "../api";
import { AdminPharmacist, AdminPharmacyDetails, AdminMedicine } from "@/types/admin";

/**
 * Get pharmacist data by userId
 */
export const getPharmacistById = async (userId: string): Promise<AdminPharmacist> => {
  return await apiRequest<AdminPharmacist>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/Admin/getpharmacist/${userId}`,
    { requiresAuth: true }
  );
};

/**
 * Get pharmacy of pharmacist by userId
 */
export const getPharmacyOfPharmacist = async (userId: string): Promise<AdminPharmacyDetails> => {
  return await apiRequest<AdminPharmacyDetails>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/Admin/GetPharmacyOfPharmacist/${userId}`,
    { requiresAuth: true }
  );
};

/**
 * Get all medicines in a pharmacy
 */
export const getPharmacyMedicines = async (pharmacyId: number): Promise<AdminMedicine[]> => {
  return await apiRequest<AdminMedicine[]>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/Admin/pharmacy/${pharmacyId}`,
    { requiresAuth: true }
  );
};

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
