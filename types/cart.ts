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
