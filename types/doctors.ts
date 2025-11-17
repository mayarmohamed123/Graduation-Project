// types/doctor.ts
export interface Doctor {
  id: number;
  email: string;
  specialty: string;
  isApproved: boolean;
  gender: string;
  averageRating: number;
  username: string;
  consultationPrice: number;
  consultationType: string;
  clinicName: string;
  clinicPhone: string;
  clinicImagePath: string;
  doctorImage: string;
  city: string;
  postalCode: string;
  country: string;
  street: string;
  latitude: number;
  longitude: number;
}

export interface FilterState {
  specialty: string | null;
  name: string;
  gender: "male" | "female" | null;
  consultationType: "inClinic" | "homeVisit" | null;
  sort: "all" | "mostRecommended" | "priceLowToHigh" | "priceHighToLow";
}

export interface ApiFilterParams {
  specialty?: string;
  name?: string;
  gender?: string;
  consultationType?: string;
  sort?: string;
}
