// pages/home.tsx
import { generateMetadata } from "@/utils";
import RoomPage from "../rooms/page";

export const metadata = generateMetadata("Home", "Welcome to LayRestaurant, the best platform for booking food and rooms");

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <> <RoomPage /></>;
}
