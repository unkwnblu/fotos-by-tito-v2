import type { Metadata } from "next";
import { Geist, Geist_Mono, Nunito, Roboto_Flex } from "next/font/google";
import "./globals.css";

import { ScrollToTop } from "@/components/scroll-to-top";

import { LayoutWrapper } from "@/components/layout-wrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const robotoFlex = Roboto_Flex({
  variable: "--font-roboto-flex",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FotosByTito",
  description: "A Visual Odyssey",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${robotoFlex.variable} ${nunito.variable} antialiased`}
      >
        <LayoutWrapper>
          {children}
          <ScrollToTop />
        </LayoutWrapper>
      </body>
    </html>
  );
}
