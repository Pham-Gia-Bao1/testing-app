
import { StaticImageData } from "next/image";
import React from "react";

export type PropductProps = {
  params: {
    productId?: string | number;
    userId: string | number;
  };
};
export type PropductParameters = {
  params: {
    productId: number;
  };
}
export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  type: string;
  picture: string;
}
export interface Post {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
}
export interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string | number) => void;
  refreshCart: () => void; // Add refreshCart function to the context
}

export type FieldType = {
  username?: string;
  password?: string;
};
export type DataProductType = {
  name: string;
  price: number;
  description: string;
  type: string;
  picture: string;
};
export interface BoxCardProps {
  cards: Product[];
}
export interface ProductCardProps {
  params: Product;
  getData: () => void;
}
export interface SearchBarProps {
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}
export interface FormSoftProps {
  open: boolean;
  handleCancel: () => void;
  onFinish: (values: any) => void;
  loading: boolean;
}
export interface ProductFormProps {
  id: number;
  open: boolean;
  handleCancel: () => void;
  onFinish: (values: any) => void;
  onFinishFailed: (errorInfo: any) => void;
  form: any; // Form instance type can be more specific if needed
  imageUrl: string;
  fileList: any[];
  handleChange: (info: any) => void;
  loading: boolean;
  types: string[];
  checkTypeForm : number | null;
  isUpload : boolean;

}
export interface HomePageCardSecondLevelProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}
export interface OrderCardProps {
  id: string | number;
  name: string;
  picture: string;
  price: number | string;
  onRemove: (id: string | number | any) => void;
  quantity : number
}
// CartItem.ts
export interface CartItem {
  id: number;
  name: string;
  picture: string;
  type: string;
  description: string;
  price: number ; // Ensure this is a number
}

export interface CartItem {
  quantity: number;
}
export type DataType = {
  name: string;
  price: number;
  description: string;
  type: string;
  picture: string;
};
export type SkeletonsType = {
  variant: "circular" | "rectangular" | "text" | string;
  animation: "wave" | "pulse" | string;
  width: number;
  height: number;
};
export type IntroduceCardType = {
  content: string
}
export type ConversationParameter = number | string;
export interface RectProps {
  imageSrc: string;
  title: string;
}
export interface Message {
  id: number;
  sender_id: number | string;
  recipient_id: number | string;
  content: string;
  read: boolean;
  created_at: string;
  updated_at: string;
  isUser?: boolean;
  isEditing?: boolean;
}
export interface MessageSentEventData {
  message: Message;
}
export type MessagesPageProps = {
  senderId: number | string;
  recipientId: string | number;
};
export interface MessageData {
  sender_id: number | string;
  recipient_id: number | string;
  content: string;
}
export interface SignInValues {
  email: string;
  password: string;
}
export interface RegisterValues {
  name: string;
  email: string;
  password: string;
  role_id: number;
}
export interface UserProfile {
  id: number;
  role_id: number | string;
  name: string;
  email: string;
  password: string;
  address: string;
  created_at: string;
  date_of_birth: string;
  deleted_at: string | null;
  email_verified_at: string;
  gender: string;
  phone_number: string;
  profile_picture: string;
  remember_token: string;
  status: number;
  updated_at: string;
  sent_messages?: Message[];
  received_messages?: Message[];
}
export interface DecodedToken {
  sub: string;
}
export interface CsrfTokenResponse {
  csrf_token: string;
}
export interface LayoutProps {
  children: React.ReactNode;
}
export interface CardRestaurantProps {
  imageUrl: string;
  discount: string;
  title: string;
  restaurant: string;
}
export interface ProductCardProps {
  params: Product;
  getData: () => void;
  openModal: (id: number) => void;
}
export interface AddToCartButtonProps {
  userId: number;
  foodId: number;
  quantity: number;
}
export interface RemoveFromCartButtonProps {
  userId: number | string;
  foodId: number | string;
}
export interface PaymentOptionsProps {
  setPaymentMethod: (method: string) => void;
}
export interface AddressData {
  address: string;
  phone: string;
  name: string;
}
export type FormDataAddNewAddress = {
  name: string;
  address: string;
  phone: string;
}
export type OrderSummaryProps = {
  paymentMethod: string;
  isExitedAddress: boolean;
  totalItems : number;
};
export interface ProductCardCheckOutProps {
  id: number | string;
  imageSrc:  string;
  title: string;
  price: number;
  description: string;
}
export interface AddressFormProps {
  setExitedAddress: React.Dispatch<React.SetStateAction<boolean>>;
}

