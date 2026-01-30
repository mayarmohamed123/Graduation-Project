import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { userService } from "@/Services/userService";
import { createNotificationConnection } from "@/Services/notificationHub";
import { Notification } from "@/types";
import { doctorService } from "@/Services/doctorService";
import { HubConnectionState } from "@microsoft/signalr";
import toast from "react-hot-toast";
import React from "react";
import { useAppDispatch } from "@/store/hooks";
import { incrementUnreadCount, decrementUnreadCount, setUnreadCount } from "@/store/slices/notificationSlice";

export const useNotifications = () => {
  const { isAuthenticated } = useAuth();
  const dispatch = useAppDispatch();
  const [appointments, setAppointments] = useState<Notification[]>([]);
  const [orders, setOrders] = useState<Notification[]>([]);
  const [userBlood, setUserBlood] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await userService.getUserNotifications();
      setAppointments(data.appointments || []);
      setOrders(data.orders || []);
      setUserBlood(data.userBlood || []);
      
      // Sync Redux unread count
      const count = 
        (data.appointments || []).filter(n => !n.isRead).length +
        (data.orders || []).filter(n => !n.isRead).length +
        (data.userBlood || []).filter(n => !n.isRead).length;
      dispatch(setUnreadCount(count));
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      toast.error("Failed to fetch notifications");
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  const handleMarkAsRead = useCallback(async (id: number) => {
    let type: "appointments" | "orders" | "userBlood" | null = null;
    let found = false;

    setAppointments((prev) => {
      const index = prev.findIndex((n) => n.id === id);
      if (index !== -1 && !prev[index].isRead) {
        type = "appointments";
        found = true;
        const next = [...prev];
        next[index] = { ...next[index], isRead: true };
        return next;
      }
      return prev;
    });
    
    if (!found) {
      setOrders((prev) => {
        const index = prev.findIndex((n) => n.id === id);
        if (index !== -1 && !prev[index].isRead) {
          type = "orders";
          found = true;
          const next = [...prev];
          next[index] = { ...next[index], isRead: true };
          return next;
        }
        return prev;
      });
    }

    if (!found) {
      setUserBlood((prev) => {
        const index = prev.findIndex((n) => n.id === id);
        if (index !== -1 && !prev[index].isRead) {
          type = "userBlood";
          found = true;
          const next = [...prev];
          next[index] = { ...next[index], isRead: true };
          return next;
        }
        return prev;
      });
    }

    if (found) {
      try {
        await doctorService.markNotificationAsRead(id);
        dispatch(decrementUnreadCount());
      } catch (err) {
        console.error("Failed to mark notification as read:", err);
        toast.error("Failed to update notification status");
        
        // Revert on failure
        if (type === "appointments") {
          setAppointments(prev => prev.map(n => n.id === id ? { ...n, isRead: false } : n));
        } else if (type === "orders") {
          setOrders(prev => prev.map(n => n.id === id ? { ...n, isRead: false } : n));
        } else if (type === "userBlood") {
          setUserBlood(prev => prev.map(n => n.id === id ? { ...n, isRead: false } : n));
        }
      }
    }
  }, [dispatch]);

  const handleMarkAllAsRead = useCallback(async () => {
    const hasUnread = appointments.some(n => !n.isRead) || orders.some(n => !n.isRead) || userBlood.some(n => !n.isRead);
    if (!hasUnread) return;

    // Optimistic update
    const prevAppointments = [...appointments];
    const prevOrders = [...orders];
    const prevUserBlood = [...userBlood];
    
    setAppointments(prev => prev.map(n => ({ ...n, isRead: true })));
    setOrders(prev => prev.map(n => ({ ...n, isRead: true })));
    setUserBlood(prev => prev.map(n => ({ ...n, isRead: true })));

    try {
      await doctorService.markAllNotificationsAsRead();
      dispatch(setUnreadCount(0));
      toast.success("All notifications marked as read");
    } catch (err) {
      console.error("Failed to mark all as read:", err);
      toast.error("Failed to mark all as read");
      // Revert on failure
      setAppointments(prevAppointments);
      setOrders(prevOrders);
      setUserBlood(prevUserBlood);
    }
  }, [appointments, orders, userBlood, dispatch]);

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
      } else if (data.category === "blood") {
        setUserBlood((prev) => [data, ...prev]);
      }
      
      dispatch(incrementUnreadCount());
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
  }, [isAuthenticated, fetchNotifications, dispatch]);

  return {
    appointments,
    orders,
    userBlood,
    isLoading,
    handleMarkAsRead,
    handleMarkAllAsRead,
    refetch: fetchNotifications,
  };
};
