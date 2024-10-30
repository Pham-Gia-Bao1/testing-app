"use client";
import ListUsers from "@/components/message/ListUsers";
import { LayoutProps } from "@/types";
import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/context/AuthContext";
import { useRouter } from "next/navigation";
const MessageLayout: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const shouldShowListUsers = !pathname || !pathname.match(/\/messages\/\d+/);
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  });
  return (
    <div className="min-h-screen bg-black flex">
      <div className="flex sm:w-full">
        {/* Sidebar for laptop/desktop */}
        <div className="hidden sm:block sm:w-1/4 h-[99%] bg-red-400 overflow-x-hidden">
          <ListUsers />
        </div>
        {/* Main content for laptop/desktop */}
        <div className="hidden sm:block sm:w-3/4 overflow-hidden">
          {children}
        </div>
      </div>
      {/* Mobile view */}
      <div className="flex w-full sm:hidden">
        {shouldShowListUsers ? (
          <div className="w-full bg-red-400 overflow-hidden">
            <ListUsers />
          </div>
        ) : (
          <div className="w-full overflow-hidden">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};
export default MessageLayout;
