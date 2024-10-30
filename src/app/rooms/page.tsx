
"use client"
import Image from "next/image";
import React from "react";
import TopRoomImage from "../../assets/images/rooms/TopImageRoom.png";
import HeartIcon from "../../assets/images/HeartIcon.png";
import FirstBgIcon from "../../assets/images/icons/Orange.png";
import SecondBgIcon from "../../assets/images/icons/Mint.png";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import SearchBox from "@/components/rooms/SearchBox";
import BestRooms from "@/components/rooms/BestRooms";
import PopularRoomsBox from "@/components/rooms/PopularRoomsBox";
import Footer from "@/components/layout/Footer";
import Visiter from "../../assets/images/rooms/Visiters.png";
import { useTranslation } from 'react-i18next';

export default function RoomPage() {
  const { t } = useTranslation();

  return (
    <main className="flex min-h-screen flex-col w-[100%] items-center justify-between md:container md:mx-auto">
      <div className="flex-1 p-4 sm:p-8 w-full ">
        <div className="relative w-full sm:h-[80vh] h-auto flex flex-row-reverse gap-3 p-5 justify-between items-center flex-wrap sm:flex-nowrap">
          <div className="flex flex-col justify-center items-center sm:items-start w-full sm:w-[50%] space-y-4 sm:pl-10 ">
            <Image
              width={100}
              height={100}
              src={FirstBgIcon}
              alt="Top Icon"
              className="absolute top-0 right-0"
            />
            <Image
              width={100}
              height={100}
              src={SecondBgIcon}
              alt="Top Icon"
              className="absolute bottom-0 left-0"
            />
            <div className="flex items-center space-x-2 ">
              <Image
                width={24}
                height={24}
                src={HeartIcon}
                alt="Top Icon"
                className="bg-pink-400 p-2 rounded-full"
              />
              <p className="text-sm text-gray-500">{t('home.trustText')}</p>
            </div>
            <h1 className="text-3xl text-center sm:text-start sm:text-6xl font-bold text-red-800">
              {t('home.discoverTitle')}
            </h1>
            <p className="text-lg text-center sm:text-start sm:text-xl text-gray-600">
              {t('home.discoverDescription')}
              <FlightTakeoffIcon className="text-yellow-400" />
            </p>
          </div>
          <div className="w-full relative flex items-center justify-center sm:w-1/2">
            <Image
              width={600}
              height={600}
              src={TopRoomImage}
              alt="Top banner"
              className="object-contain z-10"
            />
            <div className="w-96 h-96 rounded-full bg-orange-500 absolute top-0 left-0 flex items-center justify-center"></div>
          </div>
          <div className="absolute bottom-0 w-[92%] sm:w-[97%] mb-3 z-20 text-black">
            <SearchBox />
          </div>
        </div>
        <div className={`flex items-center justify-between w-full flex-wrap`}>
          <BestRooms />
        </div>
        <div className={`flex items-center justify-between w-full flex-wrap`}>
          <PopularRoomsBox />
        </div>
        <div className={`flex items-center justify-between w-full flex-wrap mt-10`}>
          <div className="flex items-center w-full justify-center">
            <Image width={1500} height={1000} src={Visiter} alt={t('home.visitorsAlt')} />
          </div>
        </div>
        <div><Footer /></div>
      </div>
    </main>
  );
}
