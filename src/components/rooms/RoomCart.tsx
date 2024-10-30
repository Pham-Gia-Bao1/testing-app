import React from "react";
import StarIcon from "@mui/icons-material/Star";
import Image from "next/image";
import { RoomCardProps } from "@/types";
import Link from "next/link";
import { isString } from "lodash";
import { formatMoney } from "@/utils";
const RoomCard: React.FC<RoomCardProps> = ({
  id,
  roomName,
  rating,
  description,
  price,
  imageSrc,
  status,
}) => {
  return (
    <Link
      href={`/rooms/${id}`}
      passHref
      className="sm:w-[23%] w-full cart-hover rounded overflow-hidden bg-white"
    >
      <div className="relative">
        <Image
          width={300}
          height={300}
          className="w-full h-48 object-cover rounded-lg"
          src={imageSrc}
          alt={roomName}
        />
        <div className="absolute top-0 left-0 m-2 text-orange-500 bg-white rounded-full p-1 px-2 flex items-center">
          <StarIcon className="w-4" />
          <span className="ml-1 text-sm">{rating}</span>
        </div>
      </div>
      <div className="px-2 py-4">
        <div className="font-bold text-xl w-full mb-2 text-black flex items-center justify-between">
          <h4 className="w-1/2">{roomName}</h4>
          <span
            className={`w-3 h-3 rounded-full ${
              status ? "bg-green-400" : "bg-red-400"
            }`}
          ></span>
        </div>
        <p className="text-gray-700 text-base truncate-description">{description}</p>
      </div>
      <div className="px-2 pt-4 pb-2 flex items-center justify-between">
        <span className="font-bold text-lg text-red-500">{formatMoney(isString(price) ? parseInt(price) : price) } / day</span>
      </div>
    </Link>
  );
};
export default RoomCard;
