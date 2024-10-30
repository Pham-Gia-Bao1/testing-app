// pages/home.tsx
"use client"
import { useAuth } from "@/components/context/AuthContext";
import { generateMetadata } from "@/utils";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function OrderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  });
  return <>{children}</>;
}
