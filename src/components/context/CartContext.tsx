import { addFoodToCart, getShoppingCart, removeFoodFromCart, updateQuantityOrder } from "@/api";
import { RootState } from "@/redux/store";
import { CartContextType, CartItem } from "@/types";
import { message } from "antd";
import { isString } from "lodash";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { useTotal } from "./TotalContext";

// Define correct import paths and types if needed
const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: any) => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [cart, setCart] = useState<CartItem[]>([]);
  const { total, setTotal } = useTotal();

  // Initialize cart from localStorage
  const initialCart = useMemo(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  }, []);

  useEffect(() => {
    setCart(initialCart);
  }, [initialCart]);

  useEffect(() => {
    if (currentUser) {
      fetchShoppingCart();
    }
  }, [currentUser]);

  // Function to fetch shopping cart items
  const fetchShoppingCart = async () => {
    try {
      if (currentUser) {
        const cartItems = await getShoppingCart(currentUser.id);
        let totalPrice = 0;
        const updatedCart = cartItems.map((cartItem: any) => {
          totalPrice += parseFloat(cartItem.total_price);
          return { ...cartItem.food, quantity: cartItem.quantity };
        });
        setCart(updatedCart);
        setTotal(totalPrice);
      }
    } catch (error) {
      console.error("Error fetching shopping cart:", error);
      // Handle error (e.g., show message to user)
    }
  };

  // Function to add item to cart
  const addToCart = async (item: CartItem) => {
    try {
      if (currentUser) {
        const existingItem = cart.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
          // If item already exists, increase its quantity
          await updateQuantityOrder({
            userId: currentUser.id,
            foodId: isString(item.id) ? parseInt(item.id) : item.id,
            quantity: existingItem.quantity + item.quantity,
          });
          message.success("Increased product quantity successfully");
        } else {
          // If item does not exist, add it to the cart
          await addFoodToCart({
            userId: currentUser.id,
            foodId: isString(item.id) ? parseInt(item.id) : item.id,
            quantity: item.quantity,
          });
          message.success("Added product successfully");
        }
        refreshCart();
      } else {
        message.error("Please log in to add items to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      message.error("Failed to add product to the cart");
    }
  };


  // Function to remove item from cart
  const removeFromCart = async (foodId: string | number) => {
    try {
      if (currentUser) {
        await removeFoodFromCart({ userId: currentUser.id, foodId });
        message.success("Removed product successfully");
        refreshCart();
      }
    } catch (error) {
      console.error("Error removing product from cart:", error);
      message.error("Failed to remove product");
    }
  };

  const refreshCart = () => {
    if (currentUser) {
      fetchShoppingCart();
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use CartContext
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
