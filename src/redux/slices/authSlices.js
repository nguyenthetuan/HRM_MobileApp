import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: { token: null },
  reducers: {
    login: (state, action) => {
      state.token = action.payload;
    },
    logoutSlice: (state) => {
      state.token = null;
    },
  },
});

export const { login, logoutSlice } = authSlice.actions;
export default authSlice.reducer;
