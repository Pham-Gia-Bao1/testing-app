import React from "react";
import { useTotal } from "../context/TotalContext";
import { makePayment } from "@/api";
import { useRouter } from "next/navigation";
import { BookingRoom, OrderSummaryProps } from "@/types";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { setOrderData } from "@/redux/order/orderDataRoomSlice";
import { format } from "date-fns";

const OrderSumaryRoom = ({
  paymentMethod,
  isExitedAddress,
  totalItems,
}: OrderSummaryProps) => {
  const dispatch: AppDispatch = useDispatch();
  const orderData = useSelector(
    (state: RootState) => state.orderDataRRoom.orderData
  );
  const { total } = useTotal();
  const router = useRouter();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const room = useSelector((state: RootState) => state.room.room);
  const orderType = useSelector((state: RootState) => state.orderType.order_type);
  const isOrderEnabled = paymentMethod && isExitedAddress;
  const checkInDate = useSelector(
    (state: RootState) => state.dates.checkInDate
  );
  const checkOutDate = useSelector(
    (state: RootState) => state.dates.checkOutDate
  );
  const days = useSelector((state: RootState) => state.day.days);

  const handlePlaceOrder = async () => {
    // Tạo dữ liệu đơn hàng nếu currentUser và room tồn tại
    if (currentUser && room && checkInDate && checkOutDate) {
      const orderData: BookingRoom = {
        user_id: currentUser.id,
        room_id: room.id,
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        price: room.price,
        number_of_days: days,
        status: "booked",
        payment_status: true,
        created_at: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        updated_at: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      };
      // Lưu dữ liệu vào Redux
      dispatch(setOrderData(orderData));

      const orderDetails = {
        orderData,
        total,
        currentUser,
        room,
        checkInDate,
        checkOutDate,
        days,
        orderType
      };
      sessionStorage.setItem('orderDetails', JSON.stringify(orderDetails));
    }
    try {
      // Thực hiện thanh toán
      const paymentResponse = await makePayment(total * 1000);
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
      <button
        onClick={handlePlaceOrder}
        className={`border-t w-full py-2 rounded-md font-bold mt-2 p-5 my-5 ${
          isOrderEnabled ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-300 cursor-not-allowed"
        }`}
        disabled={!isOrderEnabled}
      >
        Place Order
      </button>
      <p className="text-sm text-center mt-1">
        By placing your order, you agree to our company
        <a href="#" className="text-blue-600 underline">
          Privacy policy
        </a>
        addNewDeliveryAddress
        <a href="#" className="text-blue-600 underline">
          Conditions of use
        </a>
        .
      </p>
    </div>
  );
};

export default OrderSumaryRoom;
