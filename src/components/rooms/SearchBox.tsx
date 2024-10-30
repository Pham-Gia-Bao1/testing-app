// src/SearchBox.tsx
"use client"
import React, { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';
import { AppDispatch } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { searchRooms } from '@/api/roomAPI';
import { setRooms } from '@/redux/roomsSlice';

const SearchBox: React.FC = () => {
  const { t } = useTranslation();
  const [searchData, setSearchData] = useState({
    name: '',
    price: '',
    capacity: '',
    room_type: ''
  });
  const dispatch = useDispatch<AppDispatch>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = async () => {
    try {
      const searchResult = await searchRooms(searchData);
      console.log('searchhh result' + searchResult);
      dispatch(setRooms(searchResult));
    } catch (error) {
      console.error('Error searching rooms:', error);
    }
  };

  return (
    <div className="flex space-x-4 p-4 bg-white box-shadow rounded-lg">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700">{t('search_box.name_label')}</label>
        <input
          type="text"
          name="name"
          value={searchData.name}
          onChange={handleChange}
          placeholder="Manila"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
        />
      </div>
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700">{t('search_box.price_label')}</label>
        <input
          type="text"
          name="price"
          value={searchData.price}
          onChange={handleChange}
          placeholder="500"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
        />
      </div>
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700">{t('search_box.capacity_label')}</label>
        <input
          type="text"
          name="capacity"
          value={searchData.capacity}
          onChange={handleChange}
          placeholder="5"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
        />
      </div>
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700">{t('search_box.room_type_label')}</label>
        <select
          name="room_type"
          value={searchData.room_type}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
        >
          <option value="">{t('search_box.select_room_type')}</option>
          <option value="single">{t('search_box.single')}</option>
          <option value="multiple">{t('search_box.multiple')}</option>
          <option value="double">{t('search_box.double')}</option>
        </select>
      </div>
      <button
        type="button"
        onClick={handleSearch}
        className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
      >
        <SearchIcon />
        {t('search_box.search_button')}
      </button>
    </div>
  );
};

export default SearchBox;
