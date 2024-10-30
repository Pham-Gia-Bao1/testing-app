"use client";
import React, { useState } from "react";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import StoreIcon from "@mui/icons-material/Store";
import CreditCard from "../cards/CreditCard";
import Momo from "../cards/Momo";
import VNpay from "../cards/VNpay";
import { PaymentOptionsProps } from "@/types";
import { useTranslation } from "react-i18next";

const PaymentOptions: React.FC<PaymentOptionsProps> = ({ setPaymentMethod }) => {
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = useState("vnpay");

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setPaymentMethod(option); // Update payment method in parent component
  };

  return (
    <div>
      <div className="flex justify-center items-center gap-2 p-6 bg-white rounded">
        <div
          className={`flex-1 flex flex-col items-center p-2 rounded-lg cursor-pointer ${
            selectedOption === "credit-card" ? "bg-gray-100" : ""
          }`}
          onClick={() => handleOptionClick("credit-card")}
        >
          <LocalShippingIcon
            className="text-green-500"
            style={{ fontSize: 30 }}
          />
          <p
            className={`font-bold mt-1 text-sm ${
              selectedOption === "credit-card" ? "text-black" : "text-gray-400"
            }`}
          >
            {t('payment_options.credit_card')}
          </p>
          <p
            className={`text-gray-600 text-xs ${
              selectedOption === "credit-card" ? "" : "text-gray-400"
            }`}
          >
            {t('payment_options.pay_with_credit_card')}
          </p>
        </div>
        <div
          className={`flex-1 flex flex-col items-center p-2 rounded-lg cursor-pointer ${
            selectedOption === "momo" ? "bg-gray-100" : ""
          }`}
          onClick={() => handleOptionClick("momo")}
        >
          <StoreIcon className="text-green-500" style={{ fontSize: 30 }} />
          <p
            className={`font-bold mt-1 text-sm ${
              selectedOption === "momo" ? "text-black" : "text-gray-400"
            }`}
          >
            {t('payment_options.momo')}
          </p>
          <p
            className={`text-gray-600 text-xs ${
              selectedOption === "momo" ? "" : "text-gray-400"
            }`}
          >
            {t('payment_options.pay_using_momo')}
          </p>
        </div>
        <div
          className={`flex-1 flex flex-col items-center p-2 rounded-lg cursor-pointer ${
            selectedOption === "vnpay" ? "bg-gray-100" : ""
          }`}
          onClick={() => handleOptionClick("vnpay")}
        >
          <StoreIcon className="text-green-500" style={{ fontSize: 30 }} />
          <p
            className={`font-bold mt-1 text-sm ${
              selectedOption === "vnpay" ? "text-black" : "text-gray-400"
            }`}
          >
            {t('payment_options.vnpay')}
          </p>
          <p
            className={`text-gray-600 text-xs ${
              selectedOption === "vnpay" ? "" : "text-gray-400"
            }`}
          >
            {t('payment_options.pay_using_vnpay')}
          </p>
        </div>
      </div>
      <div>
        {selectedOption === "credit-card" && <CreditCard />}
        {selectedOption === "momo" && <Momo />}
        {selectedOption === "vnpay" && <VNpay />}
      </div>
    </div>
  );
};

export default PaymentOptions;
