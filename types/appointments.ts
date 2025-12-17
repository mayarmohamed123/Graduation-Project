export type AppointmentStatus =
  | "Pending"
  | "Completed"
  | "Cancelled"
  | "Upcoming";

export interface AppointmentInfo {
  id: string;
  patientName: string;
  patientPhone: string;
  patientAge: number;
  patientGender: string;
  startAt: string;
  endAt: string;
  status: string;
}

export interface AppointmentStats {
  todayAppointmentsCount: number;
  totalAppointmentCount: number;
  totalPatientsCount: number;
  todayRevenue: number;
  totalRevenue: number;
  reviewsCount: number;
}
