"use client";

import { useState } from "react";
import Image from "next/image";
import { Menu, X, User, ShoppingBag, Calendar, Lock, LogOut, Camera, Droplet, Heart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  Appointments,
  Orders,
  PasswordManagement,
  PersonalInfo,
  MyBloodRequests,
  MyDonations
} from "@/components/features/user";
import PageHeaderWithBack from "@/components/common/PageHeaderWithBack";
import SidebarNav from "@/components/common/SidebarNav";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "react-hot-toast";

export default function ProfilePage() {
  const { logout } = useAuth();
  const {
    profile,
    isLoading,
    fileInputRef,
    handleProfileChange,
    saveProfile,
    uploadPicture,
    triggerFileInput
  } = useProfile();

  const [activeTab, setActiveTab] = useState("personal");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      logout();
    } catch {
      toast.error("Failed to logout");
    }
  };

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadPicture(file);
    }
  };

  const menuItems = [
    { id: "personal", label: "Personal information", icon: User },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "appointments", label: "Appointments", icon: Calendar },
    { id: "password", label: "Password management", icon: Lock },
    { id: "bloodRequests", label: "My blood requests", icon: Droplet },
    { id: "donations", label: "My donations", icon: Heart },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] max-w-7xl mx-auto px-4 md:px-6 overflow-hidden">
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-20 left-4 z-50 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary/90 transition"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className="flex flex-col lg:flex-row h-full">
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-40
            w-80 bg-[#E9F9FA] lg:rounded-3xl shadow-lg p-8 flex flex-col my-0 lg:my-6
            transform transition-transform duration-300 ease-in-out h-full overflow-hidden
            ${
              isMobileMenuOpen
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            }
          `}
        >
          <div className="flex flex-col items-center mb-8 shrink-0">
            <div className="relative w-28 h-28 mb-4 group">
              <Image
                src={profile.image}
                alt="Profile"
                className="rounded-full object-cover"
                fill
                sizes="112px"
                loading="eager"
              />
              <button
                type="button"
                onClick={triggerFileInput}
                className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
              >
                <Camera size={18} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="hidden"
              />
            </div>
            <h2 className="text-lg font-bold text-gray-900">
              {profile.username}
            </h2>
            <p className="text-sm text-gray-500 text-center mt-1">
              {profile.email}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <SidebarNav
              items={menuItems}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onMobileClick={() => setIsMobileMenuOpen(false)}
            />
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg transition w-full mt-auto shrink-0"
          >
            <LogOut size={20} className="text-red-500" />
            <span className="font-medium">Log out</span>
          </button>
        </aside>

        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        <main className="flex-1 lg:pl-8 h-full flex flex-col overflow-hidden">
          <div className="py-8 shrink-0">
            <PageHeaderWithBack title="Profile" />
          </div>

          <div className="max-w-4xl w-full flex-1 min-h-0 pb-4">
            {activeTab === "personal" && (
              <PersonalInfo
                user={profile}
                onChange={handleProfileChange}
                onSave={saveProfile}
              />
            )}

            {activeTab === "orders" && <Orders />}
            {activeTab === "appointments" && <Appointments />}
            {activeTab === "password" && <PasswordManagement />}
            {activeTab === "bloodRequests" && <MyBloodRequests />}
            {activeTab === "donations" && <MyDonations />}
          </div>
        </main>
      </div>
    </div>
  );
}
