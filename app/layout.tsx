import type { Metadata } from "next";
import { Nunito, Roboto_Flex } from "next/font/google";
import "./globals.css";

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

import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` ${robotoFlex.variable} ${nunito.variable} antialiased`}
      >
        <Toaster position="top-center" richColors />
        {children}
      </body>
    </html>
  );
}
