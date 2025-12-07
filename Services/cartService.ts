// Services/cartService.ts
import { fetchWithAuth, postWithAuthText, postWithAuth } from "./api";
import { authService } from "./authService";
import {
  UserCart,
  CheckoutRequest,
  CheckoutResponse,
  CreatePaymentSessionRequest,
  CreatePaymentSessionResponse
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
      const message = await postWithAuthText(url);
      toast.success(message);
      return message;
    } catch (error: any) {
      toast.error(error.message || "Failed to update cart");
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
      return await fetchWithAuth(url);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch cart");
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
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.getToken()}`,
        },
      });

      if (response.status === 401) {
        authService.logout();
        throw new Error("Session expired. Please log in again.");
      }

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Failed to update quantity");
        throw new Error(errorText);
      }

      // Get raw text response
      const message = await response.text();
      toast.success(message || "Quantity updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update quantity");
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
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.getToken()}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => null);
        throw new Error(errorText || "Failed to remove item");
      }

      const message = await response.text();
      toast.success(message);
      return message;
    } catch (error: any) {
      toast.error(error.message || "Failed to remove item");
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
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.getToken()}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => null);
        throw new Error(errorText || "Failed to clear cart");
      }

      const message = await response.text();
      toast.success(message);
      return message;
    } catch (error: any) {
      toast.error(error.message || "Failed to clear cart");
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
      const response = await postWithAuth(url, data);
      return response as CheckoutResponse;
    } catch (error: any) {
      toast.error(error.message || "Checkout failed");
      throw error;
    }
  }

  /**
   * Create payment session
   * POST {{baseUrl}}/payments/create-session
   */
  async createPaymentSession(data: CreatePaymentSessionRequest): Promise<CreatePaymentSessionResponse> {
    const url = `${API_BASE_URL}/payments/create-session`;

    try {
      const response = await postWithAuth(url, data);
      return response as CreatePaymentSessionResponse;
    } catch (error: any) {
      toast.error(error.message || "Failed to create payment session");
      throw error;
    }
  }

  /**
   * Verify payment session
   * GET {{baseUrl}}/payments/verify-session?sessionId={sessionId}
   */
  async verifySession(sessionId: string): Promise<any> {
    const url = `${API_BASE_URL}/payments/verify-session?sessionId=${sessionId}`;

    try {
      return await fetchWithAuth(url);
    } catch (error: any) {
      toast.error(error.message || "Failed to verify session");
      throw error;
    }
  }

  // Helper to get token from cookies
  private getToken(): string {
    if (typeof document === "undefined") return "";
    
    const cookies = document.cookie.split(";");
    const tokenCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("token=")
    );
    
    if (tokenCookie) {
      return decodeURIComponent(tokenCookie.split("=")[1]);
    }
    
    return "";
  }
}

// Export a single instance
export const cartService = new CartService();
