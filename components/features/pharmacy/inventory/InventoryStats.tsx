"use client";

import React from "react";
import { Package, AlertTriangle, XCircle } from "lucide-react";
import { StatisticsCard } from "@/components/features/doctor";

interface InventoryStatsProps {
  totalProducts: number | string;
  lowStockCount: number | string;
  outOfStockCount: number | string;
}

export const InventoryStats = ({ 
  totalProducts, 
  lowStockCount, 
  outOfStockCount 
}: InventoryStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatisticsCard
        title="Total Products"
        value={totalProducts}
        icon={<Package className="w-6 h-6 text-teal-600" />}
        bgColor="bg-white"
      />
      <StatisticsCard
        title="Low Stock Items"
        value={lowStockCount}
        icon={<AlertTriangle className="w-6 h-6 text-amber-500" />}
        bgColor="bg-white"
      />
      <StatisticsCard
        title="Out of Stock"
        value={outOfStockCount}
        icon={<XCircle className="w-6 h-6 text-red-500" />}
        bgColor="bg-white"
      />
    </div>
  );
};
