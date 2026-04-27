import { configureStore } from "@reduxjs/toolkit";
import { productApi } from "./productAPi";
import { authApi } from "./authApi";
import { userApi } from "./userApi";
import userSlice from "./features/userSlice";
import CartSlice from "./features/cartSlice";
import { orderApi } from "./orderApi";

export const store = configureStore({
  reducer: {
    auth: userSlice,
    cart: CartSlice,
    [productApi.reducerPath]: productApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      productApi.middleware,
      authApi.middleware,
      userApi.middleware,
      orderApi.middleware,
    ),
});
