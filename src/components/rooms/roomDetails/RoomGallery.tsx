import { useState } from 'react';
import Image from 'next/image';
import { RoomProp } from '@/types';
const RoomGallery: React.FC<{ room: RoomProp }> = ({ room }) => {
  const images = [room.image1, room.image2, room.image3]; // Giả sử room có nhiều ảnh
  const [currentIndex, setCurrentIndex] = useState(0);
  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };
  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };
  return (
    <div className="relative group w-full lg:w-1/2 p-5 overflow-hidden">
      <Image
        width={700}
        height={700}
        src={images[currentIndex]}
        alt="Room image"
        className="w-full h-full object-cover rounded"
      />
      <button
        onClick={handlePrevClick}
        className="absolute top-1/2 left-5 p-3 transform -translate-y-1/2 bg-orange-500 text-white pr-5 rounded-r-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        &#8249;
      </button>
      <button
        onClick={handleNextClick}
        className="absolute top-1/2 right-5 p-3 transform -translate-y-1/2 bg-orange-500 text-white pl-5 rounded-l-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        &#8250;
      </button>
    </div>
  );
};
export default RoomGallery;
