import { adminAnalyticsService } from "@/Services/admin/adminAnalyticsService";
import AdminAnalyticsClient from "./AdminAnalyticsClient";
import { 
  AdminOverviewResponse, 
  DailyRevenueReport, 
  DailyRegistrationReport,
  SpecialtyDoctorCount,
  DoctorRegistrationStatusReport,
  DailyOrdersReport,
  DailyAppointmentsReport,
  PharmacistRegistrationStatusReport
} from "@/types";

export default async function AdminAnalyticsPage() {
  const currentDate = new Date();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  let overview: AdminOverviewResponse | null = null;
  let specialty: SpecialtyDoctorCount[] = [];
  let revenue: DailyRevenueReport[] = [];
  let registration: DailyRegistrationReport[] = [];
  let doctorStatus: DoctorRegistrationStatusReport[] = [];
  let pharmacistStatus: PharmacistRegistrationStatusReport[] = [];
  let orders: DailyOrdersReport[] = [];
  let appointments: DailyAppointmentsReport[] = [];

  try {
    const [
      overviewData, 
      specialtyReport,
      revenueReport, 
      registrationReport, 
      statusReport, 
      pStatusReport,
      ordersReport, 
      appointmentsReport
    ] = await Promise.all([
      adminAnalyticsService.getAdminOverview(),
      adminAnalyticsService.getSpecialtyDoctorCountReport(),
      adminAnalyticsService.getDailyRevenueReport(month, year),
      adminAnalyticsService.getDailyRegistrationReport(month, year),
      adminAnalyticsService.getDoctorRegistrationStatusReport(month, year),
      adminAnalyticsService.getPharmacistRegistrationStatusReport(month, year),
      adminAnalyticsService.getDailyOrdersReport(month, year),
      adminAnalyticsService.getDailyAppointmentsReport(month, year)
    ]);

    overview = overviewData;
    specialty = specialtyReport;
    revenue = revenueReport;
    registration = registrationReport;
    doctorStatus = statusReport;
    pharmacistStatus = pStatusReport;
    orders = ordersReport;
    appointments = appointmentsReport;
  } catch (error) {
    console.error("Error fetching admin analytics data on server:", error);
  }

  return (
    <AdminAnalyticsClient
      initialData={{
        overview,
        specialty,
        reports: {
          revenue,
          registration,
          doctorStatus,
          pharmacistStatus,
          orders,
          appointments
        },
        month,
        year
      }}
    />
  );
}
