export interface CartItem {
  id: number; // This IS the medicationId
  medication: string;
  medicationImage: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface PharmacyCart {
  pharmacyId: number;
  pharmacyName: string;
  deliveryFee: number;
  items: CartItem[];
  totalPrice: number;
  totalWithDelivery: number;
}

export interface UserCart {
  cartId: number;
  pharmacies: PharmacyCart[];
  orderTotal: number;
  deliveryTotal: number;
  grandTotal: number;
}

export interface CheckoutRequest {
  pharmacyId: number;
  country: string;
  city: string;
  street: string;
  phoneNumber: string;
}

export interface CheckoutResponse {
  success: boolean;
  message: string;
  data: {
    orderId: number;
    itemsTotal: number;
    deliveryFee: number;
    totalPrice: number;
  };
}

export interface CreatePaymentSessionRequest {
  paymentFor: string;
  amount: number;
  orderid: number;
}

export interface CreatePaymentSessionResponse {
  message: string;
  sessionUrl: string;
  sessionId: string;
}
