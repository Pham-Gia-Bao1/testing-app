import React from "react";
import { useTotal } from "../context/TotalContext";
import { formatMoney } from "@/utils";
import { makePayment } from "@/api";
import { useRouter } from "next/navigation";
import { BookingFood, OrderSummaryProps } from "@/types";
import { useCartPay } from "../context/CartPayContext";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { setOrderData } from "@/redux/order/orderDataRoomSlice";
import { useTranslation } from "react-i18next"; // Import useTranslation

const OrderSummary = ({
  paymentMethod,
  isExitedAddress,
  totalItems,
}: OrderSummaryProps) => {
  const { t } = useTranslation(); // Use useTranslation hook
  const { getTotalPrice, selectedItems } = useCartPay();
  const shippingCost = 20;
  const itemTotal = getTotalPrice();
  const orderTotal = itemTotal + shippingCost;
  const isOrderEnabled = paymentMethod && isExitedAddress;
  const router = useRouter();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const dispatch: AppDispatch = useDispatch();
  const orderType = useSelector((state: RootState) => state.orderType.order_type);

  const handlePlaceOrder = async () => {
    if (currentUser) {
      const orderData: BookingFood = {
        user_id: currentUser.id,
        order_number: selectedItems.length,
        order_date: new Date().toLocaleDateString(), // Formats date to a readable format
        total_amount: getTotalPrice(),
        status: "pending",
        payment_method: "vnPay",
        delivery_address: currentUser.address,
        note: "", // This field can be undefined
      };
      dispatch(setOrderData(orderData));
      const orderDetails = {
        orderData,
        currentUser,
        orderType,
        selectedItems
      };
      sessionStorage.setItem("orderDetails", JSON.stringify(orderDetails));
    }

    try {
      const paymentResponse = await makePayment(orderTotal * 1000);
      console.log(paymentResponse);
      const { data } = paymentResponse;
      if (paymentResponse.code === "00") {
        router.push(data);
      } else {
        console.error("Failed to get payment URL");
      }
    } catch (error: any) {
      console.error("Error making payment:", error);
    }
  };

  return (
    <div className="text-black w-full mx-auto bg-white p-6 rounded">
      <div className="mt-4 pt-4">
        <h2 className="text-lg font-bold">{t('order_summary.title')}</h2>
        <div className="flex justify-between mt-2">
          <span>{t('order_summary.items', { count: totalItems })}</span>
          <span>{formatMoney(itemTotal)}</span>
        </div>
        <div className="flex justify-between mt-2">
          <span>{t('order_summary.shipping_and_handling')}</span>
          <span>{formatMoney(shippingCost)}</span>
        </div>
      </div>
      <div className="mt-4 border-t pt-4 flex justify-between">
        <span className="font-bold">{t('order_summary.order_total')}:</span>
        <span className="font-bold">{formatMoney(orderTotal)} vnd</span>
      </div>
      <button
        onClick={handlePlaceOrder}
        className={`border-t w-full py-2 rounded-md font-bold mt-2 p-5 my-5 ${
          isOrderEnabled
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : "bg-gray-300 cursor-not-allowed"
        }`}
        disabled={!isOrderEnabled}
      >
        {t('order_summary.place_order')}
      </button>
      <p className="text-sm text-center mt-1">
        {t('order_summary.agree_to')}{" "}
        <a href="#" className="text-blue-600 underline">
          {t('order_summary.privacy_policy')}
        </a>{" "}
        {t('order_summary.and')}{" "}
        <a href="#" className="text-blue-600 underline">
          {t('order_summary.conditions_of_use')}
        </a>
        .
      </p>
    </div>
  );
};

export default OrderSummary;
