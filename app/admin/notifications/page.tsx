"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { adminService } from "@/Services/admin/adminService";
import { createNotificationConnection } from "@/Services/notificationHub";
import { Notification } from "@/types";
import Image from "next/image";
import { notificationEmptyImage } from "@/assets";
import toast from "react-hot-toast";
import NotificationCard from "@/components/common/NotificationCard";
import { HubConnectionState } from "@microsoft/signalr";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { CheckCheck } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { incrementUnreadCount, decrementUnreadCount, setUnreadCount } from "@/store/slices/notificationSlice";

export default function AdminNotificationsPage() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;

    // 1- Create SignalR connection
    const connection = createNotificationConnection();

    // 2- Define notification handler
    const handleNotification = (data: Notification) => {
      console.log("🔔 New Admin Notification:", data);

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

      setNotifications((prev) => [data, ...prev]);
      dispatch(incrementUnreadCount());
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

    // Cleanup
    return () => {
      connection.off("ReceiveNotification", handleNotification);
    };
  }, [isAuthenticated, dispatch]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAdminNotifications();
      setNotifications(data.notifications);
    } catch (error) {
      console.error("Failed to fetch admin notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    const notification = notifications.find(n => n.id === id);
    if (notification?.isRead) return;

    // Optimistic update
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );

    try {
      await adminService.markNotificationAsRead(id);
      dispatch(decrementUnreadCount());
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      // Revert on error
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, isRead: false } : n)
      );
      toast.error("Failed to update notification status");
    }
  };

  const handleMarkAllAsRead = async () => {
    const unreadCount = notifications.filter(n => !n.isRead).length;
    if (unreadCount === 0) return;

    // Optimistic update
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));

    try {
      await adminService.markAllNotificationsAsRead();
      dispatch(setUnreadCount(0));
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Failed to mark all as read:", error);
      fetchNotifications(); // Revert by fetching
      toast.error("Failed to mark all as read");
    }
  };

  const hasNotifications = notifications.length > 0;
  const hasUnreadNotifications = notifications.some(n => !n.isRead);

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
        <LoadingSpinner />
        <p className="text-gray-500 animate-pulse">Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pb-4">
      <div className="flex justify-between items-center py-6">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        {hasNotifications && hasUnreadNotifications && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-2 transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all as read
          </button>
        )}
      </div>

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
            We&apos;ll notify you when you receive new updates.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onClick={handleMarkAsRead}
            />
          ))}
        </div>
      )}
    </div>
  );
}
