// Prescription item interface
export interface PrescriptionItem {
  id: number;
  medicationName: string;
  medicationStrength: string;
  dosage: string;
  quantity: number;
  duration: string;
  notes: string;
}

// Prescription interface
export interface Prescription {
  id: number;
  doctorId: number;
  issuedAt: string;
  items: PrescriptionItem[];
}

// Create prescription item input (without id)
export interface CreatePrescriptionItemInput {
  medicationName: string;
  medicationStrength: string;
  dosage: string;
  quantity: number;
  duration: string;
  notes: string;
}

// Create prescription input
export interface CreatePrescriptionInput {
  userId: string;
  doctorId: number;
  items: CreatePrescriptionItemInput[];
}

// Add item to prescription input
export interface AddPrescriptionItemInput {
  medicationName: string;
  medicationStrength: string;
  dosage: string;
  quantity: number;
  duration: string;
  notes: string;
}

// Response for create prescription
export interface CreatePrescriptionResponse {
  message: string;
}
