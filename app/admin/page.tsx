"use client";

import { useEffect, useState } from "react";
import { 
  DollarSign, 
  Users, 
  UserPlus, 
  CheckCircle2, 
  XCircle,
  UserCheck,
  Building2
} from "lucide-react";
import { adminService } from "@/Services/admin/adminService";
import { DashboardResponse, TopPerformersResponse } from "@/types";
import StatisticsCard from "@/Components/features/doctor/StatisticsCard";
import BarChart from "@/Components/common/charts/BarChart";
import { Skeleton, Button } from "@/Components/ui";
import { DoctorsTable } from "@/Components/features/admin/doctors/DoctorsTable";
import { PharmaciesTable } from "@/Components/features/admin/pharmacies/PharmaciesTable";
import { 
  getAdminPharmacists, 
  approvePharmacist as approvePharma, 
  rejectPharmacist as rejectPharma, 
  deletePharmacist as deletePharma 
} from "@/Services/admin/pharmacies";
import { AdminDoctor, AdminPharmacist } from "@/types/admin";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [stats, setStats] = useState<DashboardResponse | null>(null);
  const [topPerformers, setTopPerformers] = useState<TopPerformersResponse | null>(null);
  const [pendingDoctors, setPendingDoctors] = useState<AdminDoctor[]>([]);
  const [pendingPharmacists, setPendingPharmacists] = useState<AdminPharmacist[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, performersData, allDoctors, allPharmacists] = await Promise.all([
          adminService.getDashboardStats(),
          adminService.getTopPerformers(),
          adminService.getAllDoctors(),
          getAdminPharmacists(),
        ]);
        setStats(statsData);
        setTopPerformers(performersData);
        
        // Filter and sort pending doctors
        const pendingDocs = allDoctors
          .filter(d => !d.isApproved && !d.isRejected)
          .sort((a, b) => b.id - a.id)
          .slice(0, 3);
        setPendingDoctors(pendingDocs);

        // Filter and sort pending pharmacists
        const pendingPharmas = allPharmacists
          .filter(p => !p.isApproved && !p.isReject)
          .sort((a, b) => b.id - a.id)
          .slice(0, 3);
        setPendingPharmacists(pendingPharmas);
      } catch (error) {
        console.error("Error fetching admin dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateTrend = (today: number, yesterday: number) => {
    if (yesterday === 0) return today > 0 ? { value: "+100%", direction: "up" as const } : null;
    const diff = ((today - yesterday) / yesterday) * 100;
    return {
      value: `${diff > 0 ? "+" : ""}${diff.toFixed(1)}%`,
      direction: diff >= 0 ? ("up" as const) : ("down" as const),
    };
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-[400px] w-full rounded-2xl" />
          <Skeleton className="h-[400px] w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Revenue",
      value: `$${stats?.today.totalRevenue.toLocaleString()}`,
      icon: <DollarSign className="w-6 h-6 text-emerald-600" />,
      bgColor: "bg-emerald-50",
      trend: stats ? calculateTrend(stats.today.totalRevenue, stats.yesterday.totalRevenue) : null,
    },
    {
      title: "Total Registrations",
      value: stats?.today.totalRegistrations || 0,
      icon: <Users className="w-6 h-6 text-blue-600" />,
      bgColor: "bg-blue-50",
      trend: stats ? calculateTrend(stats.today.totalRegistrations, stats.yesterday.totalRegistrations) : null,
    },
    {
      title: "Pending",
      value: stats?.today.pendingRegistrations || 0,
      icon: <UserPlus className="w-6 h-6 text-amber-600" />,
      bgColor: "bg-amber-50",
      trend: stats ? calculateTrend(stats.today.pendingRegistrations, stats.yesterday.pendingRegistrations) : null,
    },
    {
      title: "Approved",
      value: stats?.today.approvedRegistrations || 0,
      icon: <CheckCircle2 className="w-6 h-6 text-green-600" />,
      bgColor: "bg-green-50",
      trend: stats ? calculateTrend(stats.today.approvedRegistrations, stats.yesterday.approvedRegistrations) : null,
    },
    {
      title: "Rejected",
      value: stats?.today.rejectedRegistrations || 0,
      icon: <XCircle className="w-6 h-6 text-red-600" />,
      bgColor: "bg-red-50",
      trend: stats ? calculateTrend(stats.today.rejectedRegistrations, stats.yesterday.rejectedRegistrations) : null,
    },
  ];

  const formatPerformerName = (name: string) => name.split('_')[0];

  const doctorChartData = (topPerformers?.topDoctors || []).map(doc => {
    const cleanedName = formatPerformerName(doc.fullName);
    return {
      name: cleanedName.split(' ')[0], // Use first name for space
      revenue: doc.totalRevenue,
      fullName: cleanedName
    };
  });

  const pharmacyChartData = (topPerformers?.topPharmacists || []).map(pharma => {
    const cleanedName = formatPerformerName(pharma.fullName);
    return {
      name: cleanedName.split(' ')[0],
      revenue: pharma.totalRevenue,
      fullName: cleanedName
    };
  });

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome back, Admin. Here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statCards.map((card, index) => (
          <StatisticsCard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            bgColor={card.bgColor}
            trend={card.trend?.value}
            trendDirection={card.trend?.direction}
          />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart
          data={doctorChartData}
          title="Top Performing Doctors"
          bars={[{ dataKey: "revenue", name: "Revenue", color: "#3B82F6" }]}
          xAxisKey="name"
          height="h-[350px]"
          headerAction={
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserCheck className="w-5 h-5 text-blue-600" />
            </div>
          }
        />
        <BarChart
          data={pharmacyChartData}
          title="Top Performing Pharmacies"
          bars={[{ dataKey: "revenue", name: "Revenue", color: "#10B981" }]}
          xAxisKey="name"
          height="h-[350px]"
          headerAction={
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Building2 className="w-5 h-5 text-emerald-600" />
            </div>
          }
        />
      </div>

      {/* Pending Doctors Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Latest Pending Doctors</h2>
          <Button 
            variant="ghost" 
            className="text-primary hover:text-primary/80"
            onClick={() => router.push('/admin/doctors')}
          >
            View All
          </Button>
        </div>
        <DoctorsTable
          doctors={pendingDoctors}
          loading={loading}
          onApprove={async (id) => {
            try {
              await adminService.approveDoctor(id);
              setPendingDoctors(prev => prev.filter(d => d.id !== id));
              toast.success("Doctor approved successfully");
            } catch {
              toast.error("Failed to approve doctor");
            }
          }}
          onReject={async (id) => {
            try {
              await adminService.rejectDoctor(id);
              setPendingDoctors(prev => prev.filter(d => d.id !== id));
              toast.success("Doctor rejected successfully");
            } catch {
              toast.error("Failed to reject doctor");
            }
          }}
          onDelete={async (id) => {
            try {
              await adminService.deleteDoctor(id);
              setPendingDoctors(prev => prev.filter(d => d.id !== id));
              toast.success("Doctor deleted successfully");
            } catch {
              toast.error("Failed to delete doctor");
            }
          }}
          onViewDetails={() => router.push(`/admin/doctors`)}
        />
      </div>

      {/* Pending Pharmacies Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Latest Pending Pharmacies</h2>
          <Button 
            variant="ghost" 
            className="text-primary hover:text-primary/80"
            onClick={() => router.push('/admin/pharmacies')}
          >
            View All
          </Button>
        </div>
        <PharmaciesTable
          pharmacists={pendingPharmacists}
          loading={loading}
          onApprove={async (id) => {
            try {
              await approvePharma(id);
              setPendingPharmacists(prev => prev.filter(p => p.id !== id));
              toast.success("Pharmacist approved successfully");
            } catch {
              toast.error("Failed to approve pharmacist");
            }
          }}
          onReject={async (id) => {
            try {
              await rejectPharma(id);
              setPendingPharmacists(prev => prev.filter(p => p.id !== id));
              toast.success("Pharmacist rejected successfully");
            } catch {
              toast.error("Failed to reject pharmacist");
            }
          }}
          onDelete={async (id) => {
            try {
              await deletePharma(id);
              setPendingPharmacists(prev => prev.filter(p => p.id !== id));
              toast.success("Pharmacist deleted successfully");
            } catch {
              toast.error("Failed to delete pharmacist");
            }
          }}
          onViewDetails={(pharma) => router.push(`/admin/pharmacies/${pharma.userId}`)}
          onInventoryClick={(pharma) => router.push(`/admin/pharmacies/${pharma.userId}/inventory`)}
          onOrdersClick={(pharma) => router.push(`/admin/pharmacies/${pharma.userId}/orders`)}
        />
      </div>
    </div>
  );
}