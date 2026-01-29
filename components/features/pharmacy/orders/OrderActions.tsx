import React from "react";
import { PharmacistOrder } from "@/types";
import { CheckCircle, XCircle } from "lucide-react";

interface OrderActionsProps {
    order: PharmacistOrder;
    onAccept: (orderId: number) => void;
    onCancel: (orderId: number) => void;
    onMarkDelivered: (orderId: number) => void;
    actionLoading: number | null;
}

export const OrderActions: React.FC<OrderActionsProps> = ({
    order,
    onAccept,
    onCancel,
    onMarkDelivered,
    actionLoading,
}) => {
    if (order.status === "Confirmed") {
        return (
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onMarkDelivered(order.id);
                }}
                disabled={actionLoading === order.id}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {actionLoading === order.id ? "..." : "Mark as Delivered"}
            </button>
        );
    }

    if (order.status === "Pending") {
        return (
            <div className="flex gap-2">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onAccept(order.id);
                    }}
                    disabled={actionLoading === order.id}
                    className="bg-teal-500 hover:bg-teal-600 text-white p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Accept Order"
                >
                    <CheckCircle className="w-5 h-5" />
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onCancel(order.id);
                    }}
                    disabled={actionLoading === order.id}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Cancel Order"
                >
                    <XCircle className="w-5 h-5" />
                </button>
            </div>
        );
    }

    return <span className="text-gray-400 text-sm">-</span>;
};
