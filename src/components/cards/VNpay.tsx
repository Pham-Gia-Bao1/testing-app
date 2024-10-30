import Image from "next/image";
import React from "react";
import VNpayImage from "../../assets/images/wallets/VNpay.jpg";
export default function VNpay() {
  return (
    <div className="w-full mx-auto p-4 bg-white ">
      <Image width={1000} height={1000} alt="Momo Image" src={VNpayImage} />
    </div>
  );
}
