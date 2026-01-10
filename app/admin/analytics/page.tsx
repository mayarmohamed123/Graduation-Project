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
import { Skeleton } from "@/Components/ui";
import { 
  AnalyticsHeader, 
  AnalyticsStatsGrid, 
  AnalyticsChartsSection 
} from "@/Components/features/admin/analytics";

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AdminOverviewResponse | null>(null);
  const [revenueData, setRevenueData] = useState<DailyRevenueReport[]>([]);
  const [registrationData, setRegistrationData] = useState<DailyRegistrationReport[]>([]);
  const [specialtyData, setSpecialtyData] = useState<SpecialtyDoctorCount[]>([]);
  const [statusData, setStatusData] = useState<DoctorRegistrationStatusReport[]>([]);
  const [pharmacistStatusData, setPharmacistStatusData] = useState<PharmacistRegistrationStatusReport[]>([]);
  const [ordersData, setOrdersData] = useState<DailyOrdersReport[]>([]);
  const [appointmentsData, setAppointmentsData] = useState<DailyAppointmentsReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [reportsLoading, setReportsLoading] = useState(false);
  
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [overviewData, specialtyReport] = await Promise.all([
          adminAnalyticsService.getAdminOverview(),
          adminAnalyticsService.getSpecialtyDoctorCountReport()
        ]);
        setAnalytics(overviewData);
        setSpecialtyData(specialtyReport);
      } catch (error) {
        console.error("Error fetching admin analytics overview:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
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
  }, [selectedMonth, selectedYear]);

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500 text-center">
        <AnalyticsHeader 
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onMonthChange={setSelectedMonth}
          onYearChange={setSelectedYear}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-[450px] w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

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
