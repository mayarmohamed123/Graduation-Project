export interface CartItem {
  id: number;
  medication: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface PharmacyCart {
  pharmacyId: number;
  pharmacyName: string;
  items: CartItem[];
  totalPrice: number;
}

export interface UserCart {
  cartId: number;
  pharmacies: PharmacyCart[];
}
