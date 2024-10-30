import React from "react";
import Home from "./home/Home";
import { generateMetadata } from "@/utils";
import { fetchFoods } from "./home/page";
import { Product } from "@/types";
import RoomPage from "./rooms/page";
export const metadata = generateMetadata("", "Welcome to LayRestaurant, the best platform for booking food and rooms");

export default async function HomePage() {
  let foods: Product[] | null = null;

  try {
    foods = await fetchFoods();
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return <div>Error fetching data. Please try again later.</div>;
  }

  if (!foods || foods.length === 0) {
    return <div>No foods available to display.</div>;
  }

  return (
    <>
      <RoomPage />
    </>
  );
}
