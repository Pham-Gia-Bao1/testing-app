"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PaymentOptions from "@/components/checkout/DeliveryCollectionOptions";
import ProductCartConfirm from "@/components/cart/ProductCartConfirm";
import AddressForm from "@/components/form/AddressForm";
import OrderSumaryRoom from "@/components/form/OrderSumaryRoom";
import OrderSummary from "@/components/form/OrderSummary";
import RoomCardCheckout from "@/components/rooms/RoomCartCheckout";
import { useCartPay } from "@/components/context/CartPayContext";
import { useTotal } from "@/components/context/TotalContext";
import { RootState } from "@/redux/store";
import { isString } from "lodash";
import { useAuth } from "@/components/context/AuthContext";
import { useRouter } from "next/navigation";
const CheckOutPage = () => {
  const { selectedItems } = useCartPay();
  const [paymentMethod, setPaymentMethod] = useState<string>("credit-card");
  const [isExitedAddress, setExitedAddress] = useState<boolean>(false);
  const room = useSelector((state: RootState) => state.room.room);
  const days = useSelector((state: RootState) => state.day.days);
  const checkInDate = useSelector((state: RootState) => state.dates.checkInDate);
  const checkOutDate = useSelector((state: RootState) => state.dates.checkOutDate);
  const { total } = useTotal();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  });
  return (
    <div className="text-black bg-gray-100 p-2 sm:p-8 mx-3 grid grid-cols-1 sm:grid-cols-2 gap-5">
      <div className="flex flex-col gap-5">
        <PaymentOptions setPaymentMethod={setPaymentMethod} />
        <div>
          {selectedItems.map((product, index) => (
            <ProductCartConfirm
              key={index}
              id={product.id}
              price={
                isString(product.price) ? parseInt(product.price) : product.price
              }
              title={product.name}
              imageSrc={product.picture}
              description={product.description}
            />
          ))}
        </div>
        {room && (
          <RoomCardCheckout
            capacity={room.capacity}
            description={room.description}
            price={room.price}
            endDay={checkOutDate}
            startDay={checkInDate}
            imageUrl={room.image1}
            roomName={room.name}
            roomType={room.room_type}
            totalDays={total}
          />
        )}
      </div>
      <div className="flex flex-col gap-5">
        <AddressForm setExitedAddress={setExitedAddress} />
        {room ? (
          <OrderSumaryRoom
            totalItems={1}
            paymentMethod={paymentMethod}
            isExitedAddress={isExitedAddress}
          />
        ) : (
          <OrderSummary
            totalItems={selectedItems.length}
            paymentMethod={paymentMethod}
            isExitedAddress={isExitedAddress}
          />
        )}
      </div>
    </div>
  );
};
export default CheckOutPage;
