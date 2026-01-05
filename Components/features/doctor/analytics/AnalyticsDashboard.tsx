"use client";

import {
    AnalyticsAge,
    AnalyticsGender,
    AnalyticsStatus,
    AnalyticsPatientRetention,
} from "@/types/doctors";
import { AppointmentStats } from "@/types/appointments";
import { Calendar, DollarSign, Users } from "lucide-react";
import { AreaChart, BarChart, PieChart, LineChart } from "@/Components/common/charts";
import StatisticsCard from "@/Components/features/doctor/StatisticsCard";
import SmartChartWrapper from "@/Components/common/analytics/SmartChartWrapper";
import { doctorService } from "@/Services/doctorService";

interface AnalyticsDashboardProps {
    genderData: AnalyticsGender;
    ageData: AnalyticsAge[];
    statusData: AnalyticsStatus[];
    retentionData: AnalyticsPatientRetention[];
    stats: AppointmentStats;
}

export default function AnalyticsDashboard({
    genderData,
    ageData,
    statusData,
    retentionData,
    stats,
}: AnalyticsDashboardProps) {
    // Calculate specific stats for cards using stats API
    const totalAppointments = stats.totalPenddingAppointmentCount + stats.totalConfirmedAppointmentCount + stats.totalCompletedAppointmentCount;
    const totalRevenue = stats.totalRevenue;
    const totalPatients = stats.totalPatientsCount;

    // Prepare gender data for PieChart

    // Prepare gender data for PieChart
    const genderChartData = [
        { name: "Male", value: genderData.male, color: "#3b82f6" },
        { name: "Female", value: genderData.female, color: "#ec4899" },
    ];

    return (
        <div className="space-y-6">
            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatisticsCard
                    title="Total Appointments"
                    value={totalAppointments}
                    icon={<Calendar className="h-6 w-6 text-primary" />}
                    bgColor="bg-teal-50"
                />
                <StatisticsCard
                    title="Total Revenue"
                    value={`$${totalRevenue.toLocaleString()}`}
                    icon={<DollarSign className="h-6 w-6 text-green-500" />}
                    bgColor="bg-green-50"
                />
                <StatisticsCard
                    title="Total Patients"
                    value={totalPatients}
                    icon={<Users className="h-6 w-6 text-blue-500" />}
                    bgColor="bg-blue-50"
                />
            </div>

            {/* Row 1: Appointment Trends & Revenue Trends */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SmartChartWrapper fetchData={(y: number, m: number) => doctorService.getDailyAppointments(y, m)}>
                    {(data: object[], loading: boolean, filters: React.ReactNode) => (
                        <AreaChart
                            data={data}
                            title="Appointments Trends"
                            subtitle="Daily appointments"
                            dataKey="appointmentsCount"
                            xAxisKey="date"
                            color="#2bbbc5"
                            gradientId="appointmentsGradient"
                            tooltipFormatter={(value) => [`${value ?? 0}`, "Appointments"]}
                            headerAction={filters}
                        />
                    )}
                </SmartChartWrapper>

                <SmartChartWrapper fetchData={(y: number, m: number) => doctorService.getDailyRevenue(y, m)}>
                    {(data: object[], loading: boolean, filters: React.ReactNode) => (
                        <AreaChart
                            data={data}
                            title="Revenue Trends"
                            subtitle="Daily revenue"
                            dataKey="totalRevenue"
                            xAxisKey="date"
                            color="#82ca9d"
                            gradientId="revenueGradient"
                            tooltipFormatter={(value) => [`$${value ?? 0}`, "Revenue"]}
                            headerAction={filters}
                        />
                    )}
                </SmartChartWrapper>
            </div>

            {/* Row 2: Patient Insights & Demographics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BarChart
                    data={ageData}
                    title="Patient Age Distribution"
                    dataKey="count"
                    xAxisKey="range"
                    color="#2DD4BF"
                />
                <PieChart
                    data={genderChartData}
                    title="Patient Demographics (Gender)"
                />
            </div>

            {/* Row 3: Report (Confirmed vs Cancelled) */}
            <LineChart
                data={statusData}
                title="Report: Completed vs Cancelled"
                xAxisKey="date"
                lines={[
                    { dataKey: "confirmed", name: "Completed", color: "#10b981" },
                    { dataKey: "cancelled", name: "Canceled", color: "#ef4444" },
                ]}
            />

            {/* Row 4: Patient Retention */}
            <LineChart
                data={retentionData}
                title="Patient Retention"
                xAxisKey="weekStart"
                lines={[
                    { dataKey: "newPatients", name: "New Patients", color: "#3b82f6" },
                    { dataKey: "returningPatients", name: "Returning Patients", color: "#8b5cf6" },
                ]}
            />
        </div>
    );
}


