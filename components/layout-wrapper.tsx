"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { PortfolioNavbar } from "@/components/portfolio-navbar";
import { motion } from "framer-motion";

import { User } from "@supabase/supabase-js";

export function LayoutWrapper({
  children,
  user,
  role,
}: {
  children: React.ReactNode;
  user: User | null;
  role: string | null;
}) {
  const pathname = usePathname();
  const isPortfolio = pathname.startsWith("/portfolio");

  if (isPortfolio) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <PortfolioNavbar user={user} role={role} />
        <main className="flex-1 overflow-y-auto w-full">{children}</main>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col md:flex-row overflow-hidden bg-background">
      <Navbar user={user} role={role} />
      <main className="flex-1 overflow-y-auto p-2 lg:p-4 md:p-2">
        {children}
      </main>
    </div>
  );
}
