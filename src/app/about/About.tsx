"use client";
import React from "react";
import Image from "next/image";
import GoogleMapEmbed from "@/components/map/Map";
import RestaurantImage1 from "../../assets/images/RestaurantImage1.png";
import RestaurantImage2 from "../../assets/images/RestaurantImage2.png";
import RestaurantImage3 from "../../assets/images/RestaurantImage3.png";
import RestaurantImage4 from "../../assets/images/RestaurantImage4.png";
import Footer from "@/components/layout/Footer";
import { useTranslation } from "react-i18next";

const AboutUs: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto p-6 text-gray-900 bg-white">
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-teal-700 mb-6 text-center">
          {t("aboutUs.mainHeading")}
        </h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white shadow-2xl rounded-xl overflow-hidden text-teal-700 transition-transform transform hover:scale-105">
            <Image
              src={RestaurantImage4}
              alt={t("aboutUs.restaurantImageAlt1")}
              width={500}
              height={300}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 text-teal-700">
                {t("aboutUs.chefTitle")}
              </h3>
              <p className="text-gray-700">
                {t("aboutUs.chefDescription")}
              </p>
            </div>
          </div>
          <div className="bg-white shadow-2xl rounded-xl overflow-hidden transition-transform transform hover:scale-105">
            <Image
              src={RestaurantImage3}
              alt={t("aboutUs.fineDiningImageAlt")}
              width={500}
              height={300}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 text-teal-700">
                {t("aboutUs.fineDiningTitle")}
              </h3>
              <p className="text-gray-700">
                {t("aboutUs.fineDiningDescription")}
              </p>
            </div>
          </div>
          <div className="bg-white shadow-2xl rounded-xl overflow-hidden transition-transform transform hover:scale-105">
            <Image
              src={RestaurantImage1}
              alt={t("aboutUs.exquisiteCuisineImageAlt")}
              width={500}
              height={300}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 text-teal-700">
                {t("aboutUs.exquisiteCuisineTitle")}
              </h3>
              <p className="text-gray-700">
                {t("aboutUs.exquisiteCuisineDescription")}
              </p>
            </div>
          </div>
          <div className="bg-white shadow-2xl rounded-xl overflow-hidden transition-transform transform hover:scale-105">
            <Image
              src={RestaurantImage2}
              alt={t("aboutUs.luxuryRoomsImageAlt")}
              width={500}
              height={300}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 text-teal-700">
                {t("aboutUs.luxuryRoomsTitle")}
              </h3>
              <p className="text-gray-700">
                {t("aboutUs.luxuryRoomsDescription")}
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Map and Contact Form Section */}
      <section className="mb-16 flex flex-col md:flex-row md:space-x-8">
        <div className="md:w-1/2 mb-16 md:mb-0">
          <h2 className="text-3xl font-bold text-teal-700 text-center md:text-left mb-4">
            {t("aboutUs.ourLocationTitle")}
          </h2>
          <div className="mt-4 bg-white shadow-2xl rounded-xl p-6">
            <GoogleMapEmbed />
          </div>
        </div>
        <div className="md:w-1/2">
          <h2 className="text-3xl font-bold text-teal-700 text-center md:text-left mb-4">
            {t("aboutUs.contactUsTitle")}
          </h2>
          <form className="mt-4 bg-white shadow-2xl rounded-xl p-6 space-y-4">
            <div>
              <label htmlFor="name" className="block text-gray-700">
                {t("aboutUs.yourName")}
              </label>
              <input
                type="text"
                id="name"
                className="w-full mt-2 p-2 border border-gray-300 rounded"
                placeholder={t("aboutUs.enterName")}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700">
                {t("aboutUs.email")}
              </label>
              <input
                type="email"
                id="email"
                className="w-full mt-2 p-2 border border-gray-300 rounded"
                placeholder={t("aboutUs.enterEmail")}
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-gray-700">
                {t("aboutUs.message")}
              </label>
              <textarea
                id="message"
                className="w-full mt-2 p-2 border border-gray-300 rounded"
                rows={4}
                placeholder={t("aboutUs.enterMessage")}
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700 transition-colors"
            >
              {t("aboutUs.sendMessage")}
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default AboutUs;
