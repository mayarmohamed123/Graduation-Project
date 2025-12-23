"use client";

import {
    AnalyticsAge,
    AnalyticsAppointments,
    AnalyticsGender,
    AnalyticsRevenue,
    AnalyticsStatus,
    AnalyticsPatientRetention,
} from "@/types/doctors";
import { Calendar, CheckCircle, Clock, XCircle } from "lucide-react";
import { AreaChart, BarChart, PieChart, LineChart } from "@/Components/common/charts";
import StatisticsCard from "@/Components/features/doctor/StatisticsCard";

interface AnalyticsDashboardProps {
    appointmentsData: AnalyticsAppointments[];
    revenueData: AnalyticsRevenue[];
    genderData: AnalyticsGender;
    ageData: AnalyticsAge[];
    statusData: AnalyticsStatus[];
    retentionData: AnalyticsPatientRetention[];
}

export default function AnalyticsDashboard({
    appointmentsData,
    revenueData,
    genderData,
    ageData,
    statusData,
    retentionData,
}: AnalyticsDashboardProps) {
    // Calculate specific stats for cards
    const today = new Date().toISOString().split("T")[0];
    const todayStats = appointmentsData.find((d) => d.date === today);
    const todayAppointments = todayStats?.appointmentsCount || 0;

    // Calculate totals from status data
    const totalCompleted = statusData.reduce((acc, curr) => acc + curr.confirmed, 0);
    const totalCancelled = statusData.reduce((acc, curr) => acc + curr.cancelled, 0);

    // Placeholder for "Upcoming"
    const upcomingAppointments = 0;

    // Prepare gender data for PieChart
    const genderChartData = [
        { name: "Male", value: genderData.male, color: "#3b82f6" },
        { name: "Female", value: genderData.female, color: "#ec4899" },
    ];

    return (
        <div className="space-y-6">
            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatisticsCard
                    title="Today's Appointments"
                    value={todayAppointments}
                    icon={<Calendar className="h-6 w-6 text-primary" />}
                    bgColor="bg-teal-50"
                />
                <StatisticsCard
                    title="Upcoming"
                    value={upcomingAppointments}
                    icon={<Clock className="h-6 w-6 text-yellow-500" />}
                    bgColor="bg-yellow-50"
                />
                <StatisticsCard
                    title="Completed"
                    value={totalCompleted}
                    icon={<CheckCircle className="h-6 w-6 text-green-500" />}
                    bgColor="bg-green-50"
                />
                <StatisticsCard
                    title="Cancelled"
                    value={totalCancelled}
                    icon={<XCircle className="h-6 w-6 text-red-500" />}
                    bgColor="bg-red-50"
                />
            </div>

            {/* Row 1: Appointment Trends & Revenue Trends */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AreaChart
                    data={appointmentsData}
                    title="Appointments Trends"
                    subtitle="Spend this week"
                    dataKey="appointmentsCount"
                    xAxisKey="date"
                    color="#2bbbc5"
                    gradientId="appointmentsGradient"
                />
                <AreaChart
                    data={revenueData}
                    title="Revenue Trends"
                    subtitle="Spend this week"
                    dataKey="totalRevenue"
                    xAxisKey="date"
                    color="#82ca9d"
                    gradientId="revenueGradient"
                    tooltipFormatter={(value) => [`$${value ?? 0}`, "Revenue"]}
                />
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