export type RoomType = {
  id: number;
  name: string;
  description: string;
  price: string;
  capacity: number;
  status: string; // Updated from boolean to string
  star_rating: number; // Changed from rating to star_rating
  room_type: string;
  most_booked_room: number;
  restaurant_name: string;
  image1: string;
  image2: string;
  image3: string;
  created_at: string;
  updated_at: string;
}

export interface RoomProp {
  id: number;
  name: string;
  description: string;
  price: string;
  capacity: number;
  status: string; // Updated from boolean to string
  star_rating: number; // Changed from rating to star_rating
  room_type: string;
  most_booked_room: number;
  restaurant_name: string;
  image1: string;
  image2: string;
  image3: string;
  created_at: string;
  updated_at: string;
}
export interface RoomCardProps {
  id: number;
  roomName: string;
  rating: number;
  description: string;
  price: string;
  imageSrc: string;
  status: string;
}
export interface BookingRoom {
  id?: number;
  user_id: number;
  room_id: number;
  check_in_date: string | Date ;
  check_out_date: string | Date;
  price: string | number;
  payment_status: boolean | number;
  status: string;
  number_of_days: number;
  created_at: string;
  updated_at: string;
}


export type RoomCardCheckoutProps = {
  imageUrl: string;
  roomName: string;
  description: string;
  price: string;
  roomType: string;
  capacity: number;
  startDay: Date | null;
  endDay: Date | null;
  totalDays: number;
};
export interface PosterOptions {
  id: number;
  image: StaticImageData;
  title: string;
}
export interface BookingFood {
  id? : number;
  user_id: number;
  order_number: string | number;
  order_date: string;
  total_amount: number;
  status: string;
  payment_method: string;
  delivery_address: string;
  note?: string; // Note is optional
}

// Định nghĩa kiểu dữ liệu cho Booking Food Item
export interface BookingFoodItem {
  id?: number;
  booking_id: number;
  food_id: number;
  quantity: number;
  price : number;
  // Các trường khác tùy thuộc vào bảng của bạn
}



export interface UserMessage {
  id: number;
  role_id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  password: string; // It's a good practice to avoid exfposing passwords, even as types
  address: string;
  profile_picture: string;
  date_of_birth: string; // Consider using Date type if you plan to parse it
  phone_number: string;
  gender: 'male' | 'female' | 'other'; // Adjust based on your application's needs
  status: number;
  deleted_at: string | null;
  remember_token: string | null;
  created_at: string; // Consider using Date type if you plan to parse it
  updated_at: string; // Consider using Date type if you plan to parse it
  sent_messages: Message[];
  received_messages: Message[];
}
export type UserProfileUpdate = {
  name: string;                // Required: User's name (string)
  email: string;               // Required: User's email (string, email format)
  address: string;             // Required: User's address (string)
  phone_number: string;        // Required: User's phone number (string, 10 digits, starting with 0)
  gender?: string;             // Optional: User's gender (string)
  date_of_birth?: string;      // Optional: User's date of birth (string, format 'YYYY-MM-DD')
  status?: number;             // Optional: User's status (number)
};
// Define an interface for the API response
export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data: UserProfile;
}
export interface SettingsProps {
  listFoods: Product[]; // This prop is an array of Product
}