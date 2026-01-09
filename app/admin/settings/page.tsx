"use client";

import { useState } from "react";
import { User, Lock, LogOut } from "lucide-react";
import { SidebarNav } from "@/Components/common";
import PersonalInformation from "@/Components/features/admin/settings/PersonalInformation";
import PasswordManagement from "@/Components/features/admin/settings/PasswordManagement";
import { authService } from "@/Services/authService";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("personal");

  const menuItems = [
    { id: "personal", label: "Personal information", icon: User },
    { id: "password", label: "Password management", icon: Lock },
  ];

  const handleLogout = () => {
    authService.logout();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start max-w-7xl mx-auto">
      {/* Sidebar Navigation */}
      <div className="w-full lg:w-80 bg-[#E9F9FA] rounded-3xl p-6 flex flex-col gap-8 shrink-0 min-h-[500px]">
        <SidebarNav
            items={menuItems}
            activeTab={activeTab}
            onTabChange={setActiveTab}
        />
        
        <div className="mt-auto">
             <button 
               onClick={handleLogout}
               className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg transition w-full"
             >
                <LogOut size={20} className="text-red-500" />
                <span className="font-medium">Log out</span>
            </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full">
        {activeTab === "personal" && <PersonalInformation />}
        {activeTab === "password" && <PasswordManagement />}
      </div>
    </div>
  );
}
