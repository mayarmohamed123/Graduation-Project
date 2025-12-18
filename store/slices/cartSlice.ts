import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "@/Services/api";
import { UserCart, PharmacyCart } from "@/types";

// ⭐ Replace with your actual backend API endpoint
const CART_API = `${process.env.NEXT_PUBLIC_API_BASE_URL}/cart`;

// ------------------------
// 🔹 Thunk: fetch user cart
// ------------------------
export const fetchUserCart = createAsyncThunk(
  "cart/fetchUserCart",
  async () => {
    const response = await apiRequest<UserCart>(CART_API, {
      cache: "no-store",
      next: { revalidate: 0 },
    });
    return response;
  }
);

// ------------------------
// 🔹 Helper: count items
// ------------------------
const countTotalItems = (cart: UserCart | null) => {
  if (!cart || !cart.pharmacies) return 0;

  return cart.pharmacies.reduce(
    (sum: number, pharmacy: PharmacyCart) => sum + pharmacy.items.length,
    0
  );
};

interface CartState {
  cart: UserCart | null;
  totalItems: number;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cart: null,
  totalItems: 0,
  loading: false,
  error: null,
};

// ------------------------
// 🔹 Slice
// ------------------------
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearLocalCart: (state) => {
      state.cart = null;
      state.totalItems = 0;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;

        // ⭐ Auto-calc total items
        state.totalItems = countTotalItems(action.payload);
      })
      .addCase(fetchUserCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "Failed to fetch cart";
      });
  },
});

export const { clearLocalCart } = cartSlice.actions;
export default cartSlice.reducer;
