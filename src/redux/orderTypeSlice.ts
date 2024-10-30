import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OrderTypeState {
  order_type: string;
}

const initialState: OrderTypeState = {
  order_type: ''
};

const orderTypeSlice = createSlice({
  name: 'orderType',
  initialState,
  reducers: {
    setOrderType: (state, action: PayloadAction<string>) => {
      state.order_type = action.payload;
    }
  }
});

export const { setOrderType } = orderTypeSlice.actions;

export default orderTypeSlice.reducer;
