"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Camera, Menu, X, MessageSquare, User, ShoppingBag, Calendar, Lock, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import {
  profile2UserIcon,
} from "@/assets";
import { useUser } from "@/hooks/useUser";
import { toast } from "react-hot-toast";
import { userService } from "@/services/userService";
import Appointments from "@/components/features/user/Appointments";
import Orders from "@/components/features/user/Orders";
import PasswordManagement from "@/components/features/user/PasswordManagement";
import PersonalInfo from "@/components/features/user/PersonalInfo";
import Chat from "@/components/features/chat/Chat";
import PageHeaderWithBack from "@/components/common/PageHeaderWithBack";
import type { UserProfileForm } from "@/types";

export default function ProfilePage() {
  const { user: userData, isLoading, refetchUser } = useUser();
  const [user, setUser] = useState<UserProfileForm>({
    username: "",
    email: "",
    phone: "",
    address: "",
    image: profile2UserIcon,
  });

  const [activeTab, setActiveTab] = useState("personal");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    refetchUser();
  }, [refetchUser]);

  useEffect(() => {
    if (userData) {
      Promise.resolve().then(() => {
        setUser({
          username: userData.userName || "",
          email: userData.email || "",
          phone: userData.phoneNumber || "",
          address: userData.address || "",
          image: userData.profileImage
            ? `${userData.profileImage}`
            : profile2UserIcon,
        });
      });
    }
  }, [userData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      // Call the API to update user data
      const response = await userService.updateProfile({
        userName: user.username,
        email: user.email,
        address: user.address,
        phoneNumber: user.phone,
      });

      // Show success toast with the message from API response
      toast.success(response.message);

      // Refetch user data to update UI
      await refetchUser();
    } catch (error) {
      // Show error toast with error message
      toast.error(error instanceof Error ? error.message : "Failed to update profile");
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleProfilePictureChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (e.g., max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    try {
      // Upload profile picture (API handles both upload and update via same endpoint now)
      const response = await userService.uploadProfilePicture(file);

      // Show success toast with message from API
      toast.success(response.message);

      // Update local preview
      const imageUrl = URL.createObjectURL(file);
      setUser({ ...user, image: imageUrl });

      // Refetch user data to get the updated profile image from server
      await refetchUser();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile picture"
      );
    }
  };

  const menuItems = [
    { id: "personal", label: "Personal information", icon: User },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "appointments", label: "Appointments", icon: Calendar },
    { id: "password", label: "Password management", icon: Lock },
  ];

  const handleLogout = async () => {
    try {
      await signOut({ redirect: true, callbackUrl: "/" });
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

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
    <div className="min-h-screen max-w-7xl mx-auto px-4 md:px-6">
      <PageHeaderWithBack title="Profile" />
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-20 left-4 z-50 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary/90 transition">
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Sidebar - Hidden on mobile, slide-in drawer on mobile */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-40
            w-80 bg-[#E9F9FA] rounded-none lg:rounded-3xl shadow-lg p-8 flex flex-col my-0 lg:mb-10
            transform transition-transform duration-300 ease-in-out
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}>
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-28 h-28 mb-4 group">
              <Image
                src={user.image}
                alt="Profile"
                className="rounded-full object-cover"
                fill
                sizes="112px"
                loading="eager"
              />
              <button
                type="button"
                onClick={handleCameraClick}
                className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition">
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
            <h2 className="text-lg font-bold text-gray-900">{user.username}</h2>
            <p className="text-sm text-gray-500 text-center mt-1">{user.email}</p>
          </div>

          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false); // Close mobile menu on selection
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive
                    ? "bg-primary text-white border-l-4 border-primary"
                    : "text-gray-700 hover:bg-gray-100"
                    }`}>
                  <IconComponent
                    size={20}
                    className={isActive ? "text-white" : "text-gray-700"}
                  />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg transition w-full">
            <LogOut size={20} className="text-red-500" />
            <span className="font-medium">Log out</span>
          </button>
        </aside>

        {/* Overlay for mobile menu */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}

        <main className="flex-1 p-4 md:p-8 pt-20 lg:pt-8">
          <div className="max-w-4xl">
            {activeTab === "personal" && (
              <PersonalInfo
                user={user}
                onChange={handleChange}
                onSave={handleSave}
              />
            )}

            {activeTab === "orders" && <Orders />}

            {activeTab === "appointments" && <Appointments />}

            {activeTab === "password" && <PasswordManagement />}
          </div>
        </main>
      </div>
    </div>
  );
}
