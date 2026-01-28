export const dynamic = "force-dynamic";

import { Suspense } from "react";
import OrdersContent from "@/components/features/pharmacy/orders/OrdersContent";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { pharmacistService } from "@/Services/pharmacistService";
import { PharmacistOrder, OrdersDashboardResponse } from "@/types";

export default async function OrdersPage() {
  let orders: PharmacistOrder[] = [];
  let stats: OrdersDashboardResponse | null = null;

  try {
    const [ordersData, statsData] = await Promise.all([
      pharmacistService.getOrders(),
      pharmacistService.getOrdersDashboardStats()
    ]);
    orders = ordersData;
    stats = statsData;
  } catch (error) {
    console.error("Error fetching pharmacy orders page data:", error);
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
        <p className="text-gray-500">Manage and track all pharmacy orders</p>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <OrdersContent
          initialData={{
            orders,
            stats
          }}
        />
      </Suspense>
    </div>
  );
}
