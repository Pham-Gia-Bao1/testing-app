import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import userReducer from './userSlice';
import messagesReducer from './messagesSlice';
import dateReducer from './dateSlice';
import dayReducer from './daySlice';
import roomReducer from './roomSlice';
import roomsReducer from './roomsSlice';
import orderTypeReducer from './orderTypeSlice';
import orderDataRoomReducer from './order/orderDataRoomSlice';
const storeApp = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    messages: messagesReducer,
    dates: dateReducer,
    day: dayReducer,
    room: roomReducer,
    rooms : roomsReducer,
    orderType: orderTypeReducer,
    orderDataRRoom: orderDataRoomReducer
  }
});

export type RootState = ReturnType<typeof storeApp.getState>;
export type AppDispatch = typeof storeApp.dispatch;

export default storeApp;
