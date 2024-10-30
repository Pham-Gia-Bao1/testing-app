import Image from 'next/image'
import React from 'react'
import MoMoImage from "../../assets/images/wallets/MoMo1.jpg";
export default function Momo() {
  return (
    <div className="w-full mx-auto p-4 bg-white ">
        <Image width={1000} height={1000} alt='Momo Image' src={MoMoImage}/>
    </div>
  )
}
