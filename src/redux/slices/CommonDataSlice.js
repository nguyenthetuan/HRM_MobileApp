import { createSlice } from '@reduxjs/toolkit';

const CommonDataSlice = createSlice({
  name: 'CommonDataSlice',
  initialState: {
    deparments: [],
    positions: [],
    shifts: [],
    employeers: [],
  },
  reducers: {
    setDeparments: (state, action) => {
      state.deparments = action.payload;
    },
    setPositions: (state, action) => {
      state.positions = action.payload;
    },
    setShifts: (state, action) => {
      state.shifts = action.payload;
    },
    setEmployeersCommon: (state, action) => {
      state.employeers = action.payload;
    },
  },
});

export const { setDeparments, setPositions, setShifts, setEmployeersCommon } =
  CommonDataSlice.actions;

export default CommonDataSlice.reducer;
