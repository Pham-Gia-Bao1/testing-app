// pages/home.tsx
import React from "react";

import { generateMetadata } from "@/utils";

export const metadata = generateMetadata("", "");

export default function ProductDetailLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
