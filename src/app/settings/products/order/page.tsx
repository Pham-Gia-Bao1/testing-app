import React from "react";
import { Metadata } from "next";
import { generateMetadata } from "@/utils";
import { Product } from "@/types";
import { fetchFoods } from "@/app/home/page";
import Order from "./Order";
export const metadata: Metadata = generateMetadata("Order", "Manage your products in the shopping cart on Lay");
export default async function page() {
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
      <Order listFoods={foods} />
    </>
  );
}
