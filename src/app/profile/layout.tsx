// pages/profile.tsx

import { generateMetadata } from "@/utils";

export const metadata = generateMetadata("Profile", "Manage your personal information and account settings at LayRestaurant.");

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
