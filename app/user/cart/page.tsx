"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUserCart } from "@/store/slices/cartSlice";
import { Button } from "@/Components/ui/button";
import { ShoppingCart, Trash2, Minus, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  
  const { cart, loading, error } = useAppSelector((state) => state.cart);
  const isLoggedIn = !!session;

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    
    dispatch(fetchUserCart());
  }, [isLoggedIn, dispatch, router]);

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    // TODO: Implement update quantity API
    console.log("Update quantity for item:", itemId, "to:", newQuantity);
  };

  const handleRemoveItem = (itemId: number) => {
    // TODO: Implement remove item API
    console.log("Remove item:", itemId);
  };

  const handleCheckout = (pharmacyId: number, pharmacyName: string) => {
    console.log("Checkout for pharmacy:", pharmacyId, pharmacyName);
    // router.push(`/user/checkout/${pharmacyId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Error Loading Cart
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => dispatch(fetchUserCart())}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!cart || cart.pharmacies.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-6">
            Start adding medications to your cart to see them here
          </p>
          <Button asChild>
            <Link href="/user/search-medicine">Browse Medications</Link>
          </Button>
        </div>
      </div>
    );
  }

  const DELIVERY_FEE = 1.50; // Fixed delivery fee per pharmacy

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-1">
            {cart.pharmacies.length} pharmacy(ies)
          </p>
        </div>

        {/* Cart Items - Each Pharmacy */}
        <div className="space-y-8">
          {cart.pharmacies.map((pharmacy) => {
            const pharmacyTotal = pharmacy.totalPrice + DELIVERY_FEE;

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
                          {pharmacy.items.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                              {/* Product */}
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <ShoppingCart className="w-8 h-8 text-gray-400" />
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
                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                    className="w-8 h-8 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                                    disabled={item.quantity <= 1}
                                  >
                                    <Minus className="w-4 h-4 text-gray-600" />
                                  </button>
                                  <input
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                                    className="w-16 h-8 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    min="1"
                                  />
                                  <button
                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                    className="w-8 h-8 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                                  >
                                    <Plus className="w-4 h-4 text-gray-600" />
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
                                  onClick={() => handleRemoveItem(item.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-md transition-colors"
                                  title="Remove item"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </td>
                            </tr>
                          ))}
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
                            EGP {DELIVERY_FEE.toFixed(2)}
                          </span>
                        </div>
                        <div className="border-t border-gray-200 pt-3">
                          <div className="flex justify-between text-lg font-bold text-gray-900">
                            <span>Total:</span>
                            <span>EGP {pharmacyTotal.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={() => handleCheckout(pharmacy.pharmacyId, pharmacy.pharmacyName)}
                        className="w-full h-12 text-base bg-cyan-500 hover:bg-cyan-600"
                      >
                        Checkout Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Continue Shopping */}
        <div className="mt-8 text-center">
          <Button variant="outline" asChild>
            <Link href="/user/search-medicine">
              ← Continue Shopping
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
