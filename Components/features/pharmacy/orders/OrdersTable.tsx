import { PharmacistOrder } from "@/types";
import { useRouter } from "next/navigation";
import { OrderRow } from "./OrderRow";

interface OrdersTableProps {
    orders: PharmacistOrder[];
    onAccept: (orderId: number) => void;
    onCancel: (orderId: number) => void;
    onMarkDelivered: (orderId: number) => void;
    actionLoading: number | null;
    hideDetails?: boolean;
}

export default function OrdersTable({
    orders,
    onAccept,
    onCancel,
    onMarkDelivered,
    actionLoading,
    hideDetails = false,
}: OrdersTableProps) {
    const router = useRouter();

    const handleRowClick = (orderId: number) => {
        router.push(`/pharmacy/orders/${orderId}`);
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
                            {!hideDetails && <th className="px-6 py-3 text-left text-sm font-semibold"></th>}
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
                                hideDetails={hideDetails}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
