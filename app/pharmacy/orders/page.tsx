import { Suspense } from "react";
import OrdersContent from "@/Components/features/pharmacy/orders/OrdersContent";
import { LoadingSpinner } from "@/Components";

export default function OrdersPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
        <p className="text-gray-500">Manage and track all pharmacy orders</p>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <OrdersContent />
      </Suspense>
    </div>
  );
}
