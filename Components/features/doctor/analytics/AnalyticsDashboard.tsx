"use client";

import {
    AnalyticsAge,
    AnalyticsAppointments,
    AnalyticsGender,
    AnalyticsRevenue,
    AnalyticsStatus,
} from "@/types/doctors";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { ArrowUpRight, Calendar, CheckCircle, Clock, XCircle } from "lucide-react";

interface AnalyticsDashboardProps {
    appointmentsData: AnalyticsAppointments[];
    revenueData: AnalyticsRevenue[];
    genderData: AnalyticsGender;
    ageData: AnalyticsAge[];
    statusData: AnalyticsStatus[];
}

export default function AnalyticsDashboard({
    appointmentsData,
    revenueData,
    genderData,
    ageData,
    statusData,
}: AnalyticsDashboardProps) {
    // Calculate specific stats for cards
    const today = new Date().toISOString().split("T")[0];
    const todayStats = appointmentsData.find((d) => d.date === today);
    const todayAppointments = todayStats?.appointmentsCount || 0;

    // Calculate totals from status data (last 7 days typically, or whatever range is returned)
    const totalCompleted = statusData.reduce((acc, curr) => acc + curr.confirmed, 0);
    const totalCancelled = statusData.reduce((acc, curr) => acc + curr.cancelled, 0);

    // Placeholder for "Upcoming" as we don't have that specific data point in the provided lists
    const upcomingAppointments = 0;

    const COLORS = ["#0088FE", "#FF8042"]; // Male (Blue), Female (Orange/Pink)

    return (
        <div className="space-y-6">
            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    title="Today's Appointments"
                    value={todayAppointments}
                    icon={<Calendar className="h-6 w-6 text-primary" />}
                    bgColor="bg-teal-50"
                />
                <StatsCard
                    title="Upcoming"
                    value={upcomingAppointments}
                    icon={<Clock className="h-6 w-6 text-yellow-500" />}
                    bgColor="bg-yellow-50"
                />
                <StatsCard
                    title="Completed"
                    value={totalCompleted}
                    icon={<CheckCircle className="h-6 w-6 text-green-500" />}
                    bgColor="bg-green-50"
                />
                <StatsCard
                    title="Cancelled"
                    value={totalCancelled}
                    icon={<XCircle className="h-6 w-6 text-red-500" />}
                    bgColor="bg-red-50"
                />
            </div>

            {/* Row 1: Appointment Trends & Revenue Trends */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-sm border-none">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Appointments Trends</CardTitle>
                            <div className="p-2 bg-gray-100 rounded-full">
                                <ArrowUpRight className="h-4 w-4" />
                            </div>
                        </div>
                        <p className="text-sm text-gray-500">Spend this week</p>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={appointmentsData}>
                                <defs>
                                    <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="date" hide />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="appointmentsCount"
                                    stroke="#14b8a6"
                                    fillOpacity={1}
                                    fill="url(#colorApps)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-none">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Revenue Trends</CardTitle>
                            <div className="p-2 bg-gray-100 rounded-full">
                                <ArrowUpRight className="h-4 w-4" />
                            </div>
                        </div>
                        <p className="text-sm text-gray-500">Spend this week</p>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="date" hide />
                                <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                                <Area
                                    type="monotone"
                                    dataKey="totalRevenue"
                                    stroke="#82ca9d"
                                    fillOpacity={1}
                                    fill="url(#colorRev)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Row 2: Patient Insights & Demographics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Age Distribution */}
                <Card className="shadow-sm border-none">
                    <CardHeader>
                        <CardTitle>Patient Age Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={ageData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="range" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#2DD4BF" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Gender Distribution */}
                <Card className="shadow-sm border-none">
                    <CardHeader>
                        <CardTitle>Patient Demographics (Gender)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: "Male", value: genderData.male },
                                        { name: "Female", value: genderData.female },
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {/* Male Blue, Female Pink/Orange */}
                                    <Cell fill="#3b82f6" />
                                    <Cell fill="#ec4899" />
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Row 3: Report (Confirmed vs Cancelled) */}
            <Card className="shadow-sm border-none">
                <CardHeader>
                    <CardTitle>Report: Completed vs Cancelled</CardTitle>
                </CardHeader>
                <CardContent className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={statusData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="confirmed"
                                name="Completed"
                                stroke="#10b981"
                                strokeWidth={2}
                                dot={{ r: 4 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="cancelled"
                                name="Canceled"
                                stroke="#ef4444"
                                strokeWidth={2}
                                dot={{ r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}

function StatsCard({
    title,
    value,
    icon,
    bgColor,
}: {
    title: string;
    value: number;
    icon: React.ReactNode;
    bgColor: string;
}) {
    return (
        <div className={`p-6 rounded-2xl flex flex-col justify-between ${bgColor} bg-opacity-30`}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-gray-500 font-medium mb-1">{title}</p>
                    <h3 className="text-3xl font-bold">{value}</h3>
                </div>
                <div className="p-2 bg-white rounded-full shadow-sm">{icon}</div>
            </div>
        </div>
    );
}
