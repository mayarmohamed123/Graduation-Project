"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/hooks/useAuth";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUserCart, clearLocalCart } from "@/store/slices/cartSlice";
import { cartService } from "@/services/cartService";
import PharmacyCartCard from "@/components/features/cart/PharmacyCartCard";
import ConfirmDialog from "@/components/features/cart/ConfirmDialog";
import CheckoutDialog, { CheckoutFormData } from "@/components/features/cart/CheckoutDialog";
import PageHeaderWithBack from "@/components/common/PageHeaderWithBack";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { CheckoutRequest } from "@/types";
import toast from "react-hot-toast";

export default function CartPage() {

  const dispatch = useAppDispatch();

  const { cart, loading, error } = useAppSelector((state) => state.cart);
  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());
  const [clearingCart, setClearingCart] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [checkoutLoadingId, setCheckoutLoadingId] = useState<number | null>(null);
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState<{id: number, name: string} | null>(null);

  useEffect(() => {
    dispatch(fetchUserCart());
  }, [dispatch]);

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
      // Immediately clear local state
      dispatch(clearLocalCart());
      setShowClearDialog(false);
    } catch (error) {
      console.error("Failed to clear cart:", error);
    } finally {
      setClearingCart(false);
    }
  };

  const handleCheckout = (pharmacyId: number, pharmacyName: string) => {
    setSelectedPharmacy({ id: pharmacyId, name: pharmacyName });
    setShowCheckoutDialog(true);
  };

  const onConfirmCheckout = async (formData: CheckoutFormData) => {
    if (!selectedPharmacy) return;
    
    setCheckoutLoadingId(selectedPharmacy.id);
    try {
      const checkoutData: CheckoutRequest = {
        pharmacyId: selectedPharmacy.id,
        ...formData
      };

      const checkoutResponse = await cartService.checkout(checkoutData);

      if (checkoutResponse.success) {
        toast.success(checkoutResponse.message);
        const { orderId, totalPrice } = checkoutResponse.data;

        const paymentSession = await cartService.createPaymentSession({
          paymentFor: "Order",
          amount: totalPrice,
          orderid: orderId,
        });

        if (paymentSession.sessionUrl) {
          window.location.href = paymentSession.sessionUrl;
        } else {
          toast.error("Failed to generate payment session");
        }
      }
    } catch (error) {
      console.error("Checkout failed:", error);
    } finally {
      setCheckoutLoadingId(null);
      // Don't close dialog immediately if redirecting, but if error we might want to keep it open or close it. 
      // If redirecting, component might unmount. 
      // Safe to stop loading state.
    }
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
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <PageHeaderWithBack title="Shopping Cart" />
       
         <Button
          variant="outline"
          onClick={handleClearCart}
          disabled={clearingCart}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300 my-5"
        >
          {clearingCart ? "Clearing..." : "Clear Cart"}
        </Button>
       
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
              isCheckoutLoading={false} // Loading is now shown in the dialog
            />
          ))}
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

      {/* Checkout Dialog */}
      <CheckoutDialog
        isOpen={showCheckoutDialog}
        onClose={() => setShowCheckoutDialog(false)}
        onConfirm={onConfirmCheckout}
        isLoading={checkoutLoadingId !== null}
      />
    </div>
  );
}
