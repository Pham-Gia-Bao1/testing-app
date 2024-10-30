import React from 'react';
import Image from 'next/image';
import chefImage from '../../assets/images/ChefSecondImage.png';
import onlineOrderIcon from '../../assets/images/Chef.png';
import reservationIcon from '../../assets/images/Chef.png';
import superChefIcon from '../../assets/images/Chef.png';
import serviceIcon from '../../assets/images/Chef.png';
import foodhutIcon from '../../assets/images/Chef.png';
import kitchenIcon from '../../assets/images/Chef.png';

const MultipleServices = () => {
  const services = [
    { icon: onlineOrderIcon, name: 'Online Order' },
    { icon: reservationIcon, name: 'Pre-Reservation' },
    { icon: superChefIcon, name: 'Super Chef' },
    { icon: serviceIcon, name: '24/7 Service' },
    { icon: foodhutIcon, name: 'Organized Foodhut Place' },
    { icon: kitchenIcon, name: 'Clean Kitchen' },
  ];

  return (
    <div className="py-12 bg-white flex flex-col items-center">
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
        <div className="relative w-full lg:w-[30%]">
          <Image
            src={chefImage}
            alt="Chef"
            className="w-full h-auto object-cover rounded-lg"
            width={400}
            height={400}
          />
        </div>
        <div className="lg:w-1/2 text-center lg:text-left">
          <h2 className="text-4xl font-bold text-gray-800">
            We are <span className="text-red-500">more</span> than <span className="text-yellow-500">multiple</span> service
          </h2>
          <p className="text-gray-600 mt-4">
            This is a type of restaurant which typically serves food and drink, in addition to light refreshments such as baked goods or snacks. The term comes from the French word meaning food.
          </p>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {services.map((service, index) => (
              <div key={index} className="flex items-center">
                <Image
                  src={service.icon}
                  alt={service.name}
                  className="w-8 h-8 object-contain"
                  width={32}
                  height={32}
                />
                <span className="ml-4 text-gray-800">{service.name}</span>
              </div>
            ))}
          </div>
          <button className="mt-8 bg-red-500 text-white py-2 px-4 rounded-full">
            About Us
          </button>
        </div>
      </div>
    </div>
  );
};

export default MultipleServices;
