import React, { useState } from 'react';
interface CreditCardProps {}
const CreditCard: React.FC<CreditCardProps> = () => {
  const [cardInfo, setCardInfo] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: '',
  });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardInfo({ ...cardInfo, [name]: value });
  };
  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };
  return (
    <div className="w-full mx-auto p-4 bg-white">
      <form>
        <div className="grid gap-4">
          <div className="col-span-12">
            <label htmlFor="number" className="block text-sm font-medium text-gray-700">
              Card Number
            </label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={cardInfo.number}
              name="number"
              onChange={handleInputChange}
              onFocus={handleInputFocus}
            />
          </div>
          <div className="col-span-12">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Card Name
            </label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={cardInfo.name}
              name="name"
              onChange={handleInputChange}
              onFocus={handleInputFocus}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1">
              <label htmlFor="expiry" className="block text-sm font-medium text-gray-700">
                Expiration Date
              </label>
              <input
                type="text"
                name="expiry"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={cardInfo.expiry}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
              />
            </div>
            <div className="col-span-1">
              <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">
                CVV
              </label>
              <input
                type="tel"
                name="cvc"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={cardInfo.cvc}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
              />
            </div>
          </div>
        </div>
      </form>
      <div className="mt-6">
        <div className="p-4 bg-indigo-500 text-white rounded-lg shadow-md">
          <div className="text-xl font-bold">{cardInfo.number || '#### #### #### ####'}</div>
          <div className="mt-2">
            <span className="text-sm">Card Holder</span>
            <div className="font-medium">{cardInfo.name || 'NAME SURNAME'}</div>
          </div>
          <div className="flex justify-between mt-4">
            <div>
              <span className="text-sm">Expires</span>
              <div className="font-medium">{cardInfo.expiry || 'MM/YY'}</div>
            </div>
            <div>
              <span className="text-sm">CVV</span>
              <div className="font-medium">{cardInfo.cvc || '***'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreditCard;
