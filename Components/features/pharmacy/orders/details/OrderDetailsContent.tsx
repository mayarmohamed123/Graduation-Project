"use client";

import { useState, useEffect } from "react";
import { pharmacistService } from "@/Services/pharmacistService";
import { PharmacistOrder } from "@/types";
import OrderHeader from "./OrderHeader";
import OrderItemsList from "./OrderItemsList";
import OrderSummary from "./OrderSummary";
import CustomerDetailsCard from "./CustomerDetailsCard";
import PharmacyInfoCard from "./PharmacyInfoCard";

interface OrderDetailsContentProps {
    orderId: number;
}

export default function OrderDetailsContent({ orderId }: OrderDetailsContentProps) {
    const [order, setOrder] = useState<PharmacistOrder | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                setLoading(true);
                const data = await pharmacistService.getOrderById(orderId);
                setOrder(data);
            } catch (err) {
                console.error("Error fetching order details:", err);
                setError("Failed to load order details");
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrderDetails();
        }
    }, [orderId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <p className="text-red-600 mb-4">{error || "Order not found"}</p>
                <button
                    onClick={() => window.history.back()}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90"
                >
                    Go Back
                </button>
            </div>
        );
    }

    // Calculate order summary
    const subtotal = order.items.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity,
        0
    );
    const shipping = 0; // Free shipping as shown in mockup
    const tax = 0; // No tax in the data
    const total = order.totalPrice;

    return (
        <div>
            <OrderHeader
                orderNumber={order.id}
                status={order.status}
                paymentStatus={order.paymentStatus}
                createdAt={order.createdAt}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Order Items and Summary */}
                <div className="lg:col-span-2">
                    <OrderItemsList items={order.items} />
                    <OrderSummary
                        subtotal={subtotal}
                        shipping={shipping}
                        tax={tax}
                        total={total}
                    />
                </div>

                {/* Right Column - Customer and Pharmacy Info */}
                <div className="lg:col-span-1">
                    <CustomerDetailsCard
                        userName={order.userName}
                        userImage={order.userImage}
                        userEmail={order.userEmail}
                        phoneNumber={order.phoneNumber}
                        street={order.street}
                        city={order.city}
                        country={order.country}
                    />
                    <PharmacyInfoCard
                        pharmacyName={order.pharmacyName}
                        pharmacyImage={order.pharmacyImage}
                    />
                </div>
            </div>
        </div>
    );
}
