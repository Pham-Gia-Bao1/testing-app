"use client";
import "./globals.css";
import { useTheme, ThemeProvider as NextThemesProvider } from "next-themes";
import { CartProvider } from "@/components/context/CartContext";
import Header from "@/components/layout/Header";
import { Provider } from "react-redux";
import storeApp from "@/redux/store";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";
import { usePathname } from "next/navigation";
import { TotalProvider } from "@/components/context/TotalContext";
import { CartPayProvider } from "@/components/context/CartPayContext";
import { SessionProvider } from "next-auth/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { generateMetadata } from "@/utils";
import { AuthProvider } from "@/components/context/AuthContext";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import MessageIcon from "@mui/icons-material/Message";
import PhoneIcon from "@mui/icons-material/Phone";
import ChatIcon from "@mui/icons-material/Chat";

const ThemeProvider = ({ children, ...props }: any) => {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { theme } = useTheme();
  const pathname = usePathname();
  const shouldHideHeader =
    pathname && (pathname.includes("/login") || pathname.includes("/register"));

  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <Provider store={storeApp}>
      <AuthProvider>
        <I18nextProvider i18n={i18n}>
          <SessionProvider>
            <html lang="en">
              <body className="">
                <TotalProvider>
                  <CartProvider>
                    <CartPayProvider>
                      <ThemeProvider
                        attribute="class"
                        defaultTheme="light"
                        enableSystem
                        disableTransitionOnChange
                      >
                        {!shouldHideHeader && <Header />}

                        <main className="bg-white overflow-x-hidden relative">
                          {children}
                          <SpeedInsights />
                        </main>
                      </ThemeProvider>
                    </CartPayProvider>
                  </CartProvider>
                </TotalProvider>
              </body>
            </html>
          </SessionProvider>
        </I18nextProvider>
      </AuthProvider>
    </Provider>
  );
}
