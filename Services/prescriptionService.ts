// services/prescriptionService.ts
import {
  Prescription,
  CreatePrescriptionInput,
  CreatePrescriptionResponse,
  AddPrescriptionItemInput,
  PrescriptionItem,
  UpdatePrescriptionItemInput,
  CommonMessageResponse,
} from "@/types/prescription";
import { apiRequest } from "./api";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const prescriptionService = {
  // Get user prescriptions by user ID
  getUserPrescriptions: async (userId: string): Promise<Prescription[]> => {
    return await apiRequest<Prescription[]>(
      `${baseUrl}/Prescription/userPrescription/${userId}`,
      {
        method: "GET",
        requiresAuth: true,
        next: { revalidate: 60 },
      }
    );
  },

  // Create a new prescription
  createPrescription: async (
    data: CreatePrescriptionInput
  ): Promise<CreatePrescriptionResponse> => {
    return await apiRequest<CreatePrescriptionResponse>(
      `${baseUrl}/Prescription`,
      {
        method: "POST",
        data,
        requiresAuth: true,
      }
    );
  },

  // Add item to an existing prescription
  addItemToPrescription: async (
    prescriptionId: number,
    data: AddPrescriptionItemInput
  ): Promise<PrescriptionItem> => {
    return await apiRequest<PrescriptionItem>(
      `${baseUrl}/Prescription/${prescriptionId}/items`,
      {
        method: "POST",
        data,
        requiresAuth: true,
      }
    );
  },

  // Delete a prescription by ID
  deletePrescription: async (
    prescriptionId: number
  ): Promise<{ message: string }> => {
    return await apiRequest<{ message: string }>(
      `${baseUrl}/Prescription/${prescriptionId}`,
      {
        method: "DELETE",
        requiresAuth: true,
      }
    );
  },

  // Update an item in a prescription
  updatePrescriptionItem: async (
    itemId: number,
    data: UpdatePrescriptionItemInput
  ): Promise<CommonMessageResponse> => {
    return await apiRequest<CommonMessageResponse>(
      `${baseUrl}/Prescription/items/${itemId}`,
      {
        method: "PUT",
        data,
        requiresAuth: true,
      }
    );
  },

  // Delete an item in a prescription
  deletePrescriptionItem: async (
    itemId: number
  ): Promise<CommonMessageResponse> => {
    return await apiRequest<CommonMessageResponse>(
      `${baseUrl}/Prescription/items/${itemId}`,
      {
        method: "DELETE",
        requiresAuth: true,
      }
    );
  },
};
