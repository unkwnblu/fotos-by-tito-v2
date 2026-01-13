"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { PortfolioNavbar } from "@/components/portfolio-navbar";
import { motion } from "framer-motion";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPortfolio = pathname.startsWith("/portfolio");

  if (isPortfolio) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <PortfolioNavbar />
        <main className="flex-1 overflow-y-auto w-full">{children}</main>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col md:flex-row overflow-hidden bg-background">
      <Navbar />
      <main className="flex-1 overflow-y-auto p-2 lg:p-8 md:p-6">
        {children}
      </main>
    </div>
  );
}
