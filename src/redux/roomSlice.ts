import { RoomProp } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Định nghĩa kiểu dữ liệu cho state
interface RoomState {
  room: RoomProp | null; // Có thể là null nếu chưa có phòng nào được chọn
}

// Giá trị khởi tạo của state
const initialState: RoomState = {
  room: null,
};

// Tạo slice
const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    // Action để cập nhật thông tin phòng
    setRoom(state, action: PayloadAction<RoomProp>) {
      state.room = action.payload;
    },
    // Action để xóa thông tin phòng
    clearRoom(state) {
      state.room = null;
    },
  },
});

// Xuất các action và reducer
export const { setRoom, clearRoom } = roomSlice.actions;
export default roomSlice.reducer;
