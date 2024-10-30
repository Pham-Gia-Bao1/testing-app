"use client"
import React from "react";
import Image from "next/image";
import { ProductCardCheckOutProps } from "@/types";
const ProductCartConfirm : React.FC<ProductCardCheckOutProps> = ({
  id,
  imageSrc,
  title,
  price,
  description,
}) => {
  return (
    <div className="flex items-center justify-between p-3 bg-white rounded mb-4">
      <div className="flex items-center">
        <Image
          src={imageSrc}
          alt={title}
          width={100}
          height={100}
        />
        <div className="flex flex-col ml-4">
          <span className="text-xl font-bold text-black truncate-description-1-line">{title}</span>
          <span className="text-black text-sm truncate-description-1-line sm:truncate-description-2-line">{description}</span>
        </div>
      </div>
    </div>
  );
};
export default ProductCartConfirm;
