import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
};

export const userSlice = createSlice({
  initialState,
  name: "userSlice",
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    setIsAuthenticated(state, action) {
      console.log("reducer++", state.isAuthenticated);
      state.isAuthenticated = action.payload;
    },
  },
});

export default userSlice.reducer;

export const { setUser, setIsAuthenticated } = userSlice.actions;
