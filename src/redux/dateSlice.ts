import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DatesState {
  checkInDate: Date | null;
  checkOutDate: Date | null;
}

const initialState: DatesState = {
  checkInDate: null,
  checkOutDate: null,
};

const datesSlice = createSlice({
  name: 'dates',
  initialState,
  reducers: {
    setCheckInDate(state, action: PayloadAction<Date | null>) {
      state.checkInDate = action.payload;
    },
    setCheckOutDate(state, action: PayloadAction<Date | null>) {
      state.checkOutDate = action.payload;
    },
  },
});

export const { setCheckInDate, setCheckOutDate } = datesSlice.actions;
export default datesSlice.reducer;
