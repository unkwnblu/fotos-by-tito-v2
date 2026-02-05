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
  metadataBase: new URL("https://fotosbytito.nl"),
  title: "FotosByTito",
  description: "Real moments, Beautifully preserved.",
  icons: {
    icon: "/logo.jpeg",
  },
  openGraph: {
    title: "FotosByTito",
    description: "Real moments, Beautifully preserved.",
    url: "https://fotosbytito.nl",
    siteName: "FotosByTito",
    images: [
      {
        url: "/logo.jpeg",
        width: 1200,
        height: 630,
        alt: "FotosByTito Logo",
      },
    ],
    locale: "en_NL",
    type: "website",
  },
};

import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";

import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Google Tag Manager */}
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-NCCSX2HH');
        `}
      </Script>
      {/* End Google Tag Manager */}
      <body
        className={` ${robotoFlex.variable} ${nunito.variable} antialiased`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NCCSX2HH"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
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
