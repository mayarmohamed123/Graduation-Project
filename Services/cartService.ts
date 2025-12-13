// Services/cartService.ts
import { apiRequest } from "./api";
// import { authService } from "./authService";
import {
  UserCart,
  CheckoutRequest,
  CheckoutResponse,
  CreatePaymentSessionRequest,
  CreatePaymentSessionResponse,
} from "@/types";
import { toast } from "react-hot-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface AddToCartParams {
  medicationId: number;
  pharmacyId: number;
  quantity: number;
}

class CartService {
  /**
   * Add medication to cart or update quantity if item already exists
   * POST {{baseUrl}}/cart/add?medicationId=12&pharmacyId=12&quantity=3
   * Note: This API handles both adding new items and updating existing ones
   * Returns: Raw text message
   */
  async addToCart(params: AddToCartParams): Promise<string> {
    const { medicationId, pharmacyId, quantity } = params;

    const queryParams = new URLSearchParams({
      medicationId: medicationId.toString(),
      pharmacyId: pharmacyId.toString(),
      quantity: quantity.toString(),
    });

    const url = `${API_BASE_URL}/cart/add?${queryParams.toString()}`;

    try {
      const message = await apiRequest<string>(url, {
        method: "POST",
        returnType: "text",
      });
      toast.success(message);
      return message;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update cart";
      toast.error(errorMessage);
      throw error;
    }
  }

  /**
   * Get user's cart
   * GET {{baseUrl}}/cart
   * Returns: JSON cart data
   */
  async getCart(): Promise<UserCart> {
    const url = `${API_BASE_URL}/cart`;

    try {
      return await apiRequest<UserCart>(url);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch cart";
      toast.error(errorMessage);
      throw error;
    }
  }

  /**
   * Update cart item quantity
   * PATCH {{baseUrl}}/cart/update/{itemId}?quantity={quantity}
   * Returns: Raw text message
   */
  async updateQuantity(itemId: number, quantity: number): Promise<void> {
    const url = `${API_BASE_URL}/cart/update/${itemId}?quantity=${quantity}`;

    try {
      const message = await apiRequest<string>(url, {
        method: "PATCH",
        returnType: "text",
      });
      toast.success(message || "Quantity updated successfully");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update quantity";
      toast.error(errorMessage);
      throw error;
    }
  }

  /**
   * Remove item from cart
   * DELETE {{baseUrl}}/cart/remove/{itemId}
   * Returns: Raw text message
   */
  async removeFromCart(itemId: number): Promise<string> {
    const url = `${API_BASE_URL}/cart/remove/${itemId}`;

    try {
      const message = await apiRequest<string>(url, {
        method: "DELETE",
        returnType: "text",
      });
      toast.success(message);
      return message;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to remove item";
      toast.error(errorMessage);
      throw error;
    }
  }

  /**
   * Clear entire cart
   * DELETE {{baseUrl}}/cart/clear
   * Returns: Raw text message
   */
  async clearCart(): Promise<string> {
    const url = `${API_BASE_URL}/cart/clear`;

    try {
      const message = await apiRequest<string>(url, {
        method: "DELETE",
        returnType: "text",
      });
      toast.success(message);
      return message;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to clear cart";
      toast.error(errorMessage);
      throw error;
    }
  }

  /**
   * Checkout order
   * POST {{baseUrl}}/order/checkout
   */
  async checkout(data: CheckoutRequest): Promise<CheckoutResponse> {
    const url = `${API_BASE_URL}/order/checkout`;

    try {
      return await apiRequest<CheckoutResponse>(url, {
        method: "POST",
        data,
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Checkout failed";
      toast.error(errorMessage);
      throw error;
    }
  }

  /**
   * Create payment session
   * POST {{baseUrl}}/payments/create-session
   */
  async createPaymentSession(
    data: CreatePaymentSessionRequest
  ): Promise<CreatePaymentSessionResponse> {
    const url = `${API_BASE_URL}/payments/create-session`;

    try {
      return await apiRequest<CreatePaymentSessionResponse>(url, {
        method: "POST",
        data,
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create payment session";
      toast.error(errorMessage);
      throw error;
    }
  }

  /**
   * Verify payment session
   * GET {{baseUrl}}/payments/verify-session?sessionId={sessionId}
   */
  async verifySession(sessionId: string): Promise<unknown> {
    const url = `${API_BASE_URL}/payments/verify-session?sessionId=${sessionId}`;

    try {
      return await apiRequest(url);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to verify session";
      toast.error(errorMessage);
      throw error;
    }
  }
}

// Export a single instance
export const cartService = new CartService();
