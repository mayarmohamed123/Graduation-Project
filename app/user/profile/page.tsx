"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Camera, Eye, EyeOff } from "lucide-react";
import UserIcon from "@/assets/User Rounded.svg";
import OrdersIcon from "@/assets/orders.svg";
import LockIcon from "@/assets/Lock.svg";
import LogoutIcon from "@/assets/Logout 4.svg";
import AppointmentIcon from "@/assets/appointment.svg";
import profileImage from "@/assets/profile-2user.svg";
import { useUser } from "@/hook/useUser";
import { toast } from "react-hot-toast";
import { userService } from "@/Services/userService";
import {
  Appointments,
  Orders,
  PasswordManagement,
  PersonalInfo,
} from "@/Components";
import type { UserProfileForm } from "@/types";

export default function ProfilePage() {
  const { user: userData, isLoading, refetchUser } = useUser();
  const [user, setUser] = useState<UserProfileForm>({
    username: "",
    email: "",
    phone: "",
    address: "",
    image: profileImage,
  });

  const [activeTab, setActiveTab] = useState("personal");

  useEffect(() => {
    if (userData) {
      Promise.resolve().then(() => {
        setUser({
          username: userData.userName || "",
          email: userData.email || "",
          phone: userData.phoneNumber || "",
          address: userData.address || "",
          image: userData.profileImage
            ? `${process.env.NEXT_PUBLIC_API_IMAGE_BASE_URL}${userData.profileImage}`
            : profileImage,
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
      // Check if user has a profile image already
      const hasProfileImage =
        userData?.profileImage && userData.profileImage !== "";

      let response;
      if (hasProfileImage) {
        // Update existing profile picture
        response = await userService.updateProfilePicture(file);
      } else {
        // Upload profile picture for the first time
        response = await userService.uploadProfilePicture(file);
      }

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
    { id: "personal", label: "Personal information", icon: UserIcon },
    { id: "orders", label: "Orders", icon: OrdersIcon },
    { id: "appointments", label: "Appointments", icon: AppointmentIcon },
    { id: "password", label: "Password management", icon: LockIcon },
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
    <div className="flex min-h-screen max-w-7xl m-auto">
      {/* Sidebar */}
      <aside className="w-80 bg-[#E9F9FA] rounded-3xl shadow-lg p-8 flex flex-col my-10 ">
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
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeTab === item.id
                  ? "bg-primary text-white border-l-4 border-primary"
                  : "text-gray-700 hover:bg-gray-100"
              }`}>
              <Image 
                src={item.icon} 
                alt={item.label} 
                width={20} 
                height={20}
                style={{ height: 'auto' }}
              />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <button className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg transition w-full">
          <Image 
            src={LogoutIcon} 
            alt="logout" 
            width={20} 
            height={20}
            style={{ height: 'auto' }}
          />
          <span className="font-medium">Log out</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
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
  );
}
