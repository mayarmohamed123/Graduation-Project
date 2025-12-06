"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { userService } from "@/Services/userService";
import { createNotificationConnection } from "@/Services/notificationHub";
import { Notification, NotificationType } from "@/types";
import { Button } from "@/Components/ui/button";
import PrvButton from "@/Components/shared/prvButton";
import { Calendar, CheckCircle, XCircle, Clock, Package } from "lucide-react";
import Image from "next/image";
import { notificationEmptyImage } from "@/assets";
import toast from "react-hot-toast";

type TabType = "appointments" | "orders";

export default function NotificationsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<TabType>("appointments");
  const [appointments, setAppointments] = useState<Notification[]>([]);
  const [orders, setOrders] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.accessToken) return;

    // 1- Create SignalR connection
    const connection = createNotificationConnection(session.accessToken);

    // 2- Listen for notifications
    connection.on("ReceiveNotification", (data) => {
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
    });

    // 3- Start connection
    connection.start().catch(console.error);

    // 4- Fetch notifications once
    fetchNotifications();

    return () => {
      connection.stop();
    };
  }, [session]);

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

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "appointmentStartingSoon":
        return { icon: Clock, bg: "bg-orange-100", color: "text-orange-600" };
      case "appointmentApproved":
        return { icon: CheckCircle, bg: "bg-green-100", color: "text-green-600" };
      case "orderConfirmed":
        return { icon: CheckCircle, bg: "bg-green-100", color: "text-green-600" };
      case "orderDelivered":
        return { icon: Package, bg: "bg-blue-100", color: "text-blue-600" };
      case "orderCancelled":
        return { icon: XCircle, bg: "bg-red-100", color: "text-red-600" };
      default:
        return { icon: Calendar, bg: "bg-gray-100", color: "text-gray-600" };
    }
  };

  const getNotificationBg = (type: NotificationType) => {
    switch (type) {
      case "appointmentStartingSoon":
        return "bg-orange-50";
      case "appointmentApproved":
        return "bg-green-50";
      case "orderConfirmed":
        return "bg-green-50";
      case "orderDelivered":
        return "bg-blue-50";
      case "orderCancelled":
        return "bg-red-50";
      default:
        return "bg-gray-50";
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
        <div className="max-w-7xl mx-auto px-6 py-10">
             <div className="mb-8 flex">
               <div className="flex gap-3 items-center w-full">
                 <PrvButton />
                 <h3 className="text-4xl font-semibold text-gray-900">Notifications</h3>
               </div>
             </div>
             </div>
      

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setActiveTab("appointments")}
            className={`flex-1 py-3 px-6 rounded-full font-medium transition-all ${
              activeTab === "appointments"
                ? "bg-primary text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Appointments
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex-1 py-3 px-6 rounded-full font-medium transition-all ${
              activeTab === "orders"
                ? "bg-primary text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Medicine Order
          </button>
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
              We'll notify you once we have new notifications.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {currentNotifications.map((notification) => {
              const { icon: Icon, bg, color } = getNotificationIcon(notification.type);
              const bgClass = getNotificationBg(notification.type);

              return (
                <div
                  key={notification.id}
                  className={`${bgClass} rounded-xl p-4 flex gap-4 items-start hover:shadow-md transition-shadow`}
                >
                  {/* Icon */}
                  <div className={`${bg} rounded-full p-3 flex-shrink-0`}>
                    <Icon className={`w-6 h-6 ${color}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {notification.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(notification.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  {/* Unread indicator */}
                  {!notification.isRead && (
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2"></div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
