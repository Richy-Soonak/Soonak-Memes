"use client";
import React from "react";
import dynamic from "next/dynamic";

const JotaiProvider = dynamic(() => import("@/providers/jotaiProvider"), {
  ssr: false,
});
const ThemeProvider = dynamic(() => import("@/providers/themeProvider"), {
  ssr: false,
});
const NotificationProvider = dynamic(
  () => import("@/providers/notificationProvider"),
  { ssr: false }
);
const AppWalletProvider = dynamic(() => import("@/providers/walletProvider"), {
  ssr: false,
});
const AuthProvider = dynamic(() => import("@/providers/authProvider"), {
  ssr: false,
});
import { NextUIProvider } from "@nextui-org/react";

const ThemeClient = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <NextUIProvider>
        <AppWalletProvider>
          <NotificationProvider>
            <JotaiProvider>
              <AuthProvider>{children}</AuthProvider>
            </JotaiProvider>
          </NotificationProvider>
        </AppWalletProvider>
      </NextUIProvider>
    </ThemeProvider>
  );
};

export default ThemeClient;
