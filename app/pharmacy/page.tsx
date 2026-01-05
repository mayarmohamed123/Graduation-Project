"use client";

import React, { useEffect, useState } from "react";
import { StatisticsCard } from "@/Components/features/doctor";
import { 
  ShoppingCart, 
  DollarSign, 
  Store, 
  X, 
  Timer,
  Loader2,
  ArrowRight
} from "lucide-react";
import { PharmacyStatsResponse, PharmacistOrder, BestSellingMedicine, TodaySalesByTime } from "@/types";
import BarChart from "@/Components/common/charts/BarChart";
import LineChart from "@/Components/common/charts/LineChart";
import OrdersTable from "@/Components/features/pharmacy/orders/OrdersTable";
import { useOrderActions } from "@/Components/features/pharmacy/orders/useOrderActions";
import Link from "next/link";
import { Button } from "@/Components/ui/button";
import { pharmacyService } from "@/Services/pharmaciesServices";
import { pharmacistService } from "@/Services/pharmacistService";

export default function PharmacyDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState<PharmacyStatsResponse | null>(null);
  const [recentOrders, setRecentOrders] = useState<PharmacistOrder[]>([]);
  const [bestSellers, setBestSellers] = useState<BestSellingMedicine[]>([]);
  const [todaySales, setTodaySales] = useState<TodaySalesByTime[]>([]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, ordersRes, bestSellersRes, todaySalesRes] = await Promise.all([
        pharmacyService.getMyStats(),
        pharmacistService.getOrders(),
        pharmacyService.getBestSellingMedicine(),
        pharmacyService.getTodaySalesByTime()
      ]);
      setStatsData(statsRes);
      // Take the first 5 orders as "recent"
      setRecentOrders(ordersRes.slice(0, 5));
      setBestSellers(bestSellersRes);
      setTodaySales(todaySalesRes);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const { actionLoading, handleAcceptOrder, handleCancelOrder, handleMarkAsDelivered } =
    useOrderActions(fetchDashboardData);

  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? "+100%" : "0%";
    const change = ((current - previous) / previous) * 100;
    return `${change >= 0 ? "+" : ""}${change.toFixed(0)}%`;
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#2BBBC5]" />
      </div>
    );
  }

  const stats = [
    {
      title: "Today's Orders",
      value: statsData?.todayOrders || 0,
      trend: calculateTrend(statsData?.todayOrders || 0, statsData?.yesterdayOrders || 0),
      trendDirection: (statsData?.todayOrders || 0) >= (statsData?.yesterdayOrders || 0) ? "up" : "down" as "up" | "down",
      icon: <ShoppingCart className="w-6 h-6 text-orange-500" />,
      bgColor: "bg-orange-50",
    },
    {
      title: "Today's Revenue",
      value: `$${statsData?.todayRevenue.toLocaleString() || 0}`,
      trend: calculateTrend(statsData?.todayRevenue || 0, statsData?.yesterdayRevenue || 0),
      trendDirection: (statsData?.todayRevenue || 0) >= (statsData?.yesterdayRevenue || 0) ? "up" : "down" as "up" | "down",
      icon: <DollarSign className="w-6 h-6 text-green-600" />,
      bgColor: "bg-green-50",
    },
    {
      title: "Available Stock",
      value: statsData?.availableStock || 0,
      icon: <Store className="w-6 h-6 text-teal-600" />,
      bgColor: "bg-teal-50",
    },
    {
      title: "Out of Stock",
      value: statsData?.outOfStock || 0,
      icon: <X className="w-6 h-6 text-red-600" />,
      bgColor: "bg-red-50",
    },
    {
      title: "Pending Orders",
      value: statsData?.pendingOrders || 0,
      icon: <Timer className="w-6 h-6 text-yellow-600" />,
      bgColor: "bg-yellow-50",
    },
  ];

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Pharmacy Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome back! Here&apos;s an overview of your pharmacy&apos;s performance.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <StatisticsCard
            key={index}
            title={stat.title}
            value={stat.value}
            trend={stat.trend}
            trendDirection={stat.trendDirection}
            icon={stat.icon}
            bgColor={stat.bgColor}
          />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart
          data={bestSellers}
          title="Best Selling Medicines"
          dataKey="sales"
          xAxisKey="name"
          color="#2BBBC5"
          height="h-[350px]"
        />
        <LineChart
          data={todaySales}
          title="Today's Sales Flow"
          xAxisKey="timeSlot"
          height="h-[350px]"
          lines={[
            {
              dataKey: "salesCount",
              name: "Sales",
              color: "#3B82F6",
              strokeWidth: 3,
            },
          ]}
        />
      </div>

      {/* Recent Orders Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 font-outfit">Recent Orders</h2>
          <Button variant="ghost" className="text-primary hover:text-primary/80 group" asChild>
            <Link href="/pharmacy/orders" className="flex items-center gap-2">
              View All Orders 
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
        
        <OrdersTable
          orders={recentOrders}
          onAccept={handleAcceptOrder}
          onCancel={handleCancelOrder}
          onMarkDelivered={handleMarkAsDelivered}
          actionLoading={actionLoading}
        />
      </div>
    </div>
  );
}
