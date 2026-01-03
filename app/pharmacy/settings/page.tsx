"use client";

import { useState } from "react";
import { User, Building2, Lock, LogOut } from "lucide-react";
import { SidebarNav } from "@/Components/common";
import PharmacistInformation from "@/Components/features/pharmacy/settings/PharmacistInformation";
import PharmacyInformation from "@/Components/features/pharmacy/settings/PharmacyInformation";
import PasswordManagement from "@/Components/features/user/PasswordManagement";
import { useAuth } from "@/hooks/useAuth";

export default function PharmacySettingsPage() {
  const [activeTab, setActiveTab] = useState("pharmacist");
  const { logout } = useAuth();

  const menuItems = [
    { id: "pharmacist", label: "Pharmacist information", icon: User },
    { id: "pharmacy", label: "Pharmacy information", icon: Building2 },
    { id: "password", label: "Password management", icon: Lock },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start max-w-7xl mx-auto p-6">
      {/* Sidebar Navigation */}
      <div className="w-full lg:w-80 bg-[#E9F9FA] rounded-3xl p-6 flex flex-col gap-8 shrink-0 min-h-[500px]">
        <SidebarNav
          items={menuItems}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="mt-auto">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg transition w-full"
          >
            <LogOut size={20} className="text-red-500" />
            <span className="font-medium">Log out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full">
        {activeTab === "pharmacist" && <PharmacistInformation />}
        {activeTab === "pharmacy" && <PharmacyInformation />}
        {activeTab === "password" && <PasswordManagement />}
      </div>
    </div>
  );
}
