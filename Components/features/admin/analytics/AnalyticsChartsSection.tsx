"use client";

import LineChart from "@/Components/common/charts/LineChart";
import PieChart from "@/Components/common/charts/PieChart";
import { 
  DailyRevenueReport, 
  DailyRegistrationReport, 
  SpecialtyDoctorCount,
  DoctorRegistrationStatusReport,
  DailyOrdersReport,
  DailyAppointmentsReport,
  PharmacistRegistrationStatusReport
} from "@/types";

interface AnalyticsChartsSectionProps {
  revenueData: DailyRevenueReport[];
  registrationData: DailyRegistrationReport[];
  specialtyData: SpecialtyDoctorCount[];
  statusData: DoctorRegistrationStatusReport[];
  pharmacistStatusData: PharmacistRegistrationStatusReport[];
  ordersData: DailyOrdersReport[];
  appointmentsData: DailyAppointmentsReport[];
  loading: boolean;
}

export const AnalyticsChartsSection = ({
  revenueData,
  registrationData,
  specialtyData,
  statusData,
  pharmacistStatusData,
  ordersData,
  appointmentsData,
  loading,
}: AnalyticsChartsSectionProps) => {
  const revenueChartLines = [
    { dataKey: "doctorRevenue", name: "Doctor Revenue", color: "#3B82F6" },
    { dataKey: "pharmacistRevenue", name: "Pharmacy Revenue", color: "#10B981" },
    { dataKey: "totalRevenue", name: "Total Revenue", color: "#F59E0B" },
  ];

  const registrationChartLines = [
    { dataKey: "doctorCount", name: "Doctors", color: "#3B82F6" },
    { dataKey: "pharmacistCount", name: "Pharmacists", color: "#10B981" },
    { dataKey: "totalCount", name: "Total", color: "#F59E0B" },
  ];

  const statusChartLines = [
    { dataKey: "pendingCount", name: "Pending", color: "#F59E0B" },
    { dataKey: "approvedCount", name: "Approved", color: "#10B981" },
    { dataKey: "rejectedCount", name: "Rejected", color: "#EF4444" },
  ];

  const orderChartLines = [
    { dataKey: "confirmedCount", name: "Confirmed", color: "#3B82F6" },
    { dataKey: "deliveredCount", name: "Delivered", color: "#10B981" },
    { dataKey: "cancelledCount", name: "Cancelled", color: "#EF4444" },
    { dataKey: "totalCount", name: "Total", color: "#F59E0B" },
  ];

  const appointmentChartLines = [
    { dataKey: "confirmedCount", name: "Confirmed", color: "#3B82F6" },
    { dataKey: "completedCount", name: "Completed", color: "#10B981" },
    { dataKey: "cancelledCount", name: "Cancelled", color: "#EF4444" },
    { dataKey: "totalCount", name: "Total", color: "#F59E0B" },
  ];

  const formatDate = (date: string) => 
    new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

  const formattedRevenueData = revenueData.map(item => ({
    ...item,
    formattedDate: formatDate(item.date)
  }));

  const formattedRegistrationData = registrationData.map(item => ({
    ...item,
    formattedDate: formatDate(item.date)
  }));

  const formattedStatusData = statusData.map(item => ({
    ...item,
    formattedDate: formatDate(item.date)
  }));

  const formattedPharmacistStatusData = pharmacistStatusData.map(item => ({
    ...item,
    formattedDate: formatDate(item.date)
  }));

  const formattedOrdersData = ordersData.map(item => ({
    ...item,
    formattedDate: formatDate(item.date)
  }));

  const formattedAppointmentsData = appointmentsData.map(item => ({
    ...item,
    formattedDate: formatDate(item.date)
  }));

  const formattedSpecialtyData = specialtyData
    .filter(item => item.doctorCount > 0) // Only show specialties with doctors for cleaner pie
    .map(item => ({
      name: item.specialtyName,
      value: item.doctorCount
    }));

  return (
    <div className="relative space-y-8">
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-[1px] rounded-2xl">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <span className="text-sm font-medium text-gray-500">Fetching reports...</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart
          data={formattedRevenueData}
          title="Revenue Performance"
          lines={revenueChartLines}
          xAxisKey="formattedDate"
          height="h-[450px]"
        />
        <LineChart
          data={formattedRegistrationData}
          title="Registration Trends"
          lines={registrationChartLines}
          xAxisKey="formattedDate"
          height="h-[450px]"
        />
        <LineChart
          data={formattedStatusData}
          title="Doctor Request Status"
          lines={statusChartLines}
          xAxisKey="formattedDate"
          height="h-[450px]"
        />
        <LineChart
          data={formattedPharmacistStatusData}
          title="Pharmacist Request Status"
          lines={statusChartLines}
          xAxisKey="formattedDate"
          height="h-[450px]"
        />
        <PieChart
          data={formattedSpecialtyData}
          title="Doctor Specialty Distribution"
          dataKey="value"
          nameKey="name"
          height="h-[450px]"
          legendPosition="right"
        />
        <LineChart
          data={formattedOrdersData}
          title="Pharmacy Orders Status"
          lines={orderChartLines}
          xAxisKey="formattedDate"
          height="h-[450px]"
        />
        <LineChart
          data={formattedAppointmentsData}
          title="Clinics Appointments Status"
          lines={appointmentChartLines}
          xAxisKey="formattedDate"
          height="h-[450px]"
        />
      </div>
    </div>
  );
};
