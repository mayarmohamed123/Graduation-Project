"use client";

import { LucideIcon } from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface SidebarNavProps {
  items: NavItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  onMobileClick?: () => void;
  className?: string;
}

export default function SidebarNav({
  items,
  activeTab,
  onTabChange,
  onMobileClick,
  className = "",
}: SidebarNavProps) {
  return (
    <nav className={`flex-1 space-y-2 ${className}`}>
      {items.map((item) => {
        const IconComponent = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => {
              onTabChange(item.id);
              if (onMobileClick) {
                onMobileClick();
              }
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              isActive
                ? "bg-primary text-white border-l-4 border-primary"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <IconComponent
              size={20}
              className={isActive ? "text-white" : "text-gray-700"}
            />
            <span className="font-medium">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
