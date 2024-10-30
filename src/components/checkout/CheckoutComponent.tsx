"use client";
import React from "react";
import { useTotal } from "../context/TotalContext";
import { formatMoney } from "@/utils";
import { useCartPay } from "../context/CartPayContext";
import { useRouter } from "next/navigation";
import { clearRoom, setRoom } from "@/redux/roomSlice";
import { useDispatch } from "react-redux";
import { setOrderType } from "@/redux/orderTypeSlice";
import { useTranslation } from 'react-i18next'; // Import useTranslation

const CheckoutComponent = ({ products }: { products: number }) => {
  const { t } = useTranslation(); // Use useTranslation hook
  const router = useRouter();
  const { total } = useTotal();
  const { selectedItems, getTotalPrice } = useCartPay(); // Use the CartPayContext
  const hasSelectedItems = selectedItems.length > 0;
  const dispatch = useDispatch();

  const handleBuyClick = () => {
    dispatch(clearRoom()); // Clear the room data
    router.push("/checkout"); // Navigate to the checkout page
    dispatch(setOrderType("food"));
  };

  return (
    <div className="bg-white rounded box-shadow p-3">
      <div className=""></div>
      <div className="mb-4 text-black flex flex-col gap-3 ">
        <div className="flex justify-between px-2">
          <p className="font-semibold">{t('checkout.sub_total')}:</p>
          <p className="font-semibold">{formatMoney(getTotalPrice())}</p>
        </div>
        <div className="flex justify-between px-2">
          <p className="font-semibold">{t('checkout.delivery_fee')}:</p>
          <p className="font-semibold">{formatMoney(20)}</p>
        </div>
      </div>
      <div className="rounded text-black font-bold flex justify-between items-center p-2 flex-wrap sm:flex-nowrap">
        <p>{t('checkout.total_payment')} ({products}) {t('checkout.products')}</p>
        <div className="flex gap-3 mt-5 sm:justify-center items-center justify-end w-full sm:w-1/2">
          <p className="text-red-500 text-lg text-start w-[70%] flex justify-start sm:justify-end">
            {products > 0 && getTotalPrice()
              ? formatMoney(getTotalPrice() + 20)
              : 0}
          </p>
          <button
            onClick={handleBuyClick}
            className={`p-5 sm:w-52 w-full text-white float-right rounded ${
              products > 0
                ? "bg-green-500 hover:bg-green-600 active:bg-green-800"
                : "bg-gray-300"
            }`}
          >
            {t('checkout.buy')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutComponent;
