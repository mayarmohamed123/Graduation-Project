export interface AdminOverviewResponse {
  totalRegistrationRevenue: number;
  totalApprovedDoctors: number;
  totalApprovedPharmacists: number;
  totalRegisteredUsers: number;
}

export interface DailyRevenueReport {
  date: string;
  doctorRevenue: number;
  pharmacistRevenue: number;
  totalRevenue: number;
}

export interface DailyRegistrationReport {
  date: string;
  doctorCount: number;
  pharmacistCount: number;
  totalCount: number;
}

export interface SpecialtyDoctorCount {
  specialtyName: string;
  doctorCount: number;
}

export interface DoctorRegistrationStatusReport {
  date: string;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  totalCount: number;
}

export interface DailyOrdersReport {
  date: string;
  pendingCount: number;
  confirmedCount: number;
  deliveredCount: number;
  cancelledCount: number;
  totalCount: number;
}

export interface DailyAppointmentsReport {
  date: string;
  pendingCount: number;
  confirmedCount: number;
  completedCount: number;
  cancelledCount: number;
  totalCount: number;
}

export interface PharmacistRegistrationStatusReport {
  date: string;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  totalCount: number;
}
