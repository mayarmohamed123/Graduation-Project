import { useMemo } from "react";
import { PharmacistOrder, PharmacistOrderStatus } from "@/types";

type OrderStatusFilter = "All" | PharmacistOrderStatus;

export function useOrderFilters(
  orders: PharmacistOrder[],
  activeTab: OrderStatusFilter
) {
  return useMemo(() => {
    const counts = {
      total: orders.length,
      confirmed: 0,
      pending: 0,
      delivered: 0,
      cancelled: 0,
    };

    const filteredOrders: PharmacistOrder[] = [];

    for (const order of orders) {
      // count
      if (order.status === "Confirmed") counts.confirmed++;
      if (order.status === "Pending") counts.pending++;
      if (order.status === "Delivered") counts.delivered++;
      if (order.status === "Cancelled") counts.cancelled++;

      // filter
      if (activeTab === "All" || order.status === activeTab) {
        filteredOrders.push(order);
      }
    }

    return { filteredOrders, counts };
  }, [orders, activeTab]);
}
