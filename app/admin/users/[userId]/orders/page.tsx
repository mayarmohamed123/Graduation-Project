"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { UserOrder } from "@/types/admin";
import { adminService } from "@/Services/admin/adminService";
import { OrdersTable } from "@/Components/features/admin/users/OrdersTable";
import LoadingSpinner from "@/Components/common/LoadingSpinner";
import { ArrowLeft, RefreshCw, AlertCircle, ShoppingBag } from "lucide-react";
import { toast } from "react-hot-toast";

export default function UserOrdersPage() {
    const params = useParams();
    const router = useRouter();
    const userId = params?.userId as string;

    const [orders, setOrders] = useState<UserOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOrders = useCallback(async () => {
        if (!userId) return;

        try {
            setLoading(true);
            const data = await adminService.getUserOrders(userId);
            setOrders(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load orders");
            toast.error("Failed to load user orders");
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2.5 rounded-xl text-gray-600 hover:bg-gray-50 transition-all active:scale-95 "
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <ShoppingBag className="w-6 h-6 text-blue-600" />
                            <h1 className="text-2xl font-bold text-gray-900">User Orders</h1>
                        </div>
                        <p className="text-sm text-gray-500 mt-0.5">Viewing pharmacy order history for user</p>
                    </div>
                </div>

                <button
                    onClick={() => fetchOrders()}
                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all active:scale-95 shadow-sm"
                    disabled={loading}
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh History
                </button>
            </div>

            {loading && orders.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[400px] flex flex-col items-center justify-center gap-4">
                    <LoadingSpinner />
                    <p className="text-gray-500 animate-pulse font-medium">Fetching orders history...</p>
                </div>
            ) : error ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                        <AlertCircle className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Could not load orders</h3>
                    <p className="text-gray-500 max-w-md mb-8">{error}</p>
                    <button
                        onClick={() => fetchOrders()}
                        className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 active:scale-95"
                    >
                        Try Again
                    </button>
                </div>
            ) : (
                <OrdersTable orders={orders} />
            )}
        </div>
    );
}
