"use client";

import Image from "next/image";
import { Package, MapPin, Phone, CreditCard, ChevronDown, ChevronUp } from "lucide-react";
import { UserOrder } from "@/types/admin";
import { useState } from "react";

interface OrderRowProps {
    order: UserOrder;
}

export function OrderRow({ order }: OrderRowProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "confirmed":
                return "bg-green-100 text-green-800";
            case "delivered":
                return "bg-blue-100 text-blue-800";
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "cancelled":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex flex-wrap items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                            <Package className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-gray-900">Order #{order.id}</span>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                                    {order.status}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-0.5">{formatDate(order.createdAt)}</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-8">
                        <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10 rounded-lg overflow-hidden border border-gray-100">
                                {order.pharmacyImage ? (
                                    <Image src={order.pharmacyImage} alt={order.pharmacyName} fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gray-50" />
                                )}
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Pharmacy</p>
                                <p className="text-sm font-medium text-gray-900">{order.pharmacyName}</p>
                            </div>
                        </div>

                        <div className="text-right">
                            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Amount</p>
                            <p className="text-lg font-bold text-gray-900">EGP {order.totalPrice.toFixed(2)}</p>
                        </div>

                        <div className="text-gray-400">
                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                    </div>
                </div>
            </div>

            {isExpanded && (
                <div className="border-t border-gray-100 bg-gray-50/50 p-6 space-y-6 animate-in slide-in-from-top-2 duration-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-4">
                            <h4 className="text-sm font-bold text-gray-900 border-b border-gray-200 pb-2">Delivery Details</h4>
                            <div className="space-y-3">
                                <div className="flex items-start gap-2 text-sm text-gray-600">
                                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                                    <span>{order.street}, {order.city}, {order.country}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    <span>{order.phoneNumber}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-sm font-bold text-gray-900 border-b border-gray-200 pb-2">Payment Info</h4>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <CreditCard className="w-4 h-4 text-gray-400" />
                                    <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${order.paymentStatus.toLowerCase() === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {order.paymentStatus}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-1 space-y-4">
                            <h4 className="text-sm font-bold text-gray-900 border-b border-gray-200 pb-2">Order Summary</h4>
                            <div className="space-y-2">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">{item.medicationName} x {item.quantity}</span>
                                        <span className="font-medium text-gray-900">EGP {(item.unitPrice * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                                <div className="pt-2 border-t border-gray-200 flex justify-between font-semibold text-gray-900">
                                    <span>Delivery Fee</span>
                                    <span>EGP {order.delieveryFee.toFixed(2)}</span>
                                </div>
                                <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-gray-900">
                                    <span>Total</span>
                                    <span>EGP {order.totalPrice.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-sm font-bold text-gray-900">Order Items</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                                        {item.medicicationImage ? (
                                            <Image src={item.medicicationImage} alt={item.medicationName} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-400">
                                                <Package className="w-5 h-5" />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 line-clamp-1">{item.medicationName}</p>
                                        <p className="text-xs text-gray-500">Qty: {item.quantity} • EGP {item.unitPrice.toFixed(2)} / unit</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
