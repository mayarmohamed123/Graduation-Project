import { PharmacistOrder } from "@/types";
import { CheckCircle, XCircle, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface OrdersTableProps {
    orders: PharmacistOrder[];
    onAccept: (orderId: number) => void;
    onCancel: (orderId: number) => void;
    onMarkDelivered: (orderId: number) => void;
    actionLoading: number | null;
}

export default function OrdersTable({
    orders,
    onAccept,
    onCancel,
    onMarkDelivered,
    actionLoading,
}: OrdersTableProps) {
    const router = useRouter();

    const handleRowClick = (orderId: number) => {
        router.push(`/pharmacy/orders/${orderId}`);
    };
    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case "Confirmed":
                return "bg-blue-100 text-blue-700";
            case "Pending":
                return "bg-yellow-100 text-yellow-700";
            case "Delivered":
                return "bg-green-100 text-green-700";
            case "Cancelled":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getPaymentBadgeColor = (status: string) => {
        return status === "Paid"
            ? "bg-green-100 text-green-700"
            : "bg-gray-100 text-gray-700";
    };

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-primary text-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Order ID</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">User Name</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Products Ordered</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Payment Status</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Total Price</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {orders.map((order) => (
                            <OrderRow
                                key={order.id}
                                order={order}
                                onAccept={onAccept}
                                onCancel={onCancel}
                                onMarkDelivered={onMarkDelivered}
                                onRowClick={handleRowClick}
                                actionLoading={actionLoading}
                                getStatusBadgeColor={getStatusBadgeColor}
                                getPaymentBadgeColor={getPaymentBadgeColor}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

interface OrderRowProps {
    order: PharmacistOrder;
    onAccept: (orderId: number) => void;
    onCancel: (orderId: number) => void;
    onMarkDelivered: (orderId: number) => void;
    onRowClick: (orderId: number) => void;
    actionLoading: number | null;
    getStatusBadgeColor: (status: string) => string;
    getPaymentBadgeColor: (status: string) => string;
}

function OrderRow({
    order,
    onAccept,
    onCancel,
    onMarkDelivered,
    onRowClick,
    actionLoading,
    getStatusBadgeColor,
    getPaymentBadgeColor,
}: OrderRowProps) {
    return (
        <tr className="hover:bg-gray-50 cursor-pointer transition-colors">
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
                <span
                    className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(
                        order.status
                    )}`}
                >
                    {order.status}
                </span>
            </td>
            <td className="px-6 py-4">
                <span
                    className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getPaymentBadgeColor(
                        order.paymentStatus
                    )}`}
                >
                    {order.paymentStatus}
                </span>
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
        </tr>
    );
}

interface OrderActionsProps {
    order: PharmacistOrder;
    onAccept: (orderId: number) => void;
    onCancel: (orderId: number) => void;
    onMarkDelivered: (orderId: number) => void;
    actionLoading: number | null;
}

function OrderActions({
    order,
    onAccept,
    onCancel,
    onMarkDelivered,
    actionLoading,
}: OrderActionsProps) {
    if (order.status === "Confirmed") {
        return (
            <button
                onClick={() => onMarkDelivered(order.id)}
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
                    onClick={() => onAccept(order.id)}
                    disabled={actionLoading === order.id}
                    className="bg-teal-500 hover:bg-teal-600 text-white p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Accept Order"
                >
                    <CheckCircle className="w-5 h-5" />
                </button>
                <button
                    onClick={() => onCancel(order.id)}
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
}
