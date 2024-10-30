// store/roomsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RoomProp } from '@/types';
interface RoomsState {
  rooms: RoomProp[];
}
const initialState: RoomsState = {
  rooms: [],
};
const roomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    setRooms(state, action: PayloadAction<RoomProp[]>) {
      state.rooms = action.payload;
    },
    updateRoom(state, action: PayloadAction<RoomProp>) {
      state.rooms = state.rooms.map(room =>
        room.id === action.payload.id ? action.payload : room
      );
    },
    addRoom(state, action: PayloadAction<RoomProp>) {
      state.rooms.push(action.payload);
    },
    deleteRoom(state, action: PayloadAction<number>) {
      state.rooms = state.rooms.filter(room => room.id !== action.payload);
    },
  },
});
export const { setRooms, updateRoom, addRoom, deleteRoom } = roomsSlice.actions;
export default roomsSlice.reducer;
