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
  Package,
  ShoppingCart,
  Stethoscope,
  Building2,
  DollarSign,
  Star,
  Droplet,
} from "lucide-react";
import { healingLogo } from "@/assets";
import { useAuth } from "@/hooks/useAuth";

type Role = "doctor" | "pharmacy" | "admin";

interface DashboardSidebarProps {
  role: Role;
}

export default function DashboardSidebar({ role }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const isActive = (href: string) => {
    return pathname === href || (href !== `/${role}` && pathname?.startsWith(href));
  };

  const doctorMenuItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/doctor" },
    { name: "Patients", icon: Users, href: "/doctor/patients" },
    { name: "Appointments", icon: Calendar, href: "/doctor/appointments" },
    { name: "Messages", icon: MessageSquare, href: "/doctor/messages" },
    { name: "Notifications", icon: Bell, href: "/doctor/notifications" },
    { name: "Analytics", icon: BarChart3, href: "/doctor/analytics" },
    { name: "Reviews", icon: Star, href: "/doctor/reviews" },
    { name: "Settings", icon: Settings, href: "/doctor/settings" },
  ];

  const pharmacyMenuItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/pharmacy" },
    { name: "Inventory", icon: Package, href: "/pharmacy/inventory" },
    { name: "Orders", icon: ShoppingCart, href: "/pharmacy/orders" },
    { name: "Messages", icon: MessageSquare, href: "/pharmacy/messages" },
    { name: "Notifications", icon: Bell, href: "/pharmacy/notifications" },
    { name: "Analytics", icon: BarChart3, href: "/pharmacy/analytics" },
    { name: "Reviews", icon: Star, href: "/pharmacy/reviews" },
    { name: "Settings", icon: Settings, href: "/pharmacy/settings" },
  ];

  const adminMenuItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/admin" },
    { name: "Doctors Management", icon: Stethoscope, href: "/admin/doctors" },
    { name: "Pharmacies Management", icon: Building2, href: "/admin/pharmacies" },
    { name: "User Management", icon: Users, href: "/admin/users" },
    { name: "Blood Management", icon: Droplet, href: "/admin/blood-requests" },
    { name: "Revenue & Payments", icon: DollarSign, href: "/admin/revenue" },
    { name: "Analytics", icon: BarChart3, href: "/admin/analytics" },
    { name: "Messages", icon: MessageSquare, href: "/admin/messages" },
    { name: "Notifications", icon: Bell, href: "/admin/notifications" },
    { name: "Settings", icon: Settings, href: "/admin/settings" },
  ];

  const menuItems = role === "doctor" ? doctorMenuItems : role === "pharmacy" ? pharmacyMenuItems : adminMenuItems;

  return (
    <aside className={`${role === "admin" ? "w-70" : "w-64"} bg-[#2BBBC5] text-white min-h-screen flex flex-col`}>
      {/* Logo Section */}
      <div className="p-2 flex items-center gap-3">
        <Image
          src={healingLogo}
          alt="Healing Logo"
          width={40}
          height={40}
          className="rounded-full"
        />
        <span className="text-2xl font-semibold">Healing</span>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${active
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
