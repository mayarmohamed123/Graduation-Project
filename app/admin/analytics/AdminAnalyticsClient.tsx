"use client";

import { useEffect, useState } from "react";
import { adminAnalyticsService } from "@/Services/admin/adminAnalyticsService";
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
import { 
  AnalyticsHeader, 
  AnalyticsStatsGrid, 
  AnalyticsChartsSection 
} from "@/components/features/admin/analytics";

interface AdminAnalyticsClientProps {
  initialData: {
    overview: AdminOverviewResponse | null;
    specialty: SpecialtyDoctorCount[];
    reports: {
      revenue: DailyRevenueReport[];
      registration: DailyRegistrationReport[];
      doctorStatus: DoctorRegistrationStatusReport[];
      pharmacistStatus: PharmacistRegistrationStatusReport[];
      orders: DailyOrdersReport[];
      appointments: DailyAppointmentsReport[];
    };
    month: number;
    year: number;
  };
}

export default function AdminAnalyticsClient({ initialData }: AdminAnalyticsClientProps) {
  const [analytics] = useState<AdminOverviewResponse | null>(initialData.overview);
  const [revenueData, setRevenueData] = useState<DailyRevenueReport[]>(initialData.reports.revenue);
  const [registrationData, setRegistrationData] = useState<DailyRegistrationReport[]>(initialData.reports.registration);
  const [specialtyData] = useState<SpecialtyDoctorCount[]>(initialData.specialty);
  const [statusData, setStatusData] = useState<DoctorRegistrationStatusReport[]>(initialData.reports.doctorStatus);
  const [pharmacistStatusData, setPharmacistStatusData] = useState<PharmacistRegistrationStatusReport[]>(initialData.reports.pharmacistStatus);
  const [ordersData, setOrdersData] = useState<DailyOrdersReport[]>(initialData.reports.orders);
  const [appointmentsData, setAppointmentsData] = useState<DailyAppointmentsReport[]>(initialData.reports.appointments);
  
  const [selectedMonth, setSelectedMonth] = useState(initialData.month);
  const [selectedYear, setSelectedYear] = useState(initialData.year);
  const [reportsLoading, setReportsLoading] = useState(false);

  useEffect(() => {
    // If user changes month/year AFTER initial load, we fetch new data
    if (selectedMonth === initialData.month && selectedYear === initialData.year) return;

    const fetchReports = async () => {
      try {
        setReportsLoading(true);
        const [
          revenueReport, 
          registrationReport, 
          statusReport, 
          pharmacistStatusReport,
          ordersReport, 
          appointmentsReport
        ] = await Promise.all([
          adminAnalyticsService.getDailyRevenueReport(selectedMonth, selectedYear),
          adminAnalyticsService.getDailyRegistrationReport(selectedMonth, selectedYear),
          adminAnalyticsService.getDoctorRegistrationStatusReport(selectedMonth, selectedYear),
          adminAnalyticsService.getPharmacistRegistrationStatusReport(selectedMonth, selectedYear),
          adminAnalyticsService.getDailyOrdersReport(selectedMonth, selectedYear),
          adminAnalyticsService.getDailyAppointmentsReport(selectedMonth, selectedYear)
        ]);
        setRevenueData(revenueReport);
        setRegistrationData(registrationReport);
        setStatusData(statusReport);
        setPharmacistStatusData(pharmacistStatusReport);
        setOrdersData(ordersReport);
        setAppointmentsData(appointmentsReport);
      } catch (error) {
        console.error("Error fetching analytics reports:", error);
      } finally {
        setReportsLoading(false);
      }
    };

    fetchReports();
  }, [selectedMonth, selectedYear, initialData.month, initialData.year]);

  return (
    <div className="space-y-8 pb-10">
      <AnalyticsHeader 
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onMonthChange={setSelectedMonth}
        onYearChange={setSelectedYear}
      />

      <AnalyticsStatsGrid analytics={analytics} />

      <AnalyticsChartsSection 
        revenueData={revenueData}
        registrationData={registrationData}
        specialtyData={specialtyData}
        statusData={statusData}
        pharmacistStatusData={pharmacistStatusData}
        ordersData={ordersData}
        appointmentsData={appointmentsData}
        loading={reportsLoading}
      />
    </div>
  );
}
