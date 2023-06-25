import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    client: null,
  },
  reducers: {
    login: (state, action) => {
      state.client = action.payload;
    },
    question: (state, action) =>{
      state.client.qSlice = action.payload;
    },
    profile: (state, action) =>{
      state.client.pSlice = action.payload;
    },
    logout: (state) => {
      state.client = null;
    },
  },
});

export const { login, logout , question , profile} = userSlice.actions;

export const selectUser = (state) => state.user.client;

export default userSlice.reducer;
