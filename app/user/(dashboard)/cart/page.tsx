"use client";

import { useState } from "react";
import PharmacyCartCard from "@/components/features/cart/PharmacyCartCard";
import ConfirmDialog from "@/components/features/cart/ConfirmDialog";
import CheckoutDialog, { CheckoutFormData } from "@/components/features/cart/CheckoutDialog";
import PageHeaderWithBack from "@/components/common/PageHeaderWithBack";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";

export default function CartPage() {
  const {
    cart,
    isLoading,
    error,
    updatingItems,
    isClearing,
    checkoutLoadingId,
    updateQuantity,
    removeItem,
    clearCart,
    checkout
  } = useCart();

  const [showClearDialog, setShowClearDialog] = useState(false);
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState<{ id: number; name: string } | null>(null);

  const handleClearCart = () => {
    setShowClearDialog(true);
  };

  const confirmClearCart = async () => {
    await clearCart();
    setShowClearDialog(false);
  };

  const handleCheckout = (pharmacyId: number, pharmacyName: string) => {
    setSelectedPharmacy({ id: pharmacyId, name: pharmacyName });
    setShowCheckoutDialog(true);
  };

  const onConfirmCheckout = async (formData: CheckoutFormData) => {
    if (!selectedPharmacy) return;
    try {
      await checkout(selectedPharmacy.id, formData);
      setShowCheckoutDialog(false);
    } catch {
      // Error is handled in the hook
    }
  };

  if (isLoading) {
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
          <Button onClick={() => window.location.reload()}>
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
          disabled={isClearing}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300 my-5"
        >
          {isClearing ? "Clearing..." : "Clear Cart"}
        </Button>
       
        {/* Cart Items - Each Pharmacy */}
        <div className="space-y-8">
          {cart.pharmacies.map((pharmacy) => (
            <PharmacyCartCard
              key={pharmacy.pharmacyId}
              pharmacy={pharmacy}
              updatingItems={updatingItems}
              onQuantityChange={updateQuantity}
              onRemoveItem={removeItem}
              onCheckout={handleCheckout}
              isCheckoutLoading={checkoutLoadingId === pharmacy.pharmacyId}
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
        isLoading={isClearing}
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
