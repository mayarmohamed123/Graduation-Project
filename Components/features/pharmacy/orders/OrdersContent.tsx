"use client";

import React, { useState, useEffect } from "react";
import { PharmacistOrder, PharmacistOrderStatus, OrdersDashboardResponse } from "@/types";
import { pharmacistService } from "@/Services/pharmacistService";
import OrdersStats from "./OrdersStats";
import OrdersTabs from "./OrdersTabs";
import OrdersTable from "./OrdersTable";
import { useOrderFilters } from "./useOrderFilters";
import { useOrderActions } from "./useOrderActions";

type OrderStatusFilter = "All" | PharmacistOrderStatus;

export default function OrdersContent() {
    const [orders, setOrders] = useState<PharmacistOrder[]>([]);
    const [stats, setStats] = useState<OrdersDashboardResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<OrderStatusFilter>("All");

    const fetchData = async () => {
        try {
            setLoading(true);
            const [ordersData, statsData] = await Promise.all([
                pharmacistService.getOrders(),
                pharmacistService.getOrdersDashboardStats()
            ]);
            setOrders(ordersData);
            setStats(statsData);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrders = async () => {
        try {
            const data = await pharmacistService.getOrders();
            setOrders(data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const { filteredOrders } = useOrderFilters(orders, activeTab);
    const { actionLoading, handleAcceptOrder, handleCancelOrder, handleMarkAsDelivered } =
        useOrderActions(fetchOrders);

    if (loading || !stats) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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

