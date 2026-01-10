export interface DashboardStats {
  totalRevenue: number;
  doctorRegistrationRevenue: number;
  pharmacistRegistrationRevenue: number;
  totalRegistrations: number;
  doctorRegistrations: number;
  pharmacistRegistrations: number;
  pendingRegistrations: number;
  approvedRegistrations: number;
  rejectedRegistrations: number;
}

export interface DashboardResponse {
  today: DashboardStats;
  yesterday: DashboardStats;
}

export interface TopPerformer {
  fullName: string;
  email: string;
  totalRevenue: number;
}

export interface TopPerformersResponse {
  topDoctors: TopPerformer[];
  topPharmacists: TopPerformer[];
}
