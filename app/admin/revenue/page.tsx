"use client";

import { useRevenueData } from "@/components/features/admin/revenue/useRevenueData";
import { RevenueHeader } from "@/components/features/admin/revenue/RevenueHeader";
import { RevenueTabs } from "@/components/features/admin/revenue/RevenueTabs";
import { PaymentsTable } from "@/components/features/admin/revenue/PaymentsTable";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function AdminRevenuePage() {
  const { activeTab, setActiveTab, payments, loading, totalRevenue, refresh } = useRevenueData();

  return (
    <div className="space-y-6">
      <RevenueHeader 
        totalRevenue={totalRevenue} 
        onRefresh={refresh} 
        loading={loading} 
      />

      <RevenueTabs 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      {loading ? (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 min-h-[500px] flex flex-col items-center justify-center gap-6">
          <LoadingSpinner />
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Fetching transaction logs</h3>
            <p className="text-gray-500 text-sm animate-pulse">This may take a few seconds...</p>
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <PaymentsTable payments={payments} />
        </div>
      )}
    </div>
  );
}
