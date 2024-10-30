import { BookingFood, BookingFoodItem, BookingRoom, RoomProp } from "@/types";
import { API_URL } from "@/utils";
import axios from 'axios';
import { handleError } from "./index";
export const fetchRoomsData = async (page: number): Promise<RoomProp[]> => {
    const apiUrl = `${API_URL}/rooms?page=${page}`;
    try {
        const response = await axios.get(apiUrl, {
            withCredentials: true,
        });
        console.log(response.data);
        return response.data.data; // Return fetched data
    } catch (error) {
        throw new Error(handleError(error)); // Handle error and throw custom message
    }
};
export const getRoomDetail = async (roomId: number): Promise<RoomProp> => {
    const apiUrl = `${API_URL}/rooms/${roomId}`;
    try {
        const room = await axios.get<RoomProp>(apiUrl);
        return room.data; // Return fetched room details
    } catch (error) {
        console.error("Failed to fetch room details:", error);
        throw new Error(handleError(error)); // Handle error and throw custom message
    }
};
export const fetchBookingsOfRoom = async (roomId: number): Promise<BookingRoom[]> => {
    const apiUrl = `${API_URL}/bookingRooms/room/${roomId}`;
    try {
        const response = await axios.get<BookingRoom[]>(apiUrl);
        console.log(response.data);
        return response.data; // Return fetched bookings
    } catch (error) {
        console.error("Failed to fetch bookings:", error);
        throw new Error(handleError(error)); // Handle error and throw custom message
    }
};
// food's booking
// Hàm gọi API cho Booking Foods
export const fetchBookingsFood = async (): Promise<BookingFood[]> => {
    const response = await axios.get(`${API_URL}/booking-food`);
    return response.data;
};
export const fetchBookingFoodById = async (id: number): Promise<BookingFood> => {
    const response = await axios.get(`${API_URL}/booking-food/${id}`);
    return response.data;
};
export const createBookingFood = async (bookingData: BookingFood): Promise<BookingFood> => {
    try {
        // Send a POST request to the API with bookingData
        const response = await axios.post(`${API_URL}/booking-food`, bookingData);

        // Return the created booking data from the response
        return response.data;
    } catch (error) {
        // Handle errors (e.g., validation errors, network issues)
        console.error('Error creating booking:', error);
        throw error;
    }
};
export const updateBookingFood = async (id: number, bookingData: BookingFood): Promise<BookingFood> => {
    const response = await axios.put(`${API_URL}/booking-food/${id}`, bookingData);
    return response.data;
};
export const deleteBookingFood = async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/booking-food/${id}`);
};
export const fetchBookingsFoodByUserId = async (userId: number): Promise<BookingFood[]> => {
    const response = await axios.get(`${API_URL}/booking-food/user/${userId}`);
    return response.data;
};
// Hàm gọi API cho Booking Food Items
export const fetchBookingFoodItems = async (): Promise<BookingFoodItem[]> => {
    const response = await axios.get(`${API_URL}/booking-food-items`);
    return response.data;
};
export const fetchBookingFoodItemById = async (id: number): Promise<BookingFoodItem> => {
    const response = await axios.get(`${API_URL}/booking-food-items/${id}`);
    return response.data;
};
export const createBookingFoodItem = async (itemData: BookingFoodItem): Promise<BookingFoodItem> => {
    const response = await axios.post(`${API_URL}/booking-food-items`, itemData);
    return response.data;
};
export const updateBookingFoodItem = async (id: number, itemData: BookingFoodItem): Promise<BookingFoodItem> => {
    const response = await axios.put(`${API_URL}/booking-food-items/${id}`, itemData);
    return response.data;
};
export const deleteBookingFoodItem = async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/booking-food-items/${id}`);
};
// api for booking room
// Hàm gọi API để tạo một đặt phòng mới
export const createBookingRoom = async (bookingRoomData: BookingRoom): Promise<BookingRoom> => {
    const response = await axios.post(`${API_URL}/bookingRooms`, bookingRoomData);
    return response.data;
};
export type SearchRoomData = {
    name: string;
    description?: string;
    status?: boolean;
}
export const searchRooms = async (searchData: SearchRoomData): Promise<RoomProp[]> => {
    try {
        const response = await axios.get(`${API_URL}/rooms/search`, {
            params: searchData, // Use `params` for GET requests
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error('Error searching rooms:', error);
        throw error;
    }
};
export const fetchBookingsRoomByUserId = async (userId: number): Promise<BookingRoom[]> => {
    const response = await axios.get(`${API_URL}/bookingRooms/user/${userId}`);
    return response.data;
};

// export const createNewBookingRoom = async (bookingData: BookingRoom) => {
//     const response = await axios.post(`${API_URL}/bookingRooms`, {
//         withCredentials: true,
//         params: bookingData,
//     })
//     return response.data;
// }