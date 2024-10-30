"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCheckInDate, setCheckOutDate } from "@/redux/dateSlice";
import { setDays } from "@/redux/daySlice";
import { setOrderData } from "@/redux/order/orderDataRoomSlice";
import { setRoom } from "@/redux/roomSlice";
import { setCurrentUser } from "@/redux/userSlice";
import { TextField } from "@mui/material";
import Image from "next/image";
import ProfileImage from "../../assets/images/ProfileUser.png";
import { RootState } from "@/redux/store";
import {
  BookingFood,
  BookingFoodItem,
  BookingRoom,
  CartItem,
  UserProfile,
  UserProfileUpdate,
} from "@/types";
import confetti from "canvas-confetti";
import { signOut } from "next-auth/react";
import { Avatar } from "@mui/material";
import {
  createBookingFood,
  createBookingFoodItem,
  createBookingRoom,
  fetchBookingsFoodByUserId,
  fetchBookingsRoomByUserId,
  getRoomDetail,
} from "@/api/roomAPI";
import { message as antMessage, Button, message, Upload } from "antd";
import {
  convertToStaticImport,
  formatMoney,
  generateRandomString,
  getUrlUpdateUserImg,
} from "@/utils";
import { isString } from "lodash";
import { useCart } from "@/components/context/CartContext";
import { clearToken } from "@/redux/authSlice";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/context/AuthContext";
import { Select } from "antd";
const { Option } = Select;
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { updateProfile, updateProfileImage } from "@/api";
import { useTranslation } from "react-i18next";
const Profile: React.FC = () => {
  const { t } = useTranslation();
  const { cart, refreshCart, removeFromCart } = useCart();
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const roomDetail = useSelector((state: RootState) => state.room.room);
  const router = useRouter();
  const [expandedBooking, setExpandedBooking] = useState<number | null>(null);
  const [bookingsFood, setBookingsFood] = useState<BookingFood[]>([]);
  const [bookingsRoom, setBookingsRoom] = useState<BookingRoom[]>([]);
  const [selectedItems, setSelectedItems] = useState<CartItem[]>([]); // Add state for selectedItems
  const { isAuthenticated } = useAuth();
  const [imageUrl, setImageUrl] = useState<string>(
    currentUser?.profile_picture || ProfileImage.src
  );
  const [fileList, setFileList] = useState<any[]>([]);
  const [name, setName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [address, setAddress] = useState(currentUser?.address || "");
  const [dateOfBirth, setDateOfBirth] = useState(
    currentUser?.date_of_birth || ""
  );
  const [gender, setGender] = useState(currentUser?.gender || "");
  const [phoneNumber, setPhoneNumber] = useState(
    currentUser?.phone_number || ""
  );
  const [isUpdated, setIsUpdated] = useState<boolean>(false);
  const [loadingButton, setLoadingButton] = useState<boolean>(false);
  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     router.push("/login");
  //   }
  // });
  useEffect(() => {
    const savedOrderDetails = sessionStorage.getItem("orderDetails");
    if (savedOrderDetails) {
      const {
        orderData,
        total,
        currentUser,
        room,
        checkInDate,
        checkOutDate,
        days,
        orderType,
        selectedItems,
      } = JSON.parse(savedOrderDetails);
      // Update Redux state
      dispatch(setOrderData(orderData));
      dispatch(setCurrentUser(currentUser));
      if (orderType === "room") {
        dispatch(setRoom(room));
        dispatch(setCheckInDate(checkInDate));
        dispatch(setCheckOutDate(checkOutDate));
        dispatch(setDays(days));
        const formattedData = {
          ...orderData,
          check_in_date: new Date(orderData.check_in_date)
            .toISOString()
            .slice(0, 19)
            .replace("T", " "),
          check_out_date: new Date(orderData.check_out_date)
            .toISOString()
            .slice(0, 19)
            .replace("T", " "),
          price: parseFloat(orderData.price),
        };
        createNewBookingRoom(formattedData);
      } else {
        // Create a new booking for food
        createNewBookingFood(orderData, selectedItems);
      }
      if (selectedItems) {
        setSelectedItems(selectedItems); // Store selected items in state
      }
      // Remove the saved order details from session storage
      sessionStorage.removeItem("orderDetails");
      // Trigger the confetti effect
      const fire = (particleRatio: number, opts: any) => {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      };
      const count = 200;
      const defaults = {
        origin: { y: 0.7 },
      };
      fire(0.25, {
        spread: 26,
        startVelocity: 55,
      });
      fire(0.2, {
        spread: 60,
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });
    }
  }, [dispatch]);
  useEffect(() => {
    if (currentUser) {
      Promise.all([fetchBookingsFood(), fetchBookingsRoom()]);
      // Remove selected items from cart if currentUser is available
      if (selectedItems.length > 0 && cart.length > 0) {
        const selectedItemIds = new Set(selectedItems.map((item) => item.id));
        cart.forEach((cartItem) => {
          if (selectedItemIds.has(cartItem.id)) {
            removeFromCart(cartItem.id);
          }
        });
        console.log("Selected items removed from cart");
        refreshCart();
        setSelectedItems([]); // Clear the selected items after removal
      }
    }
  }, [currentUser, selectedItems, removeFromCart]);
  const fetchBookingsFood = useCallback(async () => {
    try {
      if (currentUser) {
        const bookingFoods = await fetchBookingsFoodByUserId(currentUser.id);
        setBookingsFood(bookingFoods);
      }
    } catch (error) {
      console.log(error);
    }
  }, [currentUser]);
  const fetchBookingsRoom = useCallback(async () => {
    try {
      if (currentUser) {
        const bookingRooms = await fetchBookingsRoomByUserId(currentUser.id);
        setBookingsRoom(bookingRooms);
      }
    } catch (error) {
      console.log(error);
    }
  }, [currentUser]);
  const createNewBookingRoom = useCallback(async (data: BookingRoom) => {
    try {
      const result = await createBookingRoom(data);
      if (result) {
        antMessage.success("Booking successfully!");
      }
    } catch (error) {
      antMessage.error("Add booking failed");
      console.log(error);
    }
  }, []);
  const createNewBookingFood = useCallback(
    async (data: BookingFood, selectedItems: CartItem[]) => {
      try {
        const bookingData = {
          user_id: data.user_id,
          order_number: generateRandomString() + "OD" + data.order_number,
          order_date: new Date().toISOString().split("T")[0],
          total_amount: data.total_amount,
          status: data.status,
          payment_method: data.payment_method,
          delivery_address: data.delivery_address,
          note: data.note || "",
        };
        const bookingResult = await createBookingFood(bookingData);
        if (bookingResult) {
          const bookingId = bookingResult.id;
          antMessage.success("Create new booking food successfully!");
          const bookingPromises = selectedItems.map((item) => {
            if (bookingId) {
              const bookingFoodItem: BookingFoodItem = {
                booking_id: bookingId,
                food_id: item.id,
                quantity: item.quantity,
                price: item.price * item.quantity,
              };
              return createBookingFoodItem(bookingFoodItem);
            }
            return null;
          });
          await Promise.all(bookingPromises);
        } else {
          antMessage.error("Failed to create new booking food.");
        }
      } catch (error) {
        console.log("Error creating booking food:", error);
        antMessage.error("An error occurred while creating booking food.");
      }
    },
    []
  );
  const formatDate = (date: string | Date): string => {
    return new Date(date).toLocaleDateString();
  };
  const handleToggleExpand = (
    id: number,
    roomId: number,
    type: string
  ): void => {
    setExpandedBooking(expandedBooking === id ? null : id);
    if (type === "room") {
      fetchRoomDetail(roomId);
    }
  };
  const fetchRoomDetail = async (roomId: number) => {
    try {
      const roomDetail = await getRoomDetail(roomId);
      dispatch(setRoom(roomDetail));
    } catch (error) {
      console.error("Failed to fetch room details:", error);
    }
  };
  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      dispatch(clearToken());
      localStorage.removeItem("__token__");
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  // Handle upload change
  const handleChange = async (info: any) => {
    let fileList = [...info.fileList];
    fileList = fileList.slice(-1);
    setFileList(fileList);
    if (info.file.status === "done") {
      const uploadedImageUrl = await getUrlUpdateUserImg(
        fileList[0].originFileObj
      );
      setImageUrl(uploadedImageUrl);
      try {
        const updatedUser: UserProfile = await updateProfileImage(
          uploadedImageUrl
        );
        dispatch(setCurrentUser(updatedUser));
        antMessage.success("Profile picture updated successfully!");
      } catch (error) {
        console.error("Error updating profile image:", error);
        antMessage.error("Failed to update profile picture.");
      }
    } else if (info.file.status === "error") {
      antMessage.error("Failed to update profile picture.");
    }
  };
  const handleSaveProfile = async () => {
    setLoadingButton(true);
    const dataUpdate: UserProfileUpdate = {
      name: name,
      email: email,
      address: address,
      phone_number: phoneNumber,
      gender: gender,
      date_of_birth: dateOfBirth,
      status: 1, // Ensure the UserProfileUpdate interface allows `status` to be a number
    };
    try {
      const result = await updateProfile(dataUpdate);
      if (result) {
        // Dispatch the user data into the Redux store
        dispatch(setCurrentUser(result));
        message.success("Profile updated successfully");
      }
    } catch (error: any) {
      // Handle the error gracefully and show a message to the user
      console.error(error.message);
      message.error(error.message);
    } finally {
      setIsUpdated(false);
      setLoadingButton(false);
    }
  };
  return (
    <div className="bg-gray-100 text-black">
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
          <div className="col-span-4 sm:col-span-3">
            <div className="bg-white rounded-lg p-6">
              <div className="mb-6 box-flex-center flex-col">
                <Avatar
                  src={imageUrl}
                  alt={t("profile.avatarAlt")}
                  style={{ width: 100, height: 100, marginBottom: "16px" }}
                />
                <Upload
                  listType="picture"
                  fileList={fileList}
                  onChange={handleChange}
                  beforeUpload={(file) => {
                    const isJpgOrPng =
                      file.type === "image/jpeg" || file.type === "image/png";
                    if (!isJpgOrPng) {
                      antMessage.error(t("profile.uploadError"));
                    }
                    const isLt2M = file.size / 1024 / 1024 < 2;
                    if (!isLt2M) {
                      antMessage.error(t("profile.sizeError"));
                    }
                    return isJpgOrPng && isLt2M;
                  }}
                >
                  <Button className="py-3" type="primary">
                    {t("profile.uploadAvatar")}
                  </Button>
                </Upload>
              </div>
            </div>
          </div>
          <div className="col-span-4 sm:col-span-9 gap-8">
            <div className="bg-white rounded-lg p-6">
              <div className="w-full grid sm:grid-cols-2 grid-cols-1 gap-5">
                <div className="">
                  <h2 className="text-xl font-bold mb-4">
                    {t("profile.profileSectionTitle")}
                  </h2>
                  <p className="text-gray-700 mb-6">
                    {t("profile.profileDescription")}
                  </p>
                </div>
                <div className="flex justify-end gap-5 flex-wrap">
                  <Button className="py-3 box-flex-center w-full sm:w-auto">
                    {t("profile.viewBookingRoomHistory")}
                    <ArrowDropDownIcon />
                  </Button>
                  <Button className="py-3 box-flex-center w-full sm:w-auto">
                    {t("profile.viewBookingFoodHistory")}
                    <ArrowDropDownIcon />
                  </Button>
                </div>
              </div>
              <hr />
              <div className="w-full my-5 grid gap-5 sm:grid-cols-2 grid-cols-1">
                <div className="">
                  <h2 className="text-xl font-bold mt-6 mb-4">
                    {t("profile.username")}
                  </h2>
                  <TextField
                    id="outlined-basic"
                    label={t("profile.usernameLabel")} // Dịch nhãn
                    variant="outlined"
                    className={`w-full ${isUpdated ? "bg-gray-100" : ""}`}
                    value={name}
                    onChange={
                      isUpdated ? (e) => setName(e.target.value) : undefined
                    }
                  />
                  <p className="mt-2 text-gray-500">
                    {t("profile.usernameNote")}
                  </p>
                </div>
                <div className="">
                  <h2 className="text-xl font-bold mt-6 mb-4">
                    {t("profile.email")}
                  </h2>
                  <TextField
                    id="outlined-basic"
                    label={t("profile.emailLabel")} // Dịch nhãn
                    variant="outlined"
                    className={`w-full ${isUpdated ? "bg-gray-100" : ""}`}
                    value={email}
                    onChange={
                      isUpdated ? (e) => setEmail(e.target.value) : undefined
                    }
                  />
                  <p className="mt-2 text-gray-500">{t("profile.emailNote")}</p>
                </div>
              </div>
              <div className="w-full my-5 grid gap-5 sm:grid-cols-2 grid-cols-1">
                <div className="">
                  <h2 className="text-xl font-bold mt-6 mb-4">
                    {t("profile.address")}
                  </h2>
                  <TextField
                    id="outlined-basic"
                    label={t("profile.addressLabel")} // Dịch nhãn
                    variant="outlined"
                    className={`w-full ${isUpdated ? "bg-gray-100" : ""}`}
                    value={address}
                    onChange={
                      isUpdated ? (e) => setAddress(e.target.value) : undefined
                    }
                  />
                </div>
                <div className="">
                  <h2 className="text-xl font-bold mt-6 mb-4">
                    {t("profile.dob")}
                  </h2>
                  <TextField
                    id="outlined-basic"
                    label={t("profile.dobLabel")} // Dịch nhãn
                    variant="outlined"
                    type="date"
                    className={`w-full ${isUpdated ? "bg-gray-100" : ""}`}
                    value={dateOfBirth}
                    onChange={
                      isUpdated
                        ? (e) => setDateOfBirth(e.target.value)
                        : undefined
                    }
                  />
                </div>
              </div>
              <div className="w-full my-5 grid gap-5 sm:grid-cols-2 grid-cols-1">
                <div className="">
                  <h2 className="text-xl font-bold mt-6 mb-4">
                    {t("profile.gender")}
                  </h2>
                  <Select
                    id="gender-select"
                    className={`w-full h-14 ${isUpdated ? "bg-gray-100" : ""}`}
                    value={gender}
                    onChange={
                      isUpdated ? (value) => setGender(value) : undefined
                    }
                  >
                    <Option value="male">{t("profile.male")}</Option>
                    <Option value="female">{t("profile.female")}</Option>
                    <Option value="other">{t("profile.other")}</Option>
                  </Select>
                </div>
                <div className="">
                  <h2 className="text-xl font-bold mt-6 mb-4">
                    {t("profile.phone")}
                  </h2>
                  <TextField
                    id="outlined-basic"
                    label={t("profile.phoneLabel")} // Dịch nhãn
                    variant="outlined"
                    className={`w-full ${isUpdated ? "bg-gray-100" : ""}`}
                    value={phoneNumber}
                    onChange={
                      isUpdated
                        ? (e) => setPhoneNumber(e.target.value)
                        : undefined
                    }
                  />
                </div>
              </div>
              <div className="w-full my-10 flex justify-between">
                {isUpdated && (
                  <div className="flex justify-center items-center gap-5">
                    <Button
                      loading={loadingButton}
                      type="primary"
                      onClick={handleSaveProfile}
                    >
                      {t("profile.save")}
                    </Button>
                    <Button
                      type="default"
                      onClick={() => setIsUpdated((prev) => !prev)}
                    >
                      {t("profile.cancel")}
                    </Button>
                  </div>
                )}
                {!isUpdated && (
                  <Button
                    type="primary"
                    onClick={() => setIsUpdated((pre) => !pre)}
                  >
                    {t("profile.updateProfile")}
                  </Button>
                )}
                <Button type="default" onClick={handleLogout}>
                  {t("profile.logout")}
                </Button>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 mt-6">
              <h2 className="text-xl font-bold mb-4">
                {t("profile.bookingRoomHistory")}
              </h2>
              <ul className="divide-y divide-gray-200">
                {bookingsRoom.map((booking) => (
                  <li
                    key={booking.id}
                    className="py-4 flex flex-col items-start"
                  >
                    <p>{t("profile.hotelName")}: Quỳnh Anh</p>
                    <p>
                      {t("profile.orderer")}: {currentUser?.name}
                    </p>
                    <p>
                      {t("profile.orderRoomId")}: {booking.id}
                    </p>
                    <p>
                      {t("profile.orderStatus")}: {booking.status}
                    </p>
                    <p>
                      {t("profile.price")}:
                      {formatMoney(
                        isString(booking.price)
                          ? parseInt(booking.price)
                          : booking.price
                      )}
                    </p>
                    <p>
                      {t("profile.bookingDate")}:{" "}
                      {formatDate(booking.created_at)}
                    </p>
                    <button
                      onClick={() =>
                        handleToggleExpand(
                          booking.id ?? 1,
                          booking.room_id,
                          "room"
                        )
                      }
                      className="text-blue-500 mt-2"
                    >
                      {expandedBooking === booking.id
                        ? t("profile.viewLess")
                        : t("profile.viewMore")}
                    </button>
                    {expandedBooking === booking.id && (
                      <div className="mt-4">
                        <p>
                          <strong>{t("profile.checkInDate")}:</strong>
                          {formatDate(booking.check_in_date)}
                        </p>
                        <p>
                          <strong>{t("profile.checkOutDate")}:</strong>
                          {formatDate(booking.check_out_date)}
                        </p>
                        <div className="bg-gray-100 p-3 mt-2 rounded y-2 w-full flex items-start justify-between gap-2 flex-wrap sm:flex-nowrap">
                          <Image
                            width={100}
                            height={100}
                            src={convertToStaticImport(roomDetail?.image1)}
                            alt={t("profile.roomDetailAlt")}
                          />
                          <div>
                            <h4 className="font-bold text-lg">
                              {roomDetail?.name}
                            </h4>
                            <p>{roomDetail?.description}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-lg p-6 mt-6">
              <h2 className="text-xl font-bold mb-4">
                {t("profile.bookingFoodHistory")}
              </h2>
              <ul className="divide-y divide-gray-200">
                {bookingsFood.map((booking) => (
                  <li
                    key={booking.id}
                    className="py-4 flex flex-col items-start"
                  >
                    <p>
                      {t("profile.orderFoodId")}: {booking.id}
                    </p>
                    <p>
                      {t("profile.orderStatus")}: {booking.status}
                    </p>
                    <p>
                      {t("profile.totalAmount")}:{" "}
                      {formatMoney(booking.total_amount)}
                    </p>
                    <p>
                      {t("profile.orderDate")}: {formatDate(booking.order_date)}
                    </p>
                    <button
                      onClick={() =>
                        handleToggleExpand(
                          booking.id ?? 1,
                          booking?.id ?? 1,
                          "food"
                        )
                      }
                      className="text-blue-500 mt-2"
                    >
                      {expandedBooking === booking.id
                        ? t("profile.viewLess")
                        : t("profile.viewMore")}
                    </button>
                    {expandedBooking === booking.id && (
                      <div className="mt-4">
                        <p>
                          <strong>{t("profile.deliveryAddress")}:</strong>
                          {booking.delivery_address}
                        </p>
                        <p>
                          <strong>{t("profile.paymentMethod")}:</strong>
                          {booking.payment_method}
                        </p>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;
