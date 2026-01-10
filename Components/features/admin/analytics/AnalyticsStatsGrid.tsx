"use client";

import { 
  DollarSign, 
  UserCheck, 
  Users, 
  Building2 
} from "lucide-react";
import StatisticsCard from "@/Components/features/doctor/StatisticsCard";
import { AdminOverviewResponse } from "@/types";

interface AnalyticsStatsGridProps {
  analytics: AdminOverviewResponse | null;
}

export const AnalyticsStatsGrid = ({ analytics }: AnalyticsStatsGridProps) => {
  const analyticsCards = [
    {
      title: "Registration Revenue",
      value: `$${analytics?.totalRegistrationRevenue.toLocaleString() || "0"}`,
      icon: <DollarSign className="w-6 h-6 text-emerald-600" />,
      bgColor: "bg-emerald-50",
    },
    {
      title: "Approved Doctors",
      value: analytics?.totalApprovedDoctors || 0,
      icon: <UserCheck className="w-6 h-6 text-blue-600" />,
      bgColor: "bg-blue-50",
    },
    {
      title: "Approved Pharmacists",
      value: analytics?.totalApprovedPharmacists || 0,
      icon: <Building2 className="w-6 h-6 text-purple-600" />,
      bgColor: "bg-purple-50",
    },
    {
      title: "Registered Users",
      value: analytics?.totalRegisteredUsers || 0,
      icon: <Users className="w-6 h-6 text-amber-600" />,
      bgColor: "bg-amber-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {analyticsCards.map((card, index) => (
        <StatisticsCard
          key={index}
          title={card.title}
          value={card.value}
          icon={card.icon}
          bgColor={card.bgColor}
        />
      ))}
    </div>
  );
};
