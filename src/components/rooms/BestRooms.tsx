// ./src/components/BestRooms.tsx
"use client";
import Image, { StaticImageData } from 'next/image';
import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook

import RoomImage1 from "../../assets/images/rooms/RoomImage1.jpg";
import RoomImage2 from "../../assets/images/rooms/RoomImage2.jpg";
import RoomImage3 from "../../assets/images/rooms/RoomImage3.jpg";
import RoomImage4 from "../../assets/images/rooms/FavoriteRoom6.jpg";
import RoomImage5 from "../../assets/images/rooms/FavoriteRoom1.jpg";
import RoomImage6 from "../../assets/images/rooms/FavoriteRoom2.jpg";
import RoomImage7 from "../../assets/images/rooms/FavoriteRoom3.jpg";
import RoomImage8 from "../../assets/images/rooms/FavoriteRoom4.jpg";
import RoomImage9 from "../../assets/images/rooms/FavoriteRoom5.jpg";

type Room = {
  id: number;
  name: string;
  destinations: number;
  image: StaticImageData;
};

const rooms: Room[] = [
  {
    id: 1,
    name: 'Portugal',
    destinations: 150,
    image: RoomImage1,
  },
  {
    id: 2,
    name: 'Italy',
    destinations: 240,
    image: RoomImage2,
  },
  {
    id: 3,
    name: 'Switzerland',
    destinations: 180,
    image: RoomImage3,
  },
  {
    id: 4,
    name: 'Vietnam',
    destinations: 100,
    image: RoomImage4,
  },
  {
    id: 5,
    name: 'Vietnam',
    destinations: 100,
    image: RoomImage5,
  },
  {
    id: 6,
    name: 'Vietnam',
    destinations: 100,
    image: RoomImage6,
  },
  {
    id: 7,
    name: 'Vietnam',
    destinations: 100,
    image: RoomImage7,
  },
  {
    id: 8,
    name: 'Vietnam',
    destinations: 100,
    image: RoomImage8,
  },
  {
    id: 9,
    name: 'Vietnam',
    destinations: 100,
    image: RoomImage9,
  },
];

const BestRooms: React.FC = () => {
  const { t } = useTranslation(); // Initialize useTranslation hook
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (scrollRef.current) {
        const maxScrollLeft = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
        if (scrollRef.current.scrollLeft >= maxScrollLeft) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="container p-8">
      <h2 className="text-2xl font-bold mb-4 text-black">{t('best_rooms.title')}</h2>
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide scroll-smooth justify-center overflow-hidden"
        >
          {rooms.map((room) => (
            <div
              key={room.id}
              className="min-w-[24%] relative h-52 flex-shrink-0 bg-white rounded-lg shadow-md overflow-hidden"
            >
              <Image
                src={room.image}
                alt={room.name}
                className="w-full h-full object-cover"
              />
              <div className="p-4 absolute bottom-5 z-10">
                <h3 className="text-lg font-semibold">{room.name}</h3>
                <p className="text-gray-600">{room.destinations} {t('best_rooms.destination_text')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BestRooms;
