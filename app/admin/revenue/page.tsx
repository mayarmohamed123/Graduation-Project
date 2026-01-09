"use client";

import { useEffect, useState, useCallback } from "react";
import { adminService } from "@/Services/admin/adminService";
import { AdminPayment } from "@/types/admin";
import { PaymentsTable } from "@/Components/features/admin/revenue/PaymentsTable";
import LoadingSpinner from "@/Components/common/LoadingSpinner";
import {
  DollarSign,
  ShoppingCart,
  Stethoscope,
  ShieldCheck,
  Building2,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { toast } from "react-hot-toast";

type PaymentType = "orders" | "appointments" | "doctors" | "pharmacists";

export default function AdminRevenuePage() {
  const [activeTab, setActiveTab] = useState<PaymentType>("orders");
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      let data: AdminPayment[] = [];

      switch (activeTab) {
        case "orders":
          data = await adminService.getOrderPayments();
          break;
        case "appointments":
          data = await adminService.getAppointmentPayments();
          break;
        case "doctors":
          data = await adminService.getDoctorRegistrationPayments();
          break;
        case "pharmacists":
          data = await adminService.getPharmacistRegistrationPayments();
          break;
      }

      setPayments(data);
      const total = data.reduce((acc, curr) => acc + curr.amount, 0);
      setTotalRevenue(total);
    } catch (err) {
      console.error("Failed to fetch payments:", err);
      toast.error("Failed to load payment records");
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const tabs = [
    { id: "orders", label: "Pharmacy Orders", icon: ShoppingCart, color: "text-blue-600", bg: "bg-blue-50" },
    { id: "appointments", label: "Appointments", icon: Stethoscope, color: "text-purple-600", bg: "bg-purple-50" },
    { id: "doctors", label: "Doctor Subscriptions", icon: ShieldCheck, color: "text-indigo-600", bg: "bg-indigo-50" },
    { id: "pharmacists", label: "Pharmacist Subscriptions", icon: Building2, color: "text-teal-600", bg: "bg-teal-50" },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Stats Overview */}
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Revenue & Payments</h1>
            <p className="text-gray-500 mt-1">Track all financial transactions across the platform</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Category Revenue</div>
              <div className="text-xl font-bold text-gray-900">EGP {totalRevenue.toLocaleString()}</div>
            </div>
          </div>
          <button
            onClick={fetchPayments}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all active:scale-95 shadow-sm self-center"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Sync Records
          </button>
        </div>
      </div>

      {/* Modern Tab System */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as PaymentType)}
            className={`flex items-center gap-3 p-4 rounded-2xl border transition-all duration-200 group ${activeTab === tab.id
              ? `${tab.bg} border-current shadow-md scale-[1.02] ${tab.color}`
              : "bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm"
              }`}
          >
            <div className={`p-2.5 rounded-xl transition-colors ${activeTab === tab.id ? "bg-white shadow-sm" : "bg-gray-50 text-gray-400 group-hover:bg-gray-100"
              }`}>
              <tab.icon className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className={`text-xs font-bold uppercase tracking-tight mb-0.5 ${activeTab === tab.id ? tab.color : "text-gray-400"
                }`}>{tab.label}</div>
              <div className={`text-[10px] font-medium ${activeTab === tab.id ? "text-gray-600" : "text-gray-300"
                }`}>View category report</div>
            </div>
          </button>
        ))}
      </div>

      {/* Main Content Area */}
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
