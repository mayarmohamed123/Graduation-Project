"use client";

import { useAppointmentActions } from "@/hooks/useAppointmentActions";
import { AppointmentCard, StatisticsCard } from "@/components/features/doctor";
import NotificationCard from "@/components/common/NotificationCard";
import { AppointmentInfo, AppointmentStats } from "@/types/appointments";
import { Notification, User } from "@/types";
import { Calendar, DollarSign, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface DoctorDashboardClientProps {
  initialData: {
    stats: AppointmentStats | null;
    appointments: AppointmentInfo[];
    notifications: Notification[];
    user: User | null;
  };
}

export default function DoctorDashboardClient({ initialData }: DoctorDashboardClientProps) {
  const router = useRouter();
  const { stats, appointments, notifications, user } = initialData;

  const { handleAccept, handleReject, handleComplete } = useAppointmentActions(() => {
    router.refresh();
  });

  // Calculate trend percentage
  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const appointmentsTrend = stats
    ? calculateTrend(stats.todayAppointmentsCount, stats.yesterdayAppointmentsCount)
    : 0;

  const revenueTrend = stats
    ? calculateTrend(stats.todayRevenue, stats.yesterdayRevenue)
    : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-8">
      {/* Search Header - Optional based on image */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm md:hidden">
        <h1 className="text-xl font-bold text-gray-800">Sehha</h1>
      </div>

      <div className="mt-4 mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Welcome, Dr. {user?.userName}</h1>
        <p className="text-gray-500">Here is your daily activity overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Today's Appointments */}
        <StatisticsCard
          title="Today's Appointments"
          value={stats?.todayAppointmentsCount || 0}
          icon={<Calendar className="w-6 h-6 text-[#2BBBC5]" />}
          bgColor="bg-teal-50"
          trend={`${Math.abs(appointmentsTrend)}%`}
          trendDirection={appointmentsTrend >= 0 ? "up" : "down"}
        />

        {/* Revenue */}
        <StatisticsCard
          title="Today's Revenue"
          value={`$${stats?.todayRevenue || 0}`}
          icon={<DollarSign className="w-6 h-6 text-green-600" />}
          bgColor="bg-green-50"
          trend={`${Math.abs(revenueTrend)}%`}
          trendDirection={revenueTrend >= 0 ? "up" : "down"}
        />

        {/* Total Patients */}
        <StatisticsCard
          title="Total Patients"
          value={stats?.totalPatientsCount || 0}
          icon={<MessageSquare className="w-6 h-6 text-purple-600" />}
          bgColor="bg-purple-50"
        />
      </div>

      {/* Today's Appointments Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Latest Appointments</h2>
          <Link href="/doctor/appointments" className="text-[#2BBBC5] hover:text-[#25a0a9] font-medium">
            See All
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {appointments.length > 0 ? (
            appointments.slice(0, 3).map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onAccept={handleAccept}
                onReject={handleReject}
                onComplete={handleComplete}
              />
            ))
          ) : (
            <p className="text-gray-500 col-span-2 text-center py-8">No appointments found.</p>
          )}
        </div>
      </section>

      {/* Recent Activity Timeline Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Activity Timeline</h2>
          <Link href="/doctor/notifications" className="text-[#2BBBC5] hover:text-[#25a0a9] font-medium">
            See All
          </Link>
        </div>

        <div className="flex flex-col gap-4 bg-white/50 rounded-2xl">
          {notifications.length > 0 ? (
            notifications.slice(0, 4).map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
              />
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">No recent notifications.</p>
          )}
        </div>
      </section>
    </div>
  );
}
