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
  description: "Real moments, Beautifully preserved.",
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "FotosByTito",
    description: "Real moments, Beautifully preserved.",
    url: "https://fotosbytito.nl",
    siteName: "FotosByTito",
    images: [
      {
        url: "/logo.svg",
        width: 1200,
        height: 630,
        alt: "FotosByTito Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={` ${robotoFlex.variable} ${nunito.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster position="top-center" richColors />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
