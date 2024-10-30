import React, { useState, useEffect, useRef } from "react";
import MainLogo from "../logo/MainLogo";
import { Button } from "antd";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";
import NavBar from "./navbar/NavBar";
const Header: React.FC = () => {
  const [isNavVisible, setIsNavVisible] = useState<boolean>(false);
  const navRef = useRef<HTMLDivElement>(null);
  const handleToggleNav = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Ngăn chặn sự kiện click lan truyền lên
    setIsNavVisible(!isNavVisible);
  };
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setIsNavVisible(false);
      }
    };
    if (isNavVisible) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isNavVisible]);
  return (
    <header className="sm:w-50 z-50 text-black pr-4 pl-4 h-20 flex justify-between items-center bg-white sticky top-0">
      <div className="flex items-center">
        <MainLogo />
      </div>
      <div className="hidden md:flex flex-1 justify-center">
        <NavBar />
      </div>
      <div className="md:hidden flex items-center">
        <Button
          icon={isNavVisible ? <CloseOutlined /> : <MenuOutlined />}
          onClick={handleToggleNav}
        />
      </div>
      {isNavVisible && (
        <div
          ref={navRef}
          className="absolute top-20 right-0 w-60 bottom-0 h-screen bg-orange-500 flex flex-col items-center shadow-md md:hidden"
        >
          <NavBar />
        </div>
      )}
    </header>
  );
};
export default Header;
