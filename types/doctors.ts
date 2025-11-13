// types/doctor.ts
export interface Doctor {
  id: number;
  email: string;
  specialty: string;
  isApproved: boolean;
  gender: "male" | "female";
  consultationPrice: number;
  consultationType: "inClinic" | "homeVisit";
  clinicName: string;
  clinicPhone: string;
  clinicImagePath: string;
  doctorImage: string | null;
  city: string;
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
