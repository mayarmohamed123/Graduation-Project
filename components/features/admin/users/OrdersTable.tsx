"use client";

import { UserOrder } from "@/types/admin";
import { OrderRow } from "./OrderRow";
import { ClipboardList } from "lucide-react";

interface OrdersTableProps {
    orders: UserOrder[];
}

export function OrdersTable({ orders }: OrdersTableProps) {
    if (orders.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ClipboardList className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">No orders found</h3>
                <p className="text-gray-500 max-w-sm mx-auto">This user hasn&apos;t placed any pharmacy orders yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {orders.map((order) => (
                <OrderRow key={order.id} order={order} />
            ))}
        </div>
    );
}
