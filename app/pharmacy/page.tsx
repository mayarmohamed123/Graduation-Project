"use client";

import React from "react";
import { StatisticsCard } from "@/Components/features/doctor";
import { Package, ShoppingCart, TrendingUp } from "lucide-react";

export default function PharmacyDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Pharmacy Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome back! Here&apos;s an overview of your pharmacy&apos;s performance today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatisticsCard
          title="Total Medicines"
          value="1,248"
          trend="+5%"
          trendDirection="up"
          icon={<Package className="w-6 h-6 text-[#2BBBC5]" />}
          bgColor="bg-teal-50"
        />
        <StatisticsCard
          title="Active Orders"
          value="42"
          trend="+12%"
          trendDirection="up"
          icon={<ShoppingCart className="w-6 h-6 text-blue-600" />}
          bgColor="bg-blue-50"
        />
        <StatisticsCard
          title="Daily Revenue"
          value="$2,450"
          trend="+8%"
          trendDirection="up"
          icon={<TrendingUp className="w-6 h-6 text-green-600" />}
          bgColor="bg-green-50"
        />
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Pharmacy Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Order #12345 received</p>
              <p className="text-sm text-gray-500">2 minutes ago</p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">New</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Low stock alert: Paracetamol</p>
              <p className="text-sm text-gray-500">1 hour ago</p>
            </div>
            <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">Warning</span>
          </div>
        </div>
      </div>
    </div>
  );
}
