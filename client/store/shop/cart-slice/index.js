import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getGuestId } from "../../../src/utils/guestId";

const API = import.meta.env.VITE_API_URL;

const initialState = {
  cartItems: JSON.parse(localStorage.getItem("guestCart")) || [],
  isLoading: false,
};

// --- Thunks ---
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, productId, quantity, color }) => {
    const payload = userId
      ? { userId, productId, quantity, color }
      : { guestId: getGuestId(), productId, quantity, color };
    const response = await axios.post(`${API}/api/shop/cart/add`, payload);
    return response.data;
  }
);

export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (userId) => {
    if (userId) {
      return (await axios.get(`${API}/cart/get/${userId}`)).data;
    } else {
      const gid = getGuestId();
      return (await axios.get(`${API}/cart/get`, { params: { guestId: gid } })).data;
    }
  }
);

export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ userId, productId, quantity, color }) => {
    const payload = userId
      ? { userId, productId, quantity, color }
      : { guestId: getGuestId(), productId, quantity, color };
    const response = await axios.put(`${API}/cart/update-cart`, payload);
    return response.data;
  }
);

export const deleteCartItems = createAsyncThunk(
  "cart/deleteCartItems",
  async ({ userId, productId }) => {
    if (userId) {
      return (await axios.delete(`${API}/cart/delete-cart/${userId}/${productId}`)).data;
    } else {
      const gid = getGuestId();
      return (await axios.delete(`${API}/cart/delete-cart`, {
        params: { guestId: gid, productId },
      })).data;
    }
  }
);

// --- Slice ---
const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {
    addGuestCartItem: (state, action) => {
      const item = action.payload;
      const existing = state.cartItems.find(
        (i) => i.productId === item.productId && i.color === item.color
      );

      if (existing) {
        existing.quantity += item.quantity;
      } else {
        state.cartItems.push(item);
      }
      localStorage.setItem("guestCart", JSON.stringify(state.cartItems));
    },
    updateGuestCartItem: (state, action) => {
      const { productId, color, quantity } = action.payload;
      const existing = state.cartItems.find(
        (i) => i.productId === productId && i.color === color
      );
      if (existing) {
        existing.quantity = quantity;
        localStorage.setItem("guestCart", JSON.stringify(state.cartItems));
      }
    },
    deleteGuestCartItem: (state, action) => {
      const { productId, color } = action.payload;
      state.cartItems = state.cartItems.filter(
        (i) => !(i.productId === productId && i.color === color)
      );
      localStorage.setItem("guestCart", JSON.stringify(state.cartItems));
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem("guestCart")
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => { state.isLoading = true; })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data || [];
      })
      .addCase(addToCart.rejected, (state) => { state.isLoading = false; })
      .addCase(fetchCartItems.pending, (state) => { state.isLoading = true; })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data || [];
      })
      .addCase(fetchCartItems.rejected, (state) => { state.isLoading = false; })
      .addCase(updateCartQuantity.pending, (state) => { state.isLoading = true; })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data || [];
      })
      .addCase(updateCartQuantity.rejected, (state) => { state.isLoading = false; })
      .addCase(deleteCartItems.pending, (state) => { state.isLoading = true; })
      .addCase(deleteCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data || [];
      })
      .addCase(deleteCartItems.rejected, (state) => { state.isLoading = false; });
  },
});

// --- Normalized Selector ---
export const selectNormalizedCartItems = (state) => {
  const cart = state.shoppingCart.cartItems;
  // If object with .items, return that, else return array itself
  return cart?.items ? cart.items : Array.isArray(cart) ? cart : [];
};

export const { addGuestCartItem, updateGuestCartItem, deleteGuestCartItem, clearCart } = shoppingCartSlice.actions;
export default shoppingCartSlice.reducer;