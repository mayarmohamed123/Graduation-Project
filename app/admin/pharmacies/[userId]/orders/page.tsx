"use client";

import { useEffect, useState, use, useCallback } from "react";
import { 
    getPharmacistById, 
    getOrdersForPharmacyByUserId,
    acceptOrderAdmin,
    cancelOrderAdmin,
    markOrderDeliveredAdmin
} from "@/Services/admin/pharmacies";
import { AdminPharmacist } from "@/types/admin";
import { PharmacistOrder } from "@/types/pharmacist";
import OrdersTable from "@/components/features/pharmacy/orders/OrdersTable";
import { Activity, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function AdminPharmacyOrdersPage({ params }: { params: Promise<{ userId: string }> }) {
    const { userId } = use(params);
    const router = useRouter();
    const [pharmacist, setPharmacist] = useState<AdminPharmacist | null>(null);
    const [orders, setOrders] = useState<PharmacistOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setErrorMessage(null);
            const pharmacistData = await getPharmacistById(userId);
            setPharmacist(pharmacistData);

            if (pharmacistData) {
                const ordersData = await getOrdersForPharmacyByUserId(userId);
                // Check if ordersData is actually the error string returned by API
                if (typeof ordersData === 'string' && (ordersData as string).includes("not found or does not belong")) {
                    setErrorMessage(ordersData);
                    setOrders([]);
                } else if (Array.isArray(ordersData)) {
                    setOrders(ordersData);
                } else {
                    setOrders([]);
                }
            }
        } catch (error) {
            console.error("Failed to fetch orders:", error);
            // Some APIs return error messages as strings in the body even with non-200 codes
            if (error instanceof Error && error.message.includes("not found or does not belong")) {
                setErrorMessage(error.message);
            } else {
                toast.error("Failed to load orders");
            }
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAccept = async (orderId: number) => {
        try {
            setActionLoading(orderId);
            const message = await acceptOrderAdmin(orderId);
            toast.success(message || "Order accepted successfully");
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: "Confirmed" } : o));
        } catch {
            toast.error("Failed to accept order");
        } finally {
            setActionLoading(null);
        }
    };

    const handleCancel = async (orderId: number) => {
        try {
            setActionLoading(orderId);
            const message = await cancelOrderAdmin(orderId);
            toast.success(message || "Order rejected successfully");
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: "Cancelled" } : o));
        } catch {
            toast.error("Failed to reject order");
        } finally {
            setActionLoading(null);
        }
    };

    const handleMarkDelivered = async (orderId: number) => {
        try {
            setActionLoading(orderId);
            const message = await markOrderDeliveredAdmin(orderId);
            toast.success(message || "Order marked as delivered");
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: "Delivered" } : o));
        } catch {
            toast.error("Failed to mark order as delivered");
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <Activity className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground animate-pulse">Loading orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-10 px-4">
            <div className="flex items-center gap-4">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => router.back()}
                    className="rounded-full"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold font-outfit text-gray-900">
                        {pharmacist?.pharmacyName} Orders
                    </h1>
                    <p className="text-sm text-muted-foreground">Monitor and manage orders for this pharmacy</p>
                </div>
            </div>

            {errorMessage ? (
                <div className="bg-white rounded-xl shadow-sm border p-12 text-center animate-in fade-in zoom-in duration-500">
                    <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                        <Activity className="h-8 w-8 text-red-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Order Access Limited</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                        {errorMessage}
                    </p>
                    <Button 
                        variant="outline" 
                        onClick={() => router.back()}
                        className="mt-6 rounded-xl"
                    >
                        Go Back
                    </Button>
                </div>
            ) : (
                <OrdersTable 
                    orders={orders}
                    onAccept={handleAccept}
                    onCancel={handleCancel}
                    onMarkDelivered={handleMarkDelivered}
                    actionLoading={actionLoading}
                    hideDetails={true}
                />
            )}
        </div>
    );
}
