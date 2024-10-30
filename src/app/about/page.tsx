import { generateMetadata } from "@/utils";
import AboutUs from "./About";
export const metadata = generateMetadata(
  "About Us",
  "Welcome to LayRestaurant, the best platform for booking food and rooms"
);
export default function AboutPage() {
  return (
    <><AboutUs /></>
  )
}
