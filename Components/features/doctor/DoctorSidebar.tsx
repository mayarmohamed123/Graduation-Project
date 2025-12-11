"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Calendar,
  MessageSquare,
  Bell,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import { sehhaLogo } from "@/assets";
import { useAuth } from "@/lib/auth";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/doctor" },
  { name: "Patients", icon: Users, href: "/doctor/patients" },
  { name: "Appointments", icon: Calendar, href: "/doctor/appointments" },
  { name: "Messages", icon: MessageSquare, href: "/doctor/messages" },
  { name: "Notifications", icon: Bell, href: "/doctor/notifications" },
  { name: "Analytics", icon: BarChart3, href: "/doctor/analytics" },
  { name: "Settings", icon: Settings, href: "/doctor/settings" },
];

export default function DoctorSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const isActive = (href: string) => {
    if (href === "/doctor") {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  return (
    <aside className="w-64 bg-[#2BBBC5] text-white min-h-screen flex flex-col">
      {/* Logo Section */}
      <div className="p-6 flex items-center gap-3">
        <Image
          src={sehhaLogo}
          alt="Sehha Logo"
          width={40}
          height={40}
          className="rounded-full"
        />
        <span className="text-2xl font-semibold">Sehha</span>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    active
                      ? "bg-white/20 text-white"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}>
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Log out</span>
        </button>
      </div>
    </aside>
  );
}
