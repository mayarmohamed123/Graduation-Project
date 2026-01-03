import { Notification, NotificationType } from "@/types";
import { Calendar, CheckCircle, XCircle, Clock, Package, AlertTriangle, PackageX } from "lucide-react";
import { formatDistanceToNow, differenceInDays } from "date-fns";

interface NotificationCardProps {
  notification: Notification;
  onClick?: (id: number) => void;
}

export default function NotificationCard({ notification, onClick }: NotificationCardProps) {
  function normalizeNotificationType(type?: string): NotificationType {
    if (!type) return "newOrderForPharmacist";

    const normalized =
      type.charAt(0).toLowerCase() + type.slice(1);

    return normalized as NotificationType;
  }

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "newAppointmentForDoctor":
        return { icon: Calendar, bg: "bg-purple-100", color: "text-purple-600" };
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
      case "newOrderForPharmacist":
        return { icon: Package, bg: "bg-green-100", color: "text-green-600" };
      case "inventoryLowStock":
        return { icon: AlertTriangle, bg: "bg-orange-100", color: "text-orange-600" };
      case "inventoryOutOfStock":
        return { icon: PackageX, bg: "bg-red-100", color: "text-red-600" };
      default:
        return { icon: Calendar, bg: "bg-gray-100", color: "text-gray-600" };
    }
  };

  const getNotificationBg = (type: NotificationType) => {
    switch (type) {
      case "newAppointmentForDoctor":
        return "bg-purple-50";
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
      case "newOrderForPharmacist":
        return "bg-green-50/50";
      case "inventoryLowStock":
        return "bg-orange-50/50";
      case "inventoryOutOfStock":
        return "bg-red-50/50";
      default:
        return "bg-gray-50";
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const daysDiff = differenceInDays(now, date);

    if (daysDiff >= 7 && daysDiff < 30) {
      const weeks = Math.floor(daysDiff / 7);
      return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
    }

    return formatDistanceToNow(date, { addSuffix: true, includeSeconds: true });
  };
  const safeType = normalizeNotificationType(notification.type);


  const { icon: Icon, bg, color } = getNotificationIcon(safeType);
  const bgClass = getNotificationBg(safeType);

  return (
    <div
      onClick={() => onClick && onClick(notification.id)}
      className={`${bgClass} rounded-xl p-4 flex gap-4 items-start hover:shadow-md transition-shadow cursor-pointer`}
    >
      {/* Icon */}
      <div className={`${bg} rounded-full p-3 flex-shrink-0`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-semibold text-gray-900 mb-1">
            {notification.title}
          </h3>
          <span className="text-xs text-gray-500 whitespace-nowrap mt-1">
            {formatTimeAgo(notification.createdAt)}
          </span>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          {notification.message}
        </p>
      </div>

      {/* Unread indicator */}
      {!notification.isRead && (
        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2"></div>
      )}
    </div>
  );
}
