import type { Metadata } from "next";

import "./globals.css";
import { Header } from "./components";

export const metadata: Metadata = {
  title: "Yong Drink - AI 음주관리 가이드",
  description: "AI를 활용한 개인 맞춤형 음주관리 서비스. 건강한 음주 습관을 위한 스마트한 가이드를 제공합니다.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark-theme">
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="dots" />
        <Header />
        {children}
        <div className="bottom-gradient" />
      </body>
    </html>
  );
}
