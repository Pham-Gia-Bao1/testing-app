import React from "react";
import Settings from "../../../components/pages/Settings";
import { Metadata } from "next";
import { generateMetadata } from "@/utils";
import { Product } from "@/types";
import { fetchFoods } from "@/app/home/page";
export const metadata: Metadata = generateMetadata("Settings", "Manage your application settings on BitStorm");
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
      <Settings listFoods={foods} />
    </>
  );
}
