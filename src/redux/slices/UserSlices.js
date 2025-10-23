import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    Id: 0,
    Avatar: '',
    Name: '',
    DepartmentId: '',
    PositionId: '',
    ShiftId: '',
  },
  reducers: {
    updateUserSlice: (state, action) => {
      state.Id = action.payload.UserId;
      state.PositionId = action.payload.PositionId;
      state.ShiftId = action.payload.ShiftId;
    },
    updateAvatar: (state, action) => {
      state.Avatar = action.payload;
    },
    updateName: (state, action) => {
      state.Name = action.payload;
    },
    updateDeparmentId: (state, action) => {
      state.DepartmentId = action.payload;
    },
  },
});

export const { updateUserSlice, updateAvatar, updateName, updateDeparmentId } =
  userSlice.actions;

export default userSlice.reducer;
