"use client";

import React, { useEffect, useState } from "react";
import { Settings, Bell, ChevronDown, LogOut, User } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function DoctorNavbar() {
  const { logout, user } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Get doctor name from auth context
  const doctorName = user?.userName || "Doctor";
  const doctorImage = "/default-avatar.png";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      // Navigate to search results or filter data
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="w-full px-4 py-2 pl-10 border border-[#2BBBC5] rounded-full outline-none focus:ring-2 focus:ring-[#2BBBC5]/30 text-gray-700"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM18 18l-4-4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </form>

          {/* Right Section: Icons and Profile */}
          <div className="flex items-center gap-3 md:gap-5">
            {/* Settings Icon */}
            <button
              onClick={() => router.push("/doctor/settings")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => router.push("/doctor/notifications")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5 text-gray-600" />
              {/* Notification badge - uncomment if needed */}
              {/* <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span> */}
            </button>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 hover:bg-gray-50 rounded-lg p-1.5 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                  <Image
                    src={doctorImage}
                    alt={doctorName}
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='16' fill='%23e5e7eb'/%3E%3Cpath d='M16 16a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-4.42 0-8 1.79-8 4v2h16v-2c0-2.21-3.58-4-8-4z' fill='%239ca3af'/%3E%3C/svg%3E";
                    }}
                  />
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  {doctorName}
                </span>
                <ChevronDown 
                  className={`w-4 h-4 text-gray-600 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      router.push("/doctor/profile");
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Profile
                  </button>
                  <hr className="my-1" />
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      handleLogout();
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
