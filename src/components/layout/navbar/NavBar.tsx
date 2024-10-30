import React, { useState, useEffect, useMemo } from "react";
import { Avatar } from "@mui/material";
import { Button, Menu, Dropdown, Badge } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { useTheme } from "next-themes";
import {jwtDecode} from "jwt-decode";
import { useRouter } from "next/navigation";
import { getUserProfile } from "@/api";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { clearToken } from "@/redux/authSlice";
import { ExitToApp } from "@mui/icons-material";
import { setCurrentUser } from "@/redux/userSlice";
import OrderSide from "@/components/order/OrderSide";
import { useCart } from "@/components/context/CartContext";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { signOut } from "next-auth/react";
const MutipleLanguages = () => {
  const { t } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language);
  const handleMenuClick = (e: any) => {
    const lang = e.key;
    i18n.changeLanguage(lang);
    setCurrentLang(lang);
  };
  const menu = (
    <Menu onClick={handleMenuClick} selectedKeys={[currentLang]}>
      <Menu.Item key="vi">{t("language.vietnamese")}</Menu.Item>
      <Menu.Item key="en">{t("language.english")}</Menu.Item>
    </Menu>
  );
  return (
    <Dropdown className="mr-5" overlay={menu} trigger={["click"]}>
      <Button icon={<SettingOutlined />} size="large">
        {currentLang.toUpperCase()}
      </Button>
    </Dropdown>
  );
};
const privateLinks : any = [];
const publicLinks = [{ title: "home" }, { title: "rooms" },{ title: "about" }];
const NavBar: React.FC = () => {
  const { t } = useTranslation();
  const { cart } = useCart();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const router = useRouter();
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const { theme } = useTheme();
  const tokenRedux = useSelector((state: RootState) => state.auth.token);
  const [tokenLocalStorage, setTokenLocalStorage] = useState<string | null>(
    null
  );
  useEffect(() => {
    setTokenLocalStorage(localStorage.getItem("__token__"));
  }, []);
  const token = tokenRedux || tokenLocalStorage;
  const messages = useSelector((state: RootState) => state.messages.messages);
  const [activeLink, setActiveLink] = useState<string>("");
  const uniqueCart = useMemo(() => {
    return cart.reduce((acc: any[], current: any) => {
      const item = acc.find((i) => i.name === current.name);
      if (!item) {
        acc.push(current);
      }
      return acc;
    }, []);
  }, [cart]);
  const [count, setCount] = useState<number>(uniqueCart.length);
  useEffect(() => {
    setCount(uniqueCart.length);
  }, [uniqueCart]);
  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserInfo(decodedToken);
        setIsLogin(true);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      if (typeof window !== "undefined") {
        localStorage.removeItem("__token__");
      }
      setUserInfo(null);
      setIsLogin(false);
    }
  }, [token]);
  useEffect(() => {
    if (userInfo?.sub) {
      getUserProfile()
        .then((data) => {
          setUserProfile(data);
          dispatch(setCurrentUser(data));
          if (currentUser !== data) {
            setUserProfile(currentUser);
          }
        })
        .catch((error) => console.error("Error getting user profile:", error));
    }
  }, [userInfo, dispatch]);
  useEffect(() => {
    setUserProfile(currentUser);
  }, [currentUser]);
  const handleLinkClick = (title: string) => {
    setActiveLink(title.toLowerCase());
  };
  const handleLogoutAndRedirect = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("__token__");
    }
    try {
      await signOut({ redirect: false });
      dispatch(clearToken());
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setIsLogin(false);
      router.push("/login");
    }
  };
  return (
    <nav className="flex flex-col md:flex-row items-center justify-between p-4 w-full">
      <div></div>
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8 justify-between">
        {publicLinks.map((link, index) => (
          <Link key={index} href={`/${link.title.toLowerCase()}`} passHref>
            <p
              onClick={() => handleLinkClick(link.title)}
              className={`text-lg text-black px-4 py-2 rounded-full transition ${
                activeLink === link.title.toLowerCase()
                  ? "bg-orange-500 text-white"
                  : "hover:bg-orange-500 hover:text-white"
              }`}
            >
              {t(`nav.${link.title.toLowerCase()}`)}
            </p>
          </Link>
        ))}
        {/* {privateLinks.map((link, index) => (
          <Link
            key={index}
            href={token ? `/${link.title.toLowerCase()}` : "/login"}
            passHref
          >
            <p
              onClick={() => handleLinkClick(link.title)}
              className={`text-lg text-black px-4 py-2 rounded-full transition ${
                activeLink === link.title.toLowerCase()
                  ? "bg-orange-500 text-white"
                  : "hover:bg-orange-500 hover:text-white"
              }`}
            >
              {t(`nav.${link.title.toLowerCase()}`)}
            </p>
          </Link>
        ))} */}
      </div>
      <div className="flex items-center gap-5 mt-4 md:mt-0">
        {userProfile && isLogin ? (
          <div className="flex flex-col md:flex-row justify-center items-center gap-2 md:gap-5">
            {/* <Badge count={count}>
              <OrderSide />
            </Badge>
            <MutipleLanguages /> */}
            <Link
              href="/profile"
              passHref
              className="text-lg text-white bg-gray-900 px-4 py-2 flex justify-center items-center rounded-full"
            >
              <Avatar
                className="mr-4"
                alt="User Avatar"
                src={userProfile.profile_picture}
                sx={{ width: 24, height: 24 }}
              />
              <p>{userProfile.name}</p>
            </Link>
          </div>
        ) : (
          <div className="flex justify-between gap-2">
            <div className="text-lg flex text-white bg-gray-900 px-4 py-2 rounded-full">
              <p className="cursor-pointer block" onClick={handleLogoutAndRedirect}>{t("nav.login")}</p>/
              <Link href="/register" passHref>
                {t("nav.signup")}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
export default NavBar;
