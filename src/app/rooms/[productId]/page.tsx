"use client";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BookingRoom, PropductParameters, RoomProp } from "@/types";
import { fetchBookingsOfRoom, getRoomDetail } from "@/api/roomAPI";
import { capitalizeFirstLetter, formatMoney, LOGO } from "@/utils";
import WifiIcon from "@mui/icons-material/Wifi";
import LocalLaundryServiceIcon from "@mui/icons-material/LocalLaundryService";
import AirIcon from "@mui/icons-material/Air";
import WineBarIcon from "@mui/icons-material/WineBar";
import { Button, Rate } from "antd";
import RoomGallery from "@/components/rooms/roomDetails/RoomGallery";
import PopularRoomsBox from "@/components/rooms/PopularRoomsBox";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import ContactImage from "../../../assets/images/rooms/RoomListBottomImage.png";
import GoogleMapEmbed from "@/components/map/Map";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setCheckInDate, setCheckOutDate } from "@/redux/dateSlice";
import { useTotal } from "@/components/context/TotalContext";
import { setDays } from "@/redux/daySlice";
import { setRoom } from "@/redux/roomSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartPay } from "@/components/context/CartPayContext";
import { setOrderType } from "@/redux/orderTypeSlice";
import Loading from "@/components/loading/Loading";
const RoomDetail: React.FC<PropductParameters> = ({ params }) => {
  const days = useSelector((state: RootState) => state.day.days);
  const { clearCartPay } = useCartPay();
  const dispatch = useDispatch();
  const checkInDate = useSelector(
    (state: RootState) => state.dates.checkInDate
  );
  const checkOutDate = useSelector(
    (state: RootState) => state.dates.checkOutDate
  );
  const { total, setTotal } = useTotal();
  const [rating, setRating] = useState<number>(0);
  const room = useSelector((state: RootState) => state.room.room);
  const [dateError, setDateError] = useState<string>("");
  const [bookings, setBookings] = useState<BookingRoom[]>([]);
  const router = useRouter();
  const getBookingsOfRoom = async () => {
    try {
      const result = await fetchBookingsOfRoom(params.productId);
      setBookings(result);
    } catch (error) {
      console.error(error);
    }
  };
  const handleRateChange = (value: number) => {
    setRating(value);
  };
  const handleBuyClick = () => {
    clearCartPay(); // Clear the cart data
    dispatch(setOrderType("room"));
    router.push("/checkout"); // Navigate to the checkout page
  };
  const handleDateChange = () => {
    if (checkInDate && checkOutDate) {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      const now = new Date();
      if (checkIn > now && checkOut > checkIn) {
        const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        dispatch(setDays(diffDays));
        if (room) {
          const pricePerDay = parseInt(room.price, 10) || 0;
          setTotal(pricePerDay * diffDays);
        } else {
          setTotal(0);
        }
        setDateError("");
      } else {
        dispatch(setDays(0));
        setTotal(0);
        if (checkIn <= now) {
          setDateError("Check-in date must be greater than the current date.");
        } else if (checkOut <= checkIn) {
          setDateError(
            "Check-out date must be greater than the check-in date."
          );
        } else {
          setDateError("Invalid date range.");
        }
      }
    }
  };
  useEffect(() => {
    const fetchRoomDetail = async () => {
      try {
        const roomDetail = await getRoomDetail(params.productId);
        dispatch(setRoom(roomDetail));
      } catch (error) {
        console.error("Failed to fetch room details:", error);
      }
    };
    fetchRoomDetail();
    getBookingsOfRoom();
  }, [params.productId]);
  useEffect(() => {
    handleDateChange();
  }, [checkInDate, checkOutDate]);
  const isDateAvailable = (date: Date) => {
    for (const booking of bookings) {
      const bookedStart = new Date(booking.check_in_date);
      const bookedEnd = new Date(booking.check_out_date);
      if (date >= bookedStart && date <= bookedEnd) {
        return false; // Date is within a booked range
      }
    }
    return true; // Date is available
  };
  const filterDates = (date: Date) => {
    return isDateAvailable(date);
  };
  if (!room) {
    return (
      <p className="w-full h-[60vh] flex justify-center items-center">
        <Loading />
      </p>
    );
  }
  return (
    <>
      <head>
        <title>{room ? room.name : "Loading..."}</title>
        <meta
          name="description"
          content={room ? room.description : "Loading product details..."}
        />
        <link rel="icon" href={LOGO} />
      </head>

      <main className="flex min-h-screen sm:px-10 px-5 flex-col w-full items-center justify-between md:container md:mx-auto">
        <div className="flex w-full mt-10 gap-10 flex-col items-center text-black">
          <div className="w-full flex flex-wrap lg:flex-nowrap">
            <RoomGallery room={room} />
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-5">
              <div className="mb-5 w-full flex justify-between items-center bg-gray-200 p-3 rounded">
                <h3 className="text-3xl font-bold">{room.name}</h3>
                <div className="flex items-center justify-center">
                  <span>Active</span>
                  <span className="w-5 h-5 inline-block ml-2 rounded-full bg-green-500"></span>
                </div>
              </div>
              <div className="mb-5 w-full flex justify-between">
                <p className="sm:text-lg">{room.description}</p>
              </div>
              <div className="mb-5 w-full flex justify-between items-center bg-gray-200 p-3 rounded">
                <div className="bg-gray-200 sm:w-[20%] w-[10%] h-12 rounded flex flex-col p-7 items-center justify-center text-green-500">
                  <WifiIcon />
                  <p>Wifi</p>
                </div>
                <div className="bg-gray-200 sm:w-[20%] w-[10%] h-12 rounded flex flex-col p-7 items-center justify-center text-green-500">
                  <LocalLaundryServiceIcon />
                  <p>Laundry</p>
                </div>
                <div className="bg-gray-200 sm:w-[20%] w-[10%] h-12 rounded flex flex-col p-7 items-center justify-center text-green-500">
                  <AirIcon />
                  <p>AC</p>
                </div>
                <div className="bg-gray-200 sm:w-[20%] w-[10%] h-12 rounded flex flex-col p-7 items-center justify-center text-green-500">
                  <WineBarIcon />
                  <p>Wine</p>
                </div>
              </div>
              <div className="mb-5 w-full flex justify-between text-center items-center flex-wrap">
                <p className="sm:text-lg font-bold text-green-500">
                  {formatMoney(parseInt(room.price))} / 1 day
                </p>
                <Rate
                  allowHalf
                  value={room.star_rating}
                  onChange={handleRateChange}
                />
              </div>
              <div className="mb-5 w-full flex justify-between text-center font-bold">
                <p className="p-2 rounded bg-orange-100">
                  {capitalizeFirstLetter(room.room_type)} room
                </p>
                <p className="p-2 rounded bg-orange-100">
                  Capacity: {room.capacity} people
                </p>
              </div>
              <div className="mb-5 w-full flex justify-between text-center items-end flex-wrap bg-gray-200 p-3 rounded">
                <div className="w-full grid grid-cols-2 gap-5">
                  <div className="flex gap-2 w-full pb-3 items-start flex-col">
                    <label className="text-sm">Check-in day:</label>
                    <DatePicker
                      selected={checkInDate}
                      onChange={(date) => dispatch(setCheckInDate(date))}
                      filterDate={filterDates}
                      minDate={new Date()}
                      placeholderText="Select check-in date"
                      className="bg-white w-full text-black px-3 py-2 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                      dateFormat="yyyy-MM-dd"
                    />
                  </div>
                  <div className="flex gap-2 w-full items-start flex-col">
                    <label className="text-sm">Check-out day:</label>
                    <DatePicker
                      selected={checkOutDate}
                      onChange={(date) => dispatch(setCheckOutDate(date))}
                      filterDate={filterDates}
                      minDate={checkInDate ? new Date(checkInDate) : new Date()}
                      placeholderText="Select check-out date"
                      className="bg-white w-full text-black px-3 py-2 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                      dateFormat="yyyy-MM-dd"
                    />
                  </div>
                </div>
                {dateError && <p className="text-red-500">{dateError}</p>}
              </div>
              <div className="mb-5 w-full flex justify-between text-center items-center flex-wrap bg-gray-200 p-3 rounded">
                <div className="flex gap-3">
                  <p className="font-bold text-xl">
                    Days: ({days > 0 ? days : "0"})
                  </p>
                  <p className="font-bold text-xl">
                    Money: ({days > 0 ? formatMoney(total) : "0"})
                  </p>
                </div>
                <button
                  onClick={handleBuyClick}
                  className={`px-5 py-5 rounded w-full m-3 sm:w-auto ${
                    days > 0
                      ? "bg-green-500 text-white cursor-pointer hover:bg-green-600"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                  disabled={days <= 0}
                >
                  Booking now
                </button>
              </div>
            </div>
          </div>
          <div className="w-full sm:h-96 h-80">
            <GoogleMapEmbed />
          </div>
          <div className="w-full my-10 mt-96">
            <PopularRoomsBox />
          </div>
          <div className="flex w-full items-center justify-between p-10 bg-gray-200 rounded-3xl">
            <Image src={ContactImage} alt="Friends laughing using mobiles" />
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
};
export default RoomDetail;
