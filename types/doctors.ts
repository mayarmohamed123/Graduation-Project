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
    id: number;
    userId: string;
    doctorId: number;
    clinicId: number;
    doctorName: string;
    userName: string;
    clinicName: string;
    status: string;
    startAt: string; // ISO date string
    endAt: string; // ISO date string
  };
}

export interface AppointmentSlot {
  startAt: string; // ISO date string e.g. "2025-12-21T10:00:00"
  endAt: string; // ISO date string e.g. "2025-12-21T10:30:00"
  isActive: boolean;
}
export interface BookAppointmentData {
  doctorId: number;
  clinicId: number;
  startAt: string; // ISO
  endAt: string; // ISO
}

export interface ReviewAuthor {
  id: string;
  email: string;
  userName: string;
  phoneNumber: string | null;
  profileImage: string | null;
  address: string | null;
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  user: ReviewAuthor;
}

export interface CreateSessionResponse {
  message: string;
  sessionUrl: string;
  sessionId: string;
}

export interface VerifySessionResponse {
  status: string;
  sessionId: string;
  paymentIntentId: string;
  message: string;
}

export interface PatientAppointment {
  appointmentId: number;
  patientName: string;
  patientPhone: string;
  patientAge: number;
  patientId: string;
  patientGender: string;
  startAt: string;
  endAt: string;
  status: string;
  isPaid: boolean;
  clinicName: string;
}
export interface AnalyticsAppointments {
  date: string;
  appointmentsCount: number;
}

export interface AnalyticsRevenue {
  date: string;
  totalRevenue: number;
}

export interface AnalyticsGender {
  male: number;
  female: number;
}

export interface AnalyticsAge {
  range: string;
  count: number;
}

export interface AnalyticsStatus {
  date: string;
  confirmed: number;
  cancelled: number;
}

export interface AnalyticsPatientRetention {
  weekStart: string;
  newPatients: number;
  returningPatients: number;
}

export interface Clinic {
  id: number;
  name: string;
  phone: string;
  imagePath: string;
  addressId: number;
  city: string;
  street: string;
  country: string;
  postalCode: string;
  latitude: number;
  longitude: number;
}

export interface DoctorAvailability {
  id: number;
  dayOfWeek: string | number;
  startTime: string;
  endTime: string;
  slotDurationInMinutes: number;
}

export interface CreateAvailabilityData {
  DayOfWeek: number;
  StartTime: string;
  EndTime: string;
}

export interface UpdateAvailabilityData {
  DayOfWeek: number;
  StartTime: string;
  EndTime: string;
}
