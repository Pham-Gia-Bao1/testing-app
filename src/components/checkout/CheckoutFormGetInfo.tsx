"use client";
import { AddressData } from "@/types";
import React, { useState, ChangeEvent, FormEvent } from "react";
const CheckoutFormGetInfo: React.FC = () => {
  const [formData, setFormData] = useState<AddressData>({
    address: '',
    phone: '',
    name: '',
  });
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };
  return (
    <div className="flex justify-center items-center w-full">
      <form onSubmit={handleSubmit} className="w-full bg-white rounded-lg">
        <h2 className="text-2xl font-bold mb-6">Order Information</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Your name"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
            Phone
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Your phone number"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Your address"
            required
          />
        </div>
        <button className="p-2 bg-red-300 shadow-black w-full rounded">
          Save
        </button>
      </form>
    </div>
  );
};
export default CheckoutFormGetInfo;
