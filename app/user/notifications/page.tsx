"use client";

import { useState } from "react";
import Image from "next/image";
import { notificationEmptyImage } from "@/assets";
import PageHeaderWithBack from "@/Components/common/PageHeaderWithBack";
import Switch from "@/Components/common/Switch";
import NotificationCard from "@/Components/common/NotificationCard";
import { useNotifications } from "@/hooks/useNotifications";

type TabType = "appointments" | "orders";

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("appointments");
  const { appointments, orders, isLoading, handleMarkAsRead } = useNotifications();

  const currentNotifications = activeTab === "appointments" ? appointments : orders;
  const hasNotifications = currentNotifications.length > 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <PageHeaderWithBack title="Notifications" />

      <div className="max-w-7xl mx-auto px-4 pb-4">
        {/* Tabs */}
        <div className="mb-6 flex flex-end">
          <Switch
            tabs={[
              { id: "appointments", label: "Appointments" },
              { id: "orders", label: "Medicine Order" },
            ]}
            activeTab={activeTab}
            onTabChange={(id) => setActiveTab(id as TabType)}
          />
        </div>

        {/* Notifications List or Empty State */}
        {!hasNotifications ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-64 h-64 relative mb-6">
              <Image
                src={notificationEmptyImage}
                alt="No notifications"
                fill
                className="object-contain"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Nothing to display here!
            </h2>
            <p className="text-gray-600 text-center max-w-md">
              We&apos;ll notify you once we have new notifications.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {currentNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onClick={handleMarkAsRead}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
