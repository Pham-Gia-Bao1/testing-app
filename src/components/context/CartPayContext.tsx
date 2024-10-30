import React, { createContext, useContext, useState, ReactNode } from "react";
import { CartItem } from "@/types";

interface CartPayContextProps {
  selectedItems: CartItem[];
  addToCartPay: (item: CartItem) => void;
  removeFromCartPay: (id: number | string) => void;
  updateItemQuantity: (id: number | string, quantity: number) => void;
  clearCartPay: () => void;
  getTotalPrice: () => number; // Define as a function returning a number
}

const CartPayContext = createContext<CartPayContextProps | undefined>(
  undefined
);

export const useCartPay = () => {
  const context = useContext(CartPayContext);
  if (!context) {
    throw new Error("useCartPay must be used within a CartPayProvider");
  }
  return context;
};

export const CartPayProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedItems, setSelectedItems] = useState<CartItem[]>([]);

  const addToCartPay = (item: CartItem) => {
    setSelectedItems((prev) => [...prev, item]);
  };

  const removeFromCartPay = (id: number | string) => {
    setSelectedItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateItemQuantity = (id: number | string, quantity: number) => {
    setSelectedItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCartPay = () => {
    setSelectedItems([]);
  };

  const getTotalPrice = () => {
    return selectedItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  return (
    <CartPayContext.Provider
      value={{
        selectedItems,
        addToCartPay,
        removeFromCartPay,
        updateItemQuantity,
        clearCartPay,
        getTotalPrice,
      }}
    >
      {children}
    </CartPayContext.Provider>
  );
};
