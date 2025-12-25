import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { userService } from "@/Services/userService";
import { createNotificationConnection } from "@/Services/notificationHub";
import { Notification } from "@/types";
import { doctorService } from "@/Services/doctorService";
import { HubConnectionState } from "@microsoft/signalr";
import toast from "react-hot-toast";
import React from "react";

export const useNotifications = () => {
  const { isAuthenticated } = useAuth();
  const [appointments, setAppointments] = useState<Notification[]>([]);
  const [orders, setOrders] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await userService.getUserNotifications();
      setAppointments(data.appointments);
      setOrders(data.orders);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      toast.error("Failed to fetch notifications");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleMarkAsRead = useCallback(async (id: number) => {
    // We need to use functional updates to get the latest state without dependency
    setAppointments((prevAppointments) => {
      const appointmentNotif = prevAppointments.find((n) => n.id === id);
      if (appointmentNotif && !appointmentNotif.isRead) {
        // Optimistic update
        const updatedAppointments = prevAppointments.map((n) => 
          n.id === id ? { ...n, isRead: true } : n
        );
        
        // Call API
        doctorService.markNotificationAsRead(id).catch(err => {
           console.error("Failed to mark notification as read:", err);
           // Revert state if needed - but here we'd need to set state again
           toast.error("Failed to update notification status");
        });
        
        return updatedAppointments;
      }
      return prevAppointments;
    });

    setOrders((prevOrders) => {
      const orderNotif = prevOrders.find((n) => n.id === id);
      if (orderNotif && !orderNotif.isRead) {
        const updatedOrders = prevOrders.map((n) => 
          n.id === id ? { ...n, isRead: true } : n
        );
        
        doctorService.markNotificationAsRead(id).catch(err => {
           console.error("Failed to mark notification as read:", err);
           toast.error("Failed to update notification status");
        });
        
        return updatedOrders;
      }
      return prevOrders;
    });
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const connection = createNotificationConnection();

    const handleNotification = (data: Notification) => {
      console.log("🔔 New Notification:", data);

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

      if (data.category === "appointment") {
        setAppointments((prev) => [data, ...prev]);
      } else if (data.category === "order") {
        setOrders((prev) => [data, ...prev]);
      }
    };

    connection.on("ReceiveNotification", handleNotification);

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
    fetchNotifications();

    return () => {
      connection.off("ReceiveNotification", handleNotification);
    };
  }, [isAuthenticated, fetchNotifications]);

  return {
    appointments,
    orders,
    isLoading,
    handleMarkAsRead,
    refetch: fetchNotifications,
  };
};
