"use client";

import React, { useState } from "react";
import { PharmacistOrder, PharmacistOrderStatus, OrdersDashboardResponse } from "@/types";
import { pharmacistService } from "@/Services/pharmacistService";
import OrdersStats from "@/components/features/pharmacy/orders/OrdersStats";
import OrdersTabs from "@/components/features/pharmacy/orders/OrdersTabs";
import OrdersTable from "@/components/features/pharmacy/orders/OrdersTable";
import { useOrderFilters } from "@/components/features/pharmacy/orders/useOrderFilters";
import { useOrderActions } from "@/components/features/pharmacy/orders/useOrderActions";
import { useRouter } from "next/navigation";

type OrderStatusFilter = "All" | PharmacistOrderStatus;

interface OrdersContentProps {
    initialData: {
        orders: PharmacistOrder[];
        stats: OrdersDashboardResponse | null;
    };
}

export default function OrdersContent({ initialData }: OrdersContentProps) {
    const router = useRouter();
    const [orders, setOrders] = useState<PharmacistOrder[]>(initialData.orders);
    const [stats] = useState<OrdersDashboardResponse | null>(initialData.stats);
    const [activeTab, setActiveTab] = useState<OrderStatusFilter>("All");

    const refreshData = async () => {
        router.refresh();
        // Also update local state to reflect changes immediately if needed, 
        // or just rely on router.refresh() if the server component re-renders with fresh data.
        const freshOrders = await pharmacistService.getOrders();
        setOrders(freshOrders);
    };

    const { filteredOrders } = useOrderFilters(orders, activeTab);
    const { actionLoading, handleAcceptOrder, handleCancelOrder, handleMarkAsDelivered } =
        useOrderActions(refreshData);

    if (!stats) {
        return (
            <div className="flex items-center justify-center p-12">
                <p className="text-gray-500">No statistics available</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <OrdersStats stats={stats} />

            <OrdersTabs activeTab={activeTab} onTabChange={setActiveTab} />

            <OrdersTable
                orders={filteredOrders}
                onAccept={handleAcceptOrder}
                onCancel={handleCancelOrder}
                onMarkDelivered={handleMarkAsDelivered}
                actionLoading={actionLoading}
            />
        </div>
    );
}

