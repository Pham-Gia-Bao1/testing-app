import React, { useState } from "react";
import { IconButton, CircularProgress } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import Image from "next/image";
import { updateQuantityOrder } from "@/api";
import { isString } from "lodash";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useCart } from "../context/CartContext";
import { useCartPay } from "../context/CartPayContext";
import DeleteIcon from "@mui/icons-material/Delete";
import { formatMoney } from "@/utils";
interface ProductCardCheckOutProps {
  id: number | string;
  imageSrc: string;
  title: string;
  price: number;
  type: string;
  description: string;
  quantityProduct: number;
  quantityOrder: number;
  onSelect: (id: number | string, selected: boolean) => void;
  checked: boolean;
}
const ProductCardCheckOut: React.FC<ProductCardCheckOutProps> = ({
  id,
  imageSrc,
  title,
  price,
  type,
  description,
  quantityProduct,
  quantityOrder,
  onSelect,
  checked,
}) => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [quantity, setQuantity] = useState(quantityOrder);
  const [loading, setLoading] = useState(false);
  const { cart, removeFromCart, refreshCart } = useCart();
  const { updateItemQuantity } = useCartPay();
  const handleIncrement = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
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
          setQuantity(quantity);
          setLoading(false);
        });
    }
  };
  const handleDecrement = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
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
            setQuantity(quantity);
            setLoading(false);
          });
      }
    }
  };
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelect(id, e.target.checked);
  };
  const handleProductClick = () => {
    onSelect(id, !checked); // Toggle the checked state
  };
  return (
    <div
      className={`${
        checked ? "bg-green-300" : "bg-white"
      } p-2 box-shadow flex items-center justify-between rounded-lg mb-4 mx-2 relative pt-3`}
      onClick={handleProductClick}
    >
      <div className="flex items-center absolute top-0 mb-5 w-1/12 left-0">
        <input
          type="checkbox"
          onChange={handleCheckboxChange}
          checked={checked}
          className="w-5 h-5 text-center rounded"
          onClick={(e) => e.stopPropagation()} // Prevent the click event from bubbling up to the parent div
        />
      </div>
      <div className="flex w-[40%] sm:gap-3 overflow-hidden sm:w-3/12  mt-5 items-center flex-wrap sm:flex-nowrap">
        <Image
          src={imageSrc}
          alt={title}
          width={100}
          height={100}
        />
        <div className="flex flex-col">
          <span className="sm:text-xl text-sm font-bold text-black truncate-description-1-line">{title}</span>
          <span className="text-black text-xs sm:text-sm  truncate-description-1-line">
            {description}
          </span>
        </div>
      </div>
      <div className="flex items-center sm:w-3/12 w-0 sm:pl-14 ">
        <h1 className="text-black hidden sm:block ">{type}</h1>
      </div>
      <div className="flex items-center w-3/12">
        <IconButton onClick={handleDecrement} disabled={loading}>
          <Remove />
        </IconButton>
        <span className="text-xs sm:text-lg text-black ">
          {loading ? <CircularProgress size={20} /> : quantity}
        </span>
        <IconButton onClick={handleIncrement} disabled={loading}>
          <Add />
        </IconButton>
      </div>
      <div className="flex items-center w-3/12">
        <h1 className="text-red-500 text-xs sm:text-lg">
          {formatMoney(price * quantity)}
        </h1>
      </div>
      <div className="flex items-center w-1/12">
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent the click event from bubbling up to the parent div
            removeFromCart(id);
          }}
          className="text-gray-500 hover:text-red-400 hover:bg-red-200 rounded-full p-2"
        >
          <DeleteIcon />
        </button>
      </div>
    </div>
  );
};
export default ProductCardCheckOut;
