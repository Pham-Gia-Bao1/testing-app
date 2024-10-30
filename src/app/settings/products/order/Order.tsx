"use client";
import React, { useEffect, useState } from "react";
import ProductCardCheckOut from "@/components/cart/ProductCardCheckOut";
import { useCart } from "@/components/context/CartContext";
import { useCartPay } from "@/components/context/CartPayContext";
import { useTheme } from "next-themes";
import Footer from "@/components/layout/Footer";
import { CartItem, SettingsProps } from "@/types";
import CheckoutComponent from "@/components/checkout/CheckoutComponent";
import { isString } from "lodash";
import Settings from "@/components/pages/Settings";
import { useAuth } from "@/components/context/AuthContext";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

const Order: React.FC<SettingsProps> = ({ listFoods }) => {
  const { cart } = useCart();
  const { theme } = useTheme();
  const { selectedItems, addToCartPay, removeFromCartPay, getTotalPrice } = useCartPay();
  const [selectedProducts, setSelectedProducts] = useState<CartItem[]>([]);
  const [selectAll, setSelectAll] = useState(false); // State to track select all
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();

  const handleSelectProduct = (id: number | string, selected: boolean) => {
    const product = cart.find((item) => item.id === id);
    if (product) {
      if (selected) {
        setSelectedProducts((prev) => [...prev, product]);
        addToCartPay(product);
      } else {
        setSelectedProducts((prev) => prev.filter((item) => item.id !== id));
        removeFromCartPay(id);
      }
    }
  };

  const handleCheckAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      cart.forEach((product) => {
        setSelectedProducts((prev) => [...prev, product]);
        addToCartPay(product);
      });
    } else {
      cart.forEach((product) => {
        setSelectedProducts((prev) =>
          prev.filter((item) => item.id !== product.id)
        );
        removeFromCartPay(product.id);
      });
    }
  };

  const uniqueCart = cart.reduce<CartItem[]>((acc, current) => {
    const x = acc.find((item) => item.name === current.name);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);
  uniqueCart.sort((a, b) => a.id - b.id);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  });

  return (
    <main>
      <div className="flex-1  w-full h-full">
        <div className="flex flex-col">
          <div className="flex-1 rounded-lg sm:p-6">
            <div>
              <div className="grid grid-cols-1 gap-3 relative">
                <div className="mt-2">
                  <div className="text-black text-3xl font-bold">
                    <h1 className="m-3">{t('order.shopping_cart')}</h1>
                  </div>
                  <div className="flex items-center py-2 box-shadow mb-5 font-bold text-black border-gray-200 justify-between mx-2 p-4">
                    <div className="flex items-center h-14 w-1/12">
                      <h1>
                        <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={handleCheckAll}
                        />
                      </h1>
                    </div>
                    <div className="flex items-center h-14 w-3/12">
                      <h1>{t('order.product')}</h1>
                    </div>
                    <div className="items-center w-3/12 hidden sm:flex">
                      <h1>{t('order.type')}</h1>
                    </div>
                    <div className="flex items-center w-3/12 ml-5 pl-1 sm:ml-0">
                      <h1>{t('order.quantity')}</h1>
                    </div>
                    <div className="flex items-center w-3/12">
                      <h1>{t('order.price')}</h1>
                    </div>
                    <div className=" items-center w-1/12 hidden sm:flex">
                      <h1>{t('order.action')}</h1>
                    </div>
                  </div>
                  {uniqueCart.length === 0 ? (
                    <p>{t('order.empty_order_list')}</p>
                  ) : (
                    uniqueCart.map((product) => (
                      <ProductCardCheckOut
                        key={product.id}
                        id={product.id}
                        imageSrc={product.picture}
                        title={product.name}
                        type={product.type}
                        description={product.description}
                        price={
                          isString(product.price)
                            ? parseInt(product.price)
                            : product.price
                        }
                        quantityProduct={product.quantity}
                        quantityOrder={product.quantity}
                        onSelect={handleSelectProduct}
                        checked={
                          selectAll ||
                          selectedItems.some((item: any) => item.id === product.id)
                        }
                      />
                    ))
                  )}
                </div>
                <div className="w-full sticky bottom-0">
                  <CheckoutComponent products={selectedItems.length} />
                </div>
              </div>
              <div
                className={`${theme === "dark" ? "text-white" : "text-black"}`}
              ></div>
            </div>
          </div>
          <div className="w-full  p-5">
            <Settings listFoods={listFoods} />
          </div>
        </div>
        <Footer />
      </div>
    </main>
  );
}
export default Order;
