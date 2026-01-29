import { useState } from "react";
import { pharmacistService } from "@/Services/pharmacistService";

export function useOrderActions(onRefresh: () => Promise<void>) {
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const handleAcceptOrder = async (orderId: number) => {
    try {
      setActionLoading(orderId);
      await pharmacistService.acceptOrder(orderId);
      await onRefresh();
    } catch (error) {
      console.error("Error accepting order:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelOrder = async (orderId: number) => {
    try {
      setActionLoading(orderId);
      await pharmacistService.cancelOrder(orderId);
      await onRefresh();
    } catch (error) {
      console.error("Error canceling order:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleMarkAsDelivered = async (orderId: number) => {
    try {
      setActionLoading(orderId);
      await pharmacistService.markAsDelivered(orderId);
      await onRefresh();
    } catch (error) {
      console.error("Error marking as delivered:", error);
    } finally {
      setActionLoading(null);
    }
  };

  return {
    actionLoading,
    handleAcceptOrder,
    handleCancelOrder,
    handleMarkAsDelivered,
  };
}
