import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: localStorage.getItem("cartItem")
    ? JSON.parse(localStorage.getItem("cartItem"))
    : [],

  shippingInfo: localStorage.getItem("shippingInfo")
    ? JSON.parse(localStorage.getItem("shippingInfo"))
    : {},
};

export const CartSlice = createSlice({
  initialState,
  name: "cartSlice",
  reducers: {
    setCartItem: (state, action) => {
      const item = action.payload;
      console.log("reducer cart", item);

      const isItemExist = state.cartItems.find(
        (i) => i.product === item.product,
      );

      if (isItemExist) {
        state.cartItems = state.cartItems.map((i) =>
          i.product === isItemExist.product ? item : i,
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }
      localStorage.setItem("cartItem", JSON.stringify(state.cartItems));
    },
    removeCartItem: (state, action) => {
      state.cartItems = state?.cartItems?.filter(
        (i) => i.product !== action.payload,
      );
      localStorage.setItem("cartItem", JSON.stringify(state.cartItems));
    },

    clearCart: (state) => {
      console.log("CLEAR CART CALLED"); // 👈 add this

      localStorage.removeItem("cartItem"); // ✅ correct key
      state.cartItems = [];
    },

    saveShippingInfo: (state, action) => {
      state.shippingInfo = action.payload;

      localStorage.setItem("shippingInfo", JSON.stringify(state.shippingInfo));
    },
  },
});

export default CartSlice.reducer;

export const { setCartItem, removeCartItem, saveShippingInfo, clearCart } =
  CartSlice.actions;
