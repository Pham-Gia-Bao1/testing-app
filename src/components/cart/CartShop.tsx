import Image from 'next/image'
import React from 'react'
import ShopImage1 from "../../assets/images/Group 16.png";
import ShopImage2 from "../../assets/images/Group 17.png";
import ShopImage3 from "../../assets/images/Group 18.png";
import ShopImage4 from "../../assets/images/Group 19.png";
import ShopImage5 from "../../assets/images/Group 20.png";
import ShopImage6 from "../../assets/images/Group 21.png";
const shops = [
    ShopImage1,
    ShopImage2,
    ShopImage3,
    ShopImage4,
    ShopImage5,
    ShopImage6,
  ];
export default function CartShop() {
  return (
    <div className="flex items-center gap-3 mb-3 justify-evenly w-full flex-wrap">
    {shops.map((value, index) => (
      <Image
        key={index}
        width={220}
        height={150}
        src={value}
        alt="shop image"
      />
    ))}
  </div>
  )
}
