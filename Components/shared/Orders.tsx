"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Order } from "@/types";
import { userService } from "@/Services/userService";
import { toast } from "react-hot-toast";

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Orders</h1>
        <div className="flex items-center justify-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Orders</h1>
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <p className="text-gray-500 text-lg">No orders found</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Orders</h1>

      <div className="space-y-6 max-w-[680px]">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex justify-between flex-row">
          <div>
              {/* Status Badge */}
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(order.status)}`}></div>
              <span className="font-medium text-gray-700">
                {getStatusLabel(order.status)}
              </span>
            </div>

           
             {/* Order Info */}
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-1">Order Number</p>
              <p className="font-bold text-gray-900 text-lg">#{order.id}</p>
              <p className="text-sm text-gray-600 mt-2">
                Total Amount: <span className="font-semibold">${order.totalPrice}</span>
              </p>
            </div>
          </div>

            {/* Order Items */}
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  {/* Placeholder medication image */}
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xs">
                      {item.medicationName.substring(0, 2).toUpperCase()}
                    </span>
                  </div>

                  {/* Item Details */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {item.medicationName}
                    </h3>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    <p className="text-xs text-gray-500">Pharmacy: {order.pharmacyName}</p>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="font-bold text-gray-900">${item.unitPrice}</p>
                  </div>
                </div>
              ))}
            </div>
           </div>
          
        ))}
      </div>
    </div>
  );
}
