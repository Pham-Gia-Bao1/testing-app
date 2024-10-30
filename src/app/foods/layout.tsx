// pages/foods.tsx

import { generateMetadata } from "@/utils";

export const metadata = generateMetadata("Foods", "Explore a variety of delicious foods at LayRestaurant.");

export default function FoodsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
