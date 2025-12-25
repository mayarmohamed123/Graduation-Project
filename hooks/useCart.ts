import { useState, useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUserCart, clearLocalCart } from "@/store/slices/cartSlice";
import { cartService } from "@/Services/cartService";
import { CheckoutRequest } from "@/types";
import toast from "react-hot-toast";

export const useCart = () => {
  const dispatch = useAppDispatch();
  const { cart, loading, error } = useAppSelector((state) => state.cart);
  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());
  const [isClearing, setIsClearing] = useState(false);
  const [checkoutLoadingId, setCheckoutLoadingId] = useState<number | null>(null);

  const fetchCart = useCallback(() => {
    dispatch(fetchUserCart());
  }, [dispatch]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    setUpdatingItems((prev) => new Set(prev).add(itemId));
    try {
      await cartService.updateQuantity(itemId, newQuantity);
      await dispatch(fetchUserCart());
    } catch (err) {
      console.error("Failed to update quantity:", err);
      toast.error("Failed to update quantity");
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const removeItem = async (itemId: number) => {
    setUpdatingItems((prev) => new Set(prev).add(itemId));
    try {
      await cartService.removeFromCart(itemId);
      await dispatch(fetchUserCart());
      toast.success("Item removed from cart");
    } catch (err) {
      console.error("Failed to remove item:", err);
      toast.error("Failed to remove item");
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const clearCart = async () => {
    setIsClearing(true);
    try {
      await cartService.clearCart();
      dispatch(clearLocalCart());
      toast.success("Cart cleared");
    } catch (err) {
      console.error("Failed to clear cart:", err);
      toast.error("Failed to clear cart");
    } finally {
      setIsClearing(false);
    }
  };

  const checkout = async (pharmacyId: number, formData: Omit<CheckoutRequest, "pharmacyId">) => {
    setCheckoutLoadingId(pharmacyId);
    try {
      const checkoutData: CheckoutRequest = {
        pharmacyId,
        ...formData,
      };

      const response = await cartService.checkout(checkoutData);

      if (response.success) {
        toast.success(response.message);
        const { orderId, totalPrice } = response.data;

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
      return response;
    } catch (err) {
      console.error("Checkout failed:", err);
      toast.error(err instanceof Error ? err.message : "Checkout failed");
      throw err;
    } finally {
      setCheckoutLoadingId(null);
    }
  };

  return {
    cart,
    isLoading: loading,
    error,
    updatingItems,
    isClearing,
    checkoutLoadingId,
    updateQuantity,
    removeItem,
    clearCart,
    checkout,
    refetch: fetchCart,
  };
};
