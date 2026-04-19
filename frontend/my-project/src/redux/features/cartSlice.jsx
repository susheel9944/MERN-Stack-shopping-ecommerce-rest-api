import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: localStorage.getItem("cartItem")
    ? JSON.parse(localStorage.getItem("cartItem"))
    : [],
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
  },
});

export default CartSlice.reducer;

export const { setCartItem, removeCartItem } = CartSlice.actions;
