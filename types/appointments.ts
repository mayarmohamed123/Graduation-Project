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
  yesterdayAppointmentsCount: number;
  yesterdayRevenue: number;
  totalPenddingAppointmentCount: number;
  totalConfirmedAppointmentCount: number;
  totalCancelledAppointmentCount: number;
  totalCompletedAppointmentCount: number;
}

export interface DoctorAppointment {
  id: number;
  doctorId: number;
  doctorAppUserId: string;
  appointmentAmount: number;
  doctorName: string;
  doctorSpeciality: string;
  doctorImage: string;
  userId: string;
  userNameLogged: string;
  userImageLogged: string;
  clinicId: number;
  clinicName: string;
  clinicImage: string;
  patientName: string;
  patientPhone: string;
  patientAge: number;
  patientGender: string;
  startAt: string;
  endAt: string;
  status: string;
}
