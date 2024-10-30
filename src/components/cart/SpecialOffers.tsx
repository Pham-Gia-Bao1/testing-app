import React from 'react';
import Image from 'next/image';
import kebabImage from '../../assets/images/foods/Food-1.png';
import chickenTikkaImage from '../../assets/images/foods/Food-2.png';
import desiChowmeinImage from '../../assets/images/foods/Food-3.png';
import chickenCharghaImage from '../../assets/images/foods/Food-4.png';
const SpecialOffers = () => {
  const offers = [
    {
      image: kebabImage,
      price: '10$',
      rating: 4.5,
      name: 'Kebab',
      description: 'Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting Industry'
    },
    {
      image: chickenTikkaImage,
      price: '15$',
      rating: 4.8,
      name: 'Chicken Tikka',
      description: 'Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting Industry'
    },
    {
      image: desiChowmeinImage,
      price: '8$',
      rating: 4.2,
      name: 'Desi Chowmein',
      description: 'Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting Industry'
    },
    {
      image: chickenCharghaImage,
      price: '28$',
      rating: 5.0,
      name: 'Chicken Chargha',
      description: 'Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting Industry'
    }
  ];
  return (
    <div className="py-12 w-full bg-red-400">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-gray-800">Today <span className="text-red-500">Special</span> Offers</h2>
        <p className="text-gray-600 mt-4">
          Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting Industry.
          Lorem Ipsum Has Been The Industry is Standard Dummy Text Ever Since The 1500s.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-8">
        {offers.map((offer, index) => (
          <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden w-64">
            <div className="relative">
              <Image
                src={offer.image}
                alt={offer.name}
                className="w-full h-40 object-cover"
                width={256}
                height={160}
              />
              <div className="absolute top-0 left-0 mt-3 ml-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-sm">
                {offer.price}
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="text-yellow-500 mr-1">⭐</div>
                  <div className="text-gray-600 text-sm">({offer.rating})</div>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mt-2">{offer.name}</h3>
              <p className="text-gray-600 mt-2 text-sm">{offer.description}</p>
              <button className="mt-4 bg-red-500 text-white py-2 px-4 rounded-full w-full">Order Now</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default SpecialOffers;
