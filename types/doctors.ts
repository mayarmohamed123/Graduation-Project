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
  clinicId: number;
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
  countPatient: number;
  countReviews: number;
  countFavourite: number;
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

export interface AppointmentResponse {
  message: string;
  appointment: {
    userId: string;
    doctorId: number;
    clinicId: number;
    startAt: string; // ISO date string
    endAt: string; // ISO date string
  };
}
export interface BookAppointmentData {
  doctorId: number;
  clinicId: number;
  startAt: string; // ISO
  endAt: string; // ISO
}

export interface Review {
  id: number;
  userName: string;
  image: null | string;
  rating: number;
  comment: string;
  userEmail: string;
}
