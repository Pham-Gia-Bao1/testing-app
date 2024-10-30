import Image from "next/image";
import Link from "next/link";
import React from "react";

const HomePageCartRestaurant: React.FC<any> = ({
  imageUrl,
  discount,
  title,
  restaurant,
}) => {
  return (
    <div
      className="relative min-w-[90%] sm:min-w-[24%]  sm:w-80  rounded-lg overflow-hidden cursor-pointer"
      data-aos="fade-up"
    >
      <Link href="foods">
        <Image
          width={1000}
          height={1000}
          src={imageUrl}
          alt={title}
          className="h-48 object-cover"
        />
        <div className="absolute top-0 left-0 bg-green-500 text-white px-2 py-1 rounded-br-lg">
          {discount}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <p className="text-yellow-400 text-sm">Restaurant</p>
          <h3 className="text-white font-bold text-lg">{title}</h3>
          <p className="text-white">{restaurant}</p>
        </div>
      </Link>
    </div>
  );
};

export default HomePageCartRestaurant;
