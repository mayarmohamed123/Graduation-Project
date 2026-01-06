export interface AdminDoctor {
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
  doctorImage: string | null;
  city: string;
  postalCode: string | null;
  country: string;
  street: string;
  latitude: number | null;
  longitude: number | null;
  countPatient: number;
  countReviews: number;
  countFavourite: number;
}
