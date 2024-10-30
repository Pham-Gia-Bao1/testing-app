import { HomePageCardSecondLevelProps } from '@/types';
import React from 'react';
const HomePageCardSecondLevel: React.FC<HomePageCardSecondLevelProps> = ({ icon, title, description }) => {
  return (
    <div className="flex flex-col items-center justify-center w-64 p-6 border border-gray-300 rounded-lg shadow-lg bg-white">
      <div className="flex items-center justify-center w-16 h-16 mb-4 bg-orange-600 rounded-full">
        {icon}
      </div>
      <h3 className="m-0 text-xl font-semibold text-gray-800">{title}</h3>
      <p className="mt-2 text-center text-gray-600">
        {description}
      </p>
    </div>
  );
};
export default HomePageCardSecondLevel;
