// components/PopularRoomsBox.tsx
"use client";
import React, { useEffect } from "react";
import { RoomProp } from "@/types";
import { fetchRoomsData } from "@/api/roomAPI";
import RoomCardSkeleton from "../skeleton/RoomCardSkeleton";
import NotFOundImage from "../../assets/images/NotFoundProductImage.webp";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { setRooms } from "@/redux/roomsSlice";

import Image from "next/image";
import { useTranslation } from 'react-i18next'; // Import useTranslation hook
import RoomCard from "./RoomCart";

export default function PopularRoomsBox() {
  const { t } = useTranslation(); // Initialize useTranslation hook
  const dispatch = useDispatch<AppDispatch>();
  const rooms = useSelector((state: RootState) => state.rooms.rooms);
  const [loading, setLoading] = React.useState<boolean>(true);

  const getRooms = async () => {
    setLoading(true);
    try {
      const fetchedRooms = await fetchRoomsData(1);
      dispatch(setRooms(fetchedRooms));
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleClickAll = () => {
    getRooms();
  };

  useEffect(() => {
    getRooms();
  }, [dispatch]);

  const buttonLabels = [t('popular_rooms.button_label')];

  return (
    <div className="py-12 p-4 w-full">
      <div className="flex flex-wrap items-center justify-between p-5 mb-4">
        <h2 className="text-2xl font-bold text-black w-full md:w-2/3 mb-4 md:mb-0">
          {t('popular_rooms.title')}
        </h2>
        <div className="w-full md:w-1/3 flex justify-between sm:justify-end gap-2">
          {buttonLabels.map((label) => (
            <button
              onClick={handleClickAll}
              key={label}
              type="button"
              className="box-shadow w-56 px-4 py-2 text-black hover:bg-gray-100 rounded"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center md:justify-between gap-5">
        {loading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <RoomCardSkeleton key={index} />
          ))
        ) : rooms.length === 0 ? (
          <div className="text-center w-full text-xl font-bold text-gray-700 flex justify-center">
            <Image
              width={500}
              height={500}
              src={NotFOundImage}
              alt={t('popular_rooms.not_found_message')}
            />
          </div>
        ) : (
          rooms.map((room) => (
            <RoomCard
              key={room.id}
              id={room.id}
              roomName={room.name}
              rating={room.star_rating}
              description={room.description}
              price={room.price}
              imageSrc={room.image1}
              status={room.status}
            />
          ))
        )}
      </div>
    </div>
  );
}
