import { AddToCartButtonProps, ConversationParameter, CsrfTokenResponse, FormDataAddNewAddress, Message, MessageData, Product, RegisterValues, RemoveFromCartButtonProps, SignInValues, UpdateProfileResponse, UserProfile, UserProfileUpdate } from "@/types";
import { API_URL, headerAPI } from "@/utils";
import { message } from "antd";
import axios, { AxiosInstance, AxiosResponse } from 'axios';
export const handleError = (error: any) => {
  if (error.response) {
    console.error('Error response:', error.response.data);
    return `Error: ${error.response.data.message || 'Something went wrong'}`;
  } else if (error.request) {
    // The request was made but no response was received
    console.error('Error request:', error.request);
    return 'Error: No response received from server';
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('Error message:', error.message);
    return `Error: ${error.message}`;
  }
};
export const fetchFoodsData = async (page: number): Promise<Product[]> => {
  const apiUrl = `${API_URL}/foods?page=${page}`;
  try {
    const response = await axios.get(apiUrl, {
      withCredentials: true,
    });
    return response.data.data; // Return fetched data
  } catch (error) {
    message.error(handleError(error));
    throw new Error(handleError(error)); // Handle error and throw custom message
  }
};
export const createFood = async (newFood: Product): Promise<Product> => {
  try {
    const response = await axios.post<Product>(`${API_URL}/foods`, newFood);
    return response.data;
  } catch (error) {
    message.error(handleError(error));
    throw handleError(error);
  }
};
export const updateFood = async (foodId: string, updatedFood: Product): Promise<Product> => {
  try {
    const response = await axios.put<Product>(`${API_URL}/foods/${foodId}`, updatedFood);
    return response.data;
  } catch (error) {
    message.error(handleError(error));
    throw handleError(error);
  }
};
export const deleteFood = async (foodId: string | number): Promise<boolean> => {
  try {
    await axios.delete(`${API_URL}/foods/${foodId}`);
    return true;
  } catch (error) {
    console.error(handleError(error)); // Handle error but return false
    message.error(handleError(error));
    return false;
  }
};
export const search = async (searchTerm: string) => {
  try {
    const response = await axios.post(`${API_URL}/foods/search`, {
      name: searchTerm
    });
    return response.data; // Return the data received from the API
  } catch (error) {
    message.error(handleError(error));
    throw handleError(error);
  }
};
export const getAllPost = async () => {
  try {
    const response = await axios.get(`${API_URL}/posts`);
    return response.data.data;
  } catch (error) {
    message.error(handleError(error));
    throw handleError(error);
  }
};
export const getAllPrice = async (): Promise<number[]> => {
  try {
    const response = await axios.get<number[]>(`${API_URL}/foods/prices`);
    return response.data;
  } catch (error) {
    message.error(handleError(error));
    throw handleError(error);
  }
};
export const getAllType = async (): Promise<string[]> => {
  try {
    const response = await axios.get<string[]>(`${API_URL}/foods/types`);
    return response.data;
  } catch (error) {
    message.error(handleError(error));
    console.error("Failed to fetch types:", handleError(error));
    throw handleError(error);
  }
};
export const filter = async (price: number) => {
  try {
    const response = await axios.get(`${API_URL}/foods/filter/${price}`);
    return response.data;
  } catch (error) {
    message.error(handleError(error));
    throw handleError(error);
  }
};
export const getFoodsByType = async (type: string) => {
  try {
    const response = await axios.get(`${API_URL}/foods/types/${type}`);
    return response.data.data;
  } catch (error) {
    message.error(handleError(error));
    throw handleError(error);
  }
};
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});
export const fetchCsrfToken = async (): Promise<string> => {
  try {
    const response = await axios.get(`${API_URL}/csrf-token`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(response.data.csrf_token);
    return response.data.csrf_token;
  } catch (error: any) {
    console.error('Error fetching CSRF token:', error);
    throw error;
  }
};
export const signInWeb = async (values: SignInValues, csrfToken: string): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await api.post('/auth/login', values, {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken,
      },
    });
    // setsomething here
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
export const register = async (values: RegisterValues, csrfToken: string): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await api.post('/auth/register', values, {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Registration server error:", error);
    throw error;
  }
};
export const getUserProfile = async (): Promise<UserProfile> => {
  const header = headerAPI();
  const apiUrl = `${API_URL}/auth/user-profile`;
  try {
    const response: AxiosResponse<UserProfile> = await api.get(apiUrl, { headers: header });
    setUser(response.data);
    return response.data;
  } catch (error) {
    console.error('Primary server error:', error);
    throw error;
  }
};
export const getExpertProfile = async (userId: number | string) => {
  const header = headerAPI();
  const apiUrl = `${API_URL}/experts/profile/${userId}`;
  try {
    const response = await api.get(apiUrl, { headers: header });
    return response.data;
  } catch (error) {
    throw error;
  }
};
let user: UserProfile | null = null;
export const setUser = (userInfo: UserProfile): void => {
  user = userInfo;
};
export const getUser = (): UserProfile | null => {
  return user;
};
export const getAllUsers = async (page: number): Promise<any> => {
  const header = headerAPI();
  const apiUrl = `${API_URL}/users/messages?page=${page}`;
  try {
    const response: AxiosResponse<any> = await api.get(apiUrl, { headers: header });
    return response.data.data;
  } catch (error) {
    console.error('Primary server error:', error);
    throw error;
  }
};
export const getConversation = async (
  senderId: ConversationParameter,
  recipientId: ConversationParameter,
  page: ConversationParameter = 1
): Promise<{ data: Message[] }> => {
  const header = headerAPI();
  const apiUrl = `${API_URL}/messages/show/${senderId}/${recipientId}?page=${page}`;
  try {
    const response: AxiosResponse<{ data: Message[] }> = await axios.get(apiUrl, { headers: header });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching conversation:', {
      message: error.message,
      config: error.config,
      response: error.response,
    });
    throw error;
  }
};
export const getUserById = async (userId: number | string): Promise<any> => {
  try {
    const user = await axios.get(`${API_URL}/user/profile/${userId}`);
    return user.data;
  } catch (error) {
    console.error('Primary server error:', error);
    throw error;
  }
}
export const createNewMessage = async (messageData: MessageData): Promise<Message> => {
  try {
    const response = await axios.post<Message>(`${API_URL}/messages`, messageData);
    return response.data;
  } catch (error) {
    console.error('Error creating message:', error);
    throw error;
  }
};
export const updateMessage = async (messageId: string | number, updatedMessageData: Partial<MessageData>): Promise<Message> => {
  try {
    const response = await axios.put<Message>(`${API_URL}/messages/${messageId}`, updatedMessageData);
    return response.data;
  } catch (error) {
    console.error('Error updating message:', error);
    throw error;
  }
};
export const deleteMessage = async (messageId: string | number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/messages/${messageId}`);
    console.log('Message deleted successfully');
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
};
export const getShoppingCart = async (userId: number) => {
  try {
    const headers = headerAPI(); // Assuming headerAPI() function returns headers object
    const response = await axios.get<any>(`${API_URL}/shopping-carts`, {
      headers,
      params: {
        user_id: userId
      }
    });
    console.log('Shopping cart items:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching shopping cart:', error);
    throw error;
  }
};
export const addFoodToCart = async ({ userId, foodId, quantity }: AddToCartButtonProps) => {
  try {
    const headers = headerAPI();
    const response = await axios.post<any>(`${API_URL}/shopping-carts`, {
      user_id: userId,
      food_id: foodId,
      quantity: quantity,
    }, {
      headers
    });
    console.log('Added to cart:', response.data);
    return true;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};
export const removeFoodFromCart = async ({ userId, foodId }: RemoveFromCartButtonProps) => {
  try {
    const headers = headerAPI(); // Assuming headerAPI() function returns headers object
    const response = await axios.delete<any>(`${API_URL}/shopping-carts/${foodId}`, {
      headers,
      data: {
        user_id: userId,
      }
    });
    console.log('Removed from cart:', response.data);
    return response.data; // Optionally return data if needed
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error; // Rethrow error to handle it further up the call stack if needed
  }
};
export const updateQuantityOrder = async ({ userId, foodId, quantity }: AddToCartButtonProps) => {
  try {
    const headers = headerAPI();
    const response = await axios.post<any>(`${API_URL}/shopping-carts/set-quantity`, {
      user_id: userId,
      food_id: foodId,
      quantity: quantity,
    }, {
      headers
    });
    console.log('update quantity:', response.data);
    return response ? true : false;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};
export const addNewDeliveryAddress = async (data: FormDataAddNewAddress) => {
  try {
    const headers = headerAPI(); // Assuming headerAPI() provides the headers
    const response = await axios.post<any>(`${API_URL}/add-new-address`, {
      name: data.name,
      address: data.address,
      phone: data.phone  // Ensure this matches your backend field name
    }, {
      headers
    });
    console.log('Address added successfully:', response.data);
    return response.data; // Return whatever response structure you expect
  } catch (error) {
    console.error('Error adding address:', error);
    throw error;
  }
};
export const makePayment = async (price: number) => {
  const headers = headerAPI();
  try {
    const paymentResponse = await axios.post(
      `${API_URL}/payment`,
      {
        total: price,
      },
      {
        headers,
      }
    );
    const { data } = paymentResponse;
    return data; // Trả về dữ liệu từ phản hồi của API (nếu cần)
  } catch (error) {
    console.error('Error making payment:', error);
    throw error; // Ném lỗi để xử lý ở một nơi khác (nếu cần)
  }
};

export const updateProfileImage = async (profile_picture: string): Promise<UserProfile> => {
  const headers = headerAPI();
  try {
    const response = await axios.patch(
      `${API_URL}/user/profile-image`,
      { profile_picture }, // Ensure this matches what your API expects
      { headers }
    );
    console.log(response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("Error updating profile image:", error);
    throw error; // Throw error to be caught by the caller
  }
};


export const updateProfile = async (dataUpdate: UserProfileUpdate): Promise<UserProfile> => {
  const headers = headerAPI();

  try {
    // Make the API request and specify the response type
    const response = await axios.patch<UpdateProfileResponse>(
      `${API_URL}/user/profile`,
      dataUpdate, // Send dataUpdate directly as the backend expects
      { headers }
    );

    // Log the response data for debugging
    console.log(response.data.data);

    // Return the `data` property from the response
    return response.data.data; // This should now be of type UserProfile
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error; // Throw error to be caught by the caller
  }
};