import { createSlice } from '@reduxjs/toolkit';

const locationDevice = createSlice({
  name: 'checkLocationDevice',
  initialState: { status: true },
  reducers: {
    updateStatus: (state, action) => {
      state.status = action.payload;
    },
  },
});

export const { updateStatus } = locationDevice.actions;
export default locationDevice.reducer;
