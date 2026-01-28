"use client";

import { PharmacistOrderItem } from "@/types";
import Image from "next/image";

interface OrderItemsListProps {
    items: PharmacistOrderItem[];
}

export default function OrderItemsList({ items }: OrderItemsListProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Items ({items.length})
            </h2>
            <div className="space-y-4">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                    >
                        <div className="flex items-center gap-4">
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                                {item.medicicationImage && (
                                    <Image
                                        src={item.medicicationImage}
                                        alt={item.medicationName}
                                        fill
                                        className="object-cover"
                                    />
                                )}
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">{item.medicationName}</h3>
                                <p className="text-sm text-gray-500">
                                    Unit Price: ${item.unitPrice}
                                </p>
                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-semibold text-gray-900">
                                ${item.unitPrice * item.quantity}
                            </p>
                            <button className="text-sm text-primary hover:underline mt-1">
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
