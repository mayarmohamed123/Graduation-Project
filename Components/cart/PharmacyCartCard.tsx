"use client";

import { useState } from "react";
import { PharmacyCart } from "@/types";
import { Button } from "@/Components/ui/button";
import { Trash2, Minus, Plus, Loader2 } from "lucide-react";
import Image from "next/image";

interface PharmacyCartCardProps {
  pharmacy: PharmacyCart;
  updatingItems: Set<number>;
  onQuantityChange: (itemId: number, newQuantity: number) => void;
  onRemoveItem: (itemId: number) => void;
  onCheckout: (pharmacyId: number, pharmacyName: string) => void;
}

export default function PharmacyCartCard({
  pharmacy,
  updatingItems,
  onQuantityChange,
  onRemoveItem,
  onCheckout,
}: PharmacyCartCardProps) {
  return (
    <div key={pharmacy.pharmacyId} className="space-y-4">
      {/* Pharmacy Name */}
      <div className="bg-primary/10 px-6 py-3 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-900">
          {pharmacy.pharmacyName}
        </h2>
      </div>

      {/* Cart Table + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Table */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Product
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    Quantity
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    Price
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pharmacy.items.map((item) => {
                  const medicationImageUrl = item.medicationImage;
                  
                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      {/* Product */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={medicationImageUrl}
                              alt={item.medication}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                              unoptimized
                            />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {item.medication}
                            </p>
                            <p className="text-sm text-gray-500">
                              EGP {item.unitPrice.toFixed(2)} each
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Quantity Controls */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={item.quantity <= 1 || updatingItems.has(item.id)}
                          >
                            {updatingItems.has(item.id) ? (
                              <Loader2 className="w-4 h-4 text-gray-600 animate-spin" />
                            ) : (
                              <Minus className="w-4 h-4 text-gray-600" />
                            )}
                          </button>
                          <input
                            type="text"
                            value={item.quantity}
                            readOnly
                            className="w-16 h-8 text-center border border-gray-300 rounded-md bg-gray-50 cursor-default"
                          />
                          <button
                            onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={updatingItems.has(item.id)}
                          >
                            {updatingItems.has(item.id) ? (
                              <Loader2 className="w-4 h-4 text-gray-600 animate-spin" />
                            ) : (
                              <Plus className="w-4 h-4 text-gray-600" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4 text-right">
                        <p className="font-semibold text-gray-900">
                          EGP {item.total.toFixed(2)}
                        </p>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Remove item"
                          disabled={updatingItems.has(item.id)}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Summary
            </h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span className="font-medium">
                  EGP {pharmacy.totalPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Delivery Fee:</span>
                <span className="font-medium">
                  EGP {pharmacy.deliveryFee.toFixed(2)}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total:</span>
                  <span>EGP {pharmacy.totalWithDelivery.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Button
              onClick={() => onCheckout(pharmacy.pharmacyId, pharmacy.pharmacyName)}
              className="w-full h-12 text-base bg-primary"
            >
              Checkout Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
