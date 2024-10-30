import { BookingRoom } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OrderDataState {
  orderData: BookingRoom | null;
}

const initialState: OrderDataState = {
  orderData: null
};

const orderDataRoomSlice = createSlice({
  name: 'orderData',
  initialState,
  reducers: {
    setOrderData: (state, action: PayloadAction<any>) => {
      state.orderData = action.payload;
    }
  }
});

export const { setOrderData } = orderDataRoomSlice.actions;

export default orderDataRoomSlice.reducer;
