"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { userService } from "@/services/userService";
import { createNotificationConnection } from "@/services/notificationHub";
import { Notification } from "@/types";
import Image from "next/image";
import { notificationEmptyImage } from "@/assets";
import toast from "react-hot-toast";
import PageHeaderWithBack from "@/components/common/PageHeaderWithBack";
import Switch from "@/components/common/Switch";
import NotificationCard from "@/components/common/NotificationCard";
import { HubConnectionState } from "@microsoft/signalr";

type TabType = "appointments" | "orders";

export default function NotificationsPage() {
  const router = useRouter();
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("appointments");
  const [appointments, setAppointments] = useState<Notification[]>([]);
  const [orders, setOrders] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    // 1- Create SignalR connection
    const connection = createNotificationConnection(token);

    // 2- Define notification handler
    const handleNotification = (data: Notification) => {
      console.log("🔔 New Notification:", data);

      // Show toast notification
      toast.success(
        <div>
          <p className="font-semibold">{data.title}</p>
          <p className="text-sm">{data.message}</p>
        </div>,
        {
          duration: 5000,
          position: "top-right",
        }
      );

      // Add to state based on category
      if (data.category === "appointment") {
        setAppointments((prev) => [data, ...prev]);
      } else if (data.category === "order") {
        setOrders((prev) => [data, ...prev]);
      }
    };

    // 3- Listen for notifications
    connection.on("ReceiveNotification", handleNotification);

    // 4- Start connection safely
    const startConnection = async () => {
      if (connection.state === HubConnectionState.Disconnected) {
        try {
          await connection.start();
          console.log("SignalR Connected.");
        } catch (err) {
          console.error("SignalR Connection Error: ", err);
        }
      }
    };

    startConnection();

    // 5- Fetch notifications once
    fetchNotifications();

    // Cleanup: Remove listener but keep connection open (singleton)
    return () => {
      connection.off("ReceiveNotification", handleNotification);
    };
  }, [token]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await userService.getUserNotifications();
      setAppointments(data.appointments);
      setOrders(data.orders);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const currentNotifications = activeTab === "appointments" ? appointments : orders;
  const hasNotifications = currentNotifications.length > 0;

  if (loading) {
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
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
