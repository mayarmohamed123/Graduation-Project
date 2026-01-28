import React from "react";
import { PharmacistOrder } from "@/types";
import { ChevronRight } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { OrderActions } from "./OrderActions";

interface OrderRowProps {
    order: PharmacistOrder;
    onAccept: (orderId: number) => void;
    onCancel: (orderId: number) => void;
    onMarkDelivered: (orderId: number) => void;
    onRowClick: (orderId: number) => void;
    actionLoading: number | null;
    hideDetails: boolean;
}

export const OrderRow: React.FC<OrderRowProps> = ({
    order,
    onAccept,
    onCancel,
    onMarkDelivered,
    onRowClick,
    actionLoading,
    hideDetails,
}) => {
    return (
        <tr 
            className={`${hideDetails ? '' : 'hover:bg-gray-50 cursor-pointer'} transition-colors`}
            onClick={() => !hideDetails && onRowClick(order.id)}
        >
            <td className="px-6 py-4 text-sm text-teal-600 font-medium">#{order.id}</td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-900">{order.userName}</span>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="text-sm text-gray-700">
                    {order.items.map((item, idx) => (
                        <div key={idx}>
                            {item.medicationName}({item.quantity})
                        </div>
                    ))}
                </div>
            </td>
            <td className="px-6 py-4">
                <StatusBadge status={order.status} variant="status" />
            </td>
            <td className="px-6 py-4">
                <StatusBadge status={order.paymentStatus} variant="payment" />
            </td>
            <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                {order.totalPrice}
            </td>
            <td className="px-6 py-4 text-sm text-gray-600">
                {new Date(order.createdAt).toLocaleDateString()}
            </td>
            <td className="px-6 py-4">
                <OrderActions
                    order={order}
                    onAccept={onAccept}
                    onCancel={onCancel}
                    onMarkDelivered={onMarkDelivered}
                    actionLoading={actionLoading}
                />
            </td>
            {!hideDetails && (
                <td className="px-6 py-4">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onRowClick(order.id);
                        }}
                        className="text-gray-400 hover:text-primary transition-colors"
                        title="View Details"
                    >
                        <ChevronRight className="w-5 h-5 text-primary" />
                    </button>
                </td>
            )}
        </tr>
    );
};
