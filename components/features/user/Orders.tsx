"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Order } from "@/types";
import { userService } from "@/Services/userService";
import { toast } from "react-hot-toast";
import Switch from "@/components/common/Switch";

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await userService.getUserOrders();
        setOrders(data);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to load orders"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === "delivered" || statusLower === "confirmed") {
      return "bg-green-500";
    } else if (statusLower === "pending") {
      return "bg-yellow-500";
    } else if (statusLower === "cancelled") {
      return "bg-red-500";
    }
    return "bg-gray-500";
  };

  const getStatusLabel = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === "confirmed") return "Delivered";
    return status;
  };

  const tabs = [
    { id: "pending", label: "Pending" },
    { id: "delivered", label: "Delivered" },
    { id: "cancelled", label: "Cancelled" },
  ];

  const filteredOrders = orders.filter((order) => {
    const status = order.status.toLowerCase();
    if (activeTab === "pending") {
      return !["delivered", "confirmed", "cancelled"].includes(status);
    }
    if (activeTab === "delivered") {
      return ["delivered", "confirmed"].includes(status);
    }
    if (activeTab === "cancelled") {
      return status === "cancelled";
    }
    return true;
  });

  // Group orders by pharmacy
  const groupedOrders = filteredOrders.reduce((acc, order) => {
    const pharmacyName = order.pharmacyName || "Unknown Pharmacy";
    if (!acc[pharmacyName]) {
      acc[pharmacyName] = [];
    }
    acc[pharmacyName].push(order);
    return acc;
  }, {} as Record<string, Order[]>);

  if (isLoading) {
    return (
      <div className="h-full flex flex-col">
        <h2 className="text-xl font-semibold text-gray-900 mb-8 shrink-0">Orders</h2>
        <div className="flex-1 flex items-center justify-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="shrink-0">
        <h2 className="text-xl font-semibold text-gray-900 mb-8">Orders</h2>
        <div className="mb-6 flex justify-center">
          <Switch tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <p className="text-gray-500 text-lg">No {activeTab} orders found</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-8 pr-2 scrollbar-hide">
          {Object.entries(groupedOrders).map(([pharmacyName, pharmacyOrders]) => (
            <div key={pharmacyName} className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 px-1">
                {pharmacyName}
              </h3>
              <div className="space-y-6">
                {pharmacyOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex justify-between flex-row"
                  >
                    <div>
                      {/* Status Badge */}
                      <div className="flex items-center gap-2 mb-4">
                        <div
                          className={`w-3 h-3 rounded-full ${getStatusColor(
                            order.status
                          )}`}
                        ></div>
                        <span className="font-medium text-gray-700">
                          {getStatusLabel(order.status)}
                        </span>
                      </div>

                      {/* Order Info */}
                      <div className="mb-6">
                        <p className="text-sm text-gray-500 mb-1">
                          Order Number
                        </p>
                        <p className="font-bold text-gray-900 text-lg">
                          #{order.id}
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                          Total Amount:{" "}
                          <span className="font-semibold">
                            ${order.totalPrice}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-4">
                          {/* Medication image */}
                          {item.medicicationImage ? (
                            <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                              <Image
                                src={item.medicicationImage}
                                alt={item.medicationName}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-16 h-16 bg-linear-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shrink-0">
                              <span className="text-white font-bold text-xs">
                                {item.medicationName
                                  .substring(0, 2)
                                  .toUpperCase()}
                              </span>
                            </div>
                          )}

                          {/* Item Details */}
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">
                              {item.medicationName}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Qty: {item.quantity}
                            </p>
                            {/* Removed Pharmacy name from individual item as it's grouped now */}
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="font-bold text-gray-900">
                              ${item.unitPrice}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
