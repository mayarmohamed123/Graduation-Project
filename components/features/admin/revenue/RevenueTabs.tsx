import React from "react";
import { ShoppingCart, Stethoscope, ShieldCheck, Building2 } from "lucide-react";
import { PaymentType } from "./useRevenueData";

const TABS = [
    { id: "orders", label: "Pharmacy Orders", icon: ShoppingCart, color: "text-blue-600", bg: "bg-blue-50" },
    { id: "appointments", label: "Appointments", icon: Stethoscope, color: "text-purple-600", bg: "bg-purple-50" },
    { id: "doctors", label: "Doctor Subscriptions", icon: ShieldCheck, color: "text-indigo-600", bg: "bg-indigo-50" },
    { id: "pharmacists", label: "Pharmacist Subscriptions", icon: Building2, color: "text-teal-600", bg: "bg-teal-50" },
];

interface RevenueTabsProps {
    activeTab: PaymentType;
    onTabChange: (tab: PaymentType) => void;
}

export const RevenueTabs: React.FC<RevenueTabsProps> = ({ activeTab, onTabChange }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {TABS.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id as PaymentType)}
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
    );
};
