export interface BloodRequest {
  id: number;
  requestedByUserId: string;
  requestedByUserName: string | null;
  requiredType: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  hospitalName: string;
  units: number;
  needWithin: string;
  fulfilled: boolean;
  createdAt: string;
}

export type PriorityLevel = "Urgent" | "High" | "Regular";

export interface BloodRequestWithPriority extends BloodRequest {
  priority: PriorityLevel;
}
export interface BloodDonation {
  id: number;
  bloodType: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  donorTelephone: string;
  isAvailable: boolean;
  lastDonationDate: string;
  bloodRequest: BloodRequest;
}

export interface RequestDonor {
  id: number;
  bloodType: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  donorTelephone: string;
  isAvailable: boolean;
  lastDonationDate: string;
}
