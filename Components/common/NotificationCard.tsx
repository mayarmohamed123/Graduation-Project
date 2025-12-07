import { Notification, NotificationType } from "@/types";
import { Calendar, CheckCircle, XCircle, Clock, Package } from "lucide-react";

interface NotificationCardProps {
  notification: Notification;
}

export default function NotificationCard({ notification }: NotificationCardProps) {
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

  const { icon: Icon, bg, color } = getNotificationIcon(notification.type);
  const bgClass = getNotificationBg(notification.type);

  return (
    <div
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
}
