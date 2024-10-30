"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { fetchFoodsData, getAllType, getFoodsByType, search } from "@/api";
import { CartItem, Product } from "@/types";
import MainLogo from "@/components/logo/MainLogo";
import Poster1 from "../../assets/images/Poster/Poster1.png";
import Poster2 from "../../assets/images/Poster/Poster2.jpg";
import Poster3 from "../../assets/images/Poster/Poster3.jpg";
import Poster4 from "../../assets/images/Poster/Poster4.png";
import ProductNotFound from "../../assets/images/ProductNotFound.png";
import RetaurantImage from "../../assets/images/Poster/Nhà hàng.jpg";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { API_URL } from "@/utils";
import axios from "axios";
import { useCart } from "@/components/context/CartContext";
import { Button, message } from "antd";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import Footer from "@/components/layout/Footer";
import { isString } from "lodash";
import { PosterOptions } from "../../types";
import { useTranslation } from "react-i18next"; // Import useTranslation
import PermPhoneMsgIcon from "@mui/icons-material/PermPhoneMsg";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faLinkedinIn,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
export const posters: PosterOptions[] = [
  {
    id: 1,
    image: Poster1,
    title: "Poster 1 of the Lay restaurant",
  },
  {
    id: 2,
    image: Poster2,
    title: "Poster 2 of the Lay restaurant",
  },
  {
    id: 3,
    image: Poster3,
    title: "Poster 3 of the Lay restaurant",
  },
  {
    id: 4,
    image: Poster4,
    title: "Poster 4 of the Lay restaurant",
  },
];
const FoodMenu: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation(); // Use the useTranslation hook
  const [foods, setFoods] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [allType, setAllType] = useState<string[]>([]);
  const token = useSelector((state: RootState) => state.auth.token);
  const [product, setProduct] = useState<Product | null>(null);
  const { addToCart, refreshCart } = useCart();
  const [selectedType, setSelectedType] = useState<string>("all");
  const [loadingButtons, setLoadingButtons] = useState<{
    [key: number]: boolean;
  }>({});
  useEffect(() => {
    getData();
    fetchTypes();
  }, []);
  const getProduct = useCallback(async (productId: number): Promise<void> => {
    const apiUrl = `${API_URL}/foods/${productId}`;
    try {
      const response = await axios.get<Product>(apiUrl);
      const fetchedProduct = response.data;
      setProduct({
        ...fetchedProduct,
        price:
          typeof fetchedProduct.price === "string"
            ? parseFloat(fetchedProduct.price)
            : fetchedProduct.price,
      });
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  }, []);
  const handleAddToCart = async (productId: number) => {
    setLoadingButtons((prev) => ({ ...prev, [productId]: true }));
    try {
      // Fetch the product data first and only proceed if successful
      const apiUrl = `${API_URL}/foods/${productId}`;
      const response = await axios.get<Product>(apiUrl);
      const fetchedProduct = response.data;
      if (fetchedProduct && token) {
        const cartItem: CartItem = {
          id: fetchedProduct.id,
          name: fetchedProduct.name,
          price: isString(fetchedProduct.price)
            ? parseInt(fetchedProduct.price)
            : fetchedProduct.price,
          description: fetchedProduct.description,
          type: fetchedProduct.type,
          picture: fetchedProduct.picture,
          quantity: 1,
        };
        addToCart(cartItem);
        refreshCart();
      } else {
        message.error(t("messages.loginFirst"));
      }
    } catch (error) {
      message.error(t("messages.addToCartError"));
    } finally {
      setLoadingButtons((prev) => ({ ...prev, [productId]: false }));
    }
  };
  const fetchTypes = async () => {
    try {
      const types = await getAllType();
      const uniqueTypes = types.filter((value, index, self) => {
        return self.indexOf(value) === index;
      });
      setAllType(uniqueTypes);
    } catch (error) {
      console.error("Failed to fetch types:", error);
    }
  };
  const getData = async () => {
    try {
      const fetchedFoods = await fetchFoodsData(1);
      setFoods(fetchedFoods);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleSearch = async (searchTerm: string) => {
    setLoading(true);
    try {
      const result = await search(searchTerm);
      setFoods(result.data);
    } catch (error) {
      console.error("Error searching foods:", error);
    } finally {
      setLoading(false);
    }
  };
  const debounce = (func: Function, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };
  const debouncedSearch = useCallback(debounce(handleSearch, 500), []);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };
  const uniqueTypes = allType.filter(
    (value, index, self) => self.indexOf(value) === index
  );
  const handleClick = async (type: string) => {
    setLoading(true);
    setSelectedType(type);
    const updatedPath = `?type=${type}`;
    router.push(updatedPath);
    try {
      const results = await getFoodsByType(type);
      setFoods(results);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const handleClickAll = () => {
    const originPath = "/foods";
    setSelectedType("all");
    router.push(originPath);
    getData();
  };
  return (
    <>
      <div className="flex flex-col-reverse lg:flex-row text-black  bg-white   ">
        <aside className="w-full lg:w-1/4 p-4 mb-4 lg:mb-0 border flex flex-col justify-start items-start bg-white ">
          <Image
            src={RetaurantImage}
            alt="lay restaurant image"
            width={500}
            height={500}
          />
          <div className="w-full flex flex-col items-center justify-between">
            <div className="w-full">
              <h2 className="text-2xl font-bold mt-2">LayRestaurant</h2>
              <p className="text-lg mt-2">{t("foodMenu.open")}!!</p>
              <div className="mt-4  flex flex-col justify-between items-center w-full">
                <div className="flex items-center w-full">
                  <PermPhoneMsgIcon className="w-5 h-5 text-blue-500 mr-2" />
                  <span className="font-semibold">Hotline:</span>
                  <span className="font-semibold text-blue-500 ml-2">
                    0934773134
                  </span>
                </div>
                <div className="flex items-center mt-4 w-full">
                  <LocationOnIcon className="w-5 h-5 text-red-500 mr-2" />
                  <span>{t("foodMenu.address")}</span>
                </div>
                <div className="flex items-center mt-4 w-full">
                  <AccessTimeIcon className="w-5 h-5 text-gray-500 mr-2" />
                  <span>{t("foodMenu.openHours")}: 7:00 - 16:00</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-full justify-between items-center my-3 mt-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white transition duration-200 ease-in-out hover:bg-blue-600 hover">
                <FontAwesomeIcon icon={faFacebookF} />
              </div>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white transition duration-200 ease-in-out hover:bg-blue-400 hover">
                <FontAwesomeIcon icon={faTwitter} />
              </div>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white transition duration-200 ease-in-out hover:bg-blue-700 hover">
                <FontAwesomeIcon icon={faLinkedinIn} />
              </div>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white transition duration-200 ease-in-out hover:bg-pink-600 hover">
                <FontAwesomeIcon icon={faInstagram} />
              </div>
            </a>
          </div>
        </aside>
        <main className="w-full p-4 relative mt-2">
          <div className="w-full flex z-30 bg-gray-100 items-center justify-between gap-1 mb-5  sticky top-2 ">
            <input
              type="text"
              value={searchTerm}
              onChange={handleChange}
              placeholder={t("foodMenu.searchPlaceholder")} // Using translation here
              className="border rounded p-2 w-full"
            />
          </div>
          <div className="w-full flex items-center justify-between">
            <ul className="py-4 px-1 w-full flex items-center gap-3 justify-between overflow-scroll scrollbar-hide">
              <button
                type="button"
                className={`${
                  selectedType === "all" ? "bg-orange-500" : "bg-white"
                } flex justify-between box-shadow px-4 py-2 min-w-fit  active:bg-orange-500 hover:bg-gray-100 overflow-hidden rounded `}
                onClick={handleClickAll}
              >
                <p>{t("foodMenu.allProducts")}</p>
              </button>
              {uniqueTypes.map((type, index) => (
                <button
                  type="button"
                  key={index}
                  className={` ${
                    selectedType === type ? "bg-orange-500" : "bg-white"
                  } flex justify-between box-shadow px-4 py-2 min-w-fit active:bg-orange-500 hover:bg-gray-100 overflow-hidden rounded `}
                  onClick={() => handleClick(type)}
                >
                  <p>{type}</p>
                </button>
              ))}
            </ul>
          </div>
          <div className={`transition-opacity duration-500`}>
            {loading ? (
              <div className="animate-pulse">
                {[...Array(10)].map((_, index) => (
                  <div key={index} className="flex items-center mb-4 rounded">
                    <div className="bg-gray-300 w-24 h-16 mr-4"></div>
                    <div className="flex-1 space-y-2">
                      <div className="bg-gray-300 h-4 w-3/4"></div>
                      <div className="bg-gray-300 h-4 w-1/2"></div>
                    </div>
                    <div className="bg-gray-300  h-10 w-20"></div>
                  </div>
                ))}
              </div>
            ) : foods.length > 0 ? (
              foods.map((food) => (
                <div
                  key={food.id}
                  className="flex items-center justify-between mb-4 p-3 box-shadow bg-white"
                >
                  <div className="flex items-center">
                    <div className="h-16 w-24 min-w-24 max-w-24 bg-green-300 relative">
                      <Image
                        src={food.picture}
                        alt={food.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="ml-4 flex flex-col gap-2">
                      <h3 className="text-sm font-medium truncate-description-2-line">
                        {food.name}
                      </h3>
                      <p className="text-xs text-gray-500 truncate-description-1-line">
                        {food.price.toLocaleString()} VND
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleAddToCart(food.id)}
                    className="custom-button text-white"
                    loading={loadingButtons[food.id] || false}
                  >
                    {t("foodMenu.addToCartButton")}{" "}
                    {/* Using translation here */}
                  </Button>
                </div>
              ))
            ) : (
              <div className="w-full flex justify-center items-center">
                <Image
                  width={500}
                  height={500}
                  src={ProductNotFound}
                  alt="Not found"
                  className="w-1/3"
                />
              </div>
            )}
          </div>
        </main>
        <aside className="w-full lg:w-1/5 p-4 mb-4 lg:mb-0 flex flex-col justify-start items-start bg-white ">
          <div className="  sm:flex-col flex justify-start items-start gap-2 bg-white z-30 overflow-scroll scrollbar-hide ">
            {posters.map((poster) => (
              <Image
                key={poster.id}
                width={200}
                height={200}
                src={poster.image}
                alt={poster.title}
                className="bg-white"
              />
            ))}
          </div>
        </aside>
      </div>
      <Footer />
    </>
  );
};
export default FoodMenu;
