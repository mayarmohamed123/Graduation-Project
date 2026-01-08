import { apiRequest } from "../api";
import { AdminPharmacist, AdminPharmacyDetails, AdminMedicine } from "@/types/admin";
import { PharmacistOrder } from "@/types/pharmacist";

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
  data: FormData
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

/**
 * Update pharmacy details
 */
export const updatePharmacy = async (
  userId: string,
  data: FormData
): Promise<{ message: string }> => {
  return await apiRequest<{ message: string }>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/Admin/update-pharmacy/${userId}`,
    { method: "PUT", data, requiresAuth: true }
  );
};

/**
 * Add medicine to pharmacy (Admin)
 */
export const addMedicineToPharmacy = async (
  pharmacyId: number,
  data: FormData
): Promise<{ message: string }> => {
  return await apiRequest<{ message: string }>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/Admin/addmedicinetopharmacy/${pharmacyId}`,
    { method: "POST", data, requiresAuth: true }
  );
};

/**
 * Update medicine (Admin)
 */
export const updateMedicineAdmin = async (
  medicineId: number,
  pharmacyId: number,
  data: FormData
): Promise<{ message: string }> => {
  return await apiRequest<{ message: string }>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/Admin/updatemedicine/${medicineId}/${pharmacyId}`,
    { method: "PUT", data, requiresAuth: true }
  );
};

/**
 * Delete medicine (Admin)
 */
export const deleteMedicineAdmin = async (
  medicineId: number,
  pharmacyId: number
): Promise<{ message: string }> => {
  return await apiRequest<{ message: string }>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/Admin/deletemedicine/${medicineId}/${pharmacyId}`,
    { method: "DELETE", requiresAuth: true }
  );
};

/**
 * Get orders for pharmacy by userId (Admin)
 */
export const getOrdersForPharmacyByUserId = async (userId: string): Promise<PharmacistOrder[]> => {
    return await apiRequest<PharmacistOrder[]>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/Admin/getordersforpharmacy/${userId}`,
        { requiresAuth: true }
    );
};

/**
 * Cancel/Reject order (Admin)
 */
export const cancelOrderAdmin = async (orderId: number): Promise<string> => {
    return await apiRequest<string>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/Admin/${orderId}/cancelorder`,
        { method: "PUT", requiresAuth: true, returnType: "text" }
    );
};

/**
 * Mark order as delivered (Admin)
 */
export const markOrderDeliveredAdmin = async (orderId: number): Promise<string> => {
    return await apiRequest<string>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/Admin/${orderId}/deliveredorder`,
        { method: "PUT", requiresAuth: true, returnType: "text" }
    );
};

/**
 * Accept order (Admin)
 */
export const acceptOrderAdmin = async (orderId: number): Promise<string> => {
    return await apiRequest<string>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/Admin/${orderId}/acceptorder`,
        { method: "PUT", requiresAuth: true, returnType: "text" }
    );
};
