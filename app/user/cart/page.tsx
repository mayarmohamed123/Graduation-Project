"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUserCart } from "@/store/slices/cartSlice";
import { cartService } from "@/Services/cartService";
import { Button } from "@/Components/ui/button";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { PharmacyCartCard, ConfirmDialog } from "@/Components";

export default function CartPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  
  const { cart, loading, error } = useAppSelector((state) => state.cart);
  const isLoggedIn = !!session;
  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());
  const [clearingCart, setClearingCart] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    
    dispatch(fetchUserCart());
  }, [isLoggedIn, dispatch, router]);

  const handleQuantityChange = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setUpdatingItems(prev => new Set(prev).add(itemId));
    try {
      await cartService.updateQuantity(itemId, newQuantity);
      // Refresh cart data
      await dispatch(fetchUserCart());
    } catch (error) {
      console.error("Failed to update quantity:", error);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    setUpdatingItems(prev => new Set(prev).add(itemId));
    try {
      await cartService.removeFromCart(itemId);
      // Refresh cart data
      await dispatch(fetchUserCart());
    } catch (error) {
      console.error("Failed to remove item:", error);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleClearCart = () => {
    setShowClearDialog(true);
  };

  const confirmClearCart = async () => {
    setClearingCart(true);
    try {
      await cartService.clearCart();
      // Refresh cart data
      await dispatch(fetchUserCart());
      setShowClearDialog(false);
    } catch (error) {
      console.error("Failed to clear cart:", error);
    } finally {
      setClearingCart(false);
    }
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600 mt-1">
              {cart.pharmacies.length} pharmacy(ies)
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleClearCart}
            disabled={clearingCart}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300"
          >
            {clearingCart ? "Clearing..." : "Clear Cart"}
          </Button>
        </div>

        {/* Cart Items - Each Pharmacy */}
        <div className="space-y-8">
          {cart.pharmacies.map((pharmacy) => (
            <PharmacyCartCard
              key={pharmacy.pharmacyId}
              pharmacy={pharmacy}
              updatingItems={updatingItems}
              onQuantityChange={handleQuantityChange}
              onRemoveItem={handleRemoveItem}
              onCheckout={handleCheckout}
            />
          ))}
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

      {/* Clear Cart Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showClearDialog}
        onClose={() => setShowClearDialog(false)}
        onConfirm={confirmClearCart}
        title="Clear Your Cart?"
        message="Are you sure you want to remove all items from your cart? This action cannot be undone."
        confirmText="Yes, Clear Cart"
        cancelText="Cancel"
        isLoading={clearingCart}
      />
    </div>
  );
}
