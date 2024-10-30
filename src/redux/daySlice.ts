import { createSlice, PayloadAction } from '@reduxjs/toolkit';
interface DayState {
  days: number;
}
const initialState: DayState = {
  days: 0,
};
const daySlice = createSlice({
  name: 'day',
  initialState,
  reducers: {
    setDays(state, action: PayloadAction<number>) {
      state.days = action.payload;
    },
  },
});

export const { setDays } = daySlice.actions;
export default daySlice.reducer;
