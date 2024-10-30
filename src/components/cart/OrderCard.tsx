// src/components/OrderCard.tsx
import Image from "next/image";
import Link from "next/link";
import { OrderCardProps } from "@/types";
import React, { useState } from "react";
import { IconButton, CircularProgress } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { updateQuantityOrder } from "@/api";
import { isString } from "lodash";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useCart } from "../context/CartContext";
import { useCartPay } from "../context/CartPayContext";
import DeleteIcon from "@mui/icons-material/Delete";
import { formatMoney } from "@/utils";

const OrderCard: React.FC<OrderCardProps> = ({
  id,
  picture,
  name,
  price,
  onRemove,
  quantity,
}) => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [quantityOrder, setQuantityOrder] = useState(quantity);
  const [loading, setLoading] = useState(false);
  const { cart, removeFromCart, refreshCart } = useCart();
  const { updateItemQuantity } = useCartPay();

  const handleIncrement = () => {
    const newQuantity = quantity + 1;
    setQuantityOrder(newQuantity);
    setLoading(true);
    if (currentUser) {
      updateQuantityOrder({
        userId: currentUser.id,
        foodId: isString(id) ? parseInt(id) : id,
        quantity: newQuantity,
      })
        .then(() => {
          refreshCart();
          updateItemQuantity(id, newQuantity);
          setLoading(false);
        })
        .catch(() => {
          setQuantityOrder(quantity);
          setLoading(false);
        });
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantityOrder(newQuantity);
      setLoading(true);
      if (currentUser) {
        updateQuantityOrder({
          userId: currentUser.id,
          foodId: isString(id) ? parseInt(id) : id,
          quantity: newQuantity,
        })
          .then(() => {
            refreshCart();
            updateItemQuantity(id, newQuantity);
            setLoading(false);
          })
          .catch(() => {
            setQuantityOrder(quantity);
            setLoading(false);
          });
      }
    }
  };
  return (
    <div className="flex items-center p-4 bg-gray-100 rounded m-2 relative w-full">
      <Link
        href={`/settings/products/${id}`}
        className="flex items-center w-full"
      >
        <Image
          src={picture}
          alt={name}
          className="object-cover rounded mr-3"
          width={100} // Adjusted width and height for better image quality
          height={100}
        />
        <div className="flex flex-col flex-grow gap-1">
          <h3 className="text-sm font-semibold truncate-description ">{name}</h3>
          <p className="text-green-500">{formatMoney(Number(price))}</p>
        </div>
      </Link>
      <div className="flex items-center w-3/12">
        <IconButton onClick={handleDecrement} disabled={loading}>
          <Remove />
        </IconButton>
        <span className="text-lg text-black">
          {loading ? <CircularProgress size={20} /> : quantity}
        </span>
        <IconButton onClick={handleIncrement} disabled={loading}>
          <Add />
        </IconButton>
      </div>
      <div className="flex items-center ml-4">
        <button
          onClick={() => onRemove(id)}
          className="text-gray-400 hover:text-red-300 hover:bg-red-100 rounded-full p-2"
        >
          <DeleteIcon />
        </button>
      </div>
    </div>
  );
};

export default OrderCard;
