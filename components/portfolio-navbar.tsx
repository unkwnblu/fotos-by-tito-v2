"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Instagram } from "lucide-react";
import logo from "../public/logo.svg";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";

import { User } from "@supabase/supabase-js";
import { signOut } from "@/app/actions/auth";

interface PortfolioNavbarProps {
  user: User | null;
  role: string | null;
}

export function PortfolioNavbar({ user, role }: PortfolioNavbarProps) {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const leftLinks = [
    { name: "HOME", href: "/" },
    { name: "PRICING", href: "/pricing" },
  ];

  const rightLinks = [
    { name: "TESTIMONIALS", href: "/testimonials" },
    { name: "CONTACT", href: "/contact" },
  ];

  const allLinks = [...leftLinks, ...rightLinks];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <nav
        className={cn(
          "sticky top-0 z-50 flex items-center shadow-xl justify-between md:justify-center bg-background/95 dark:bg-zinc-900/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:supports-[backdrop-filter]:bg-zinc-900/60 transition-all duration-300 ease-in-out",
          scrolled ? "py-2" : "p-4 md:p-6",
        )}
      >
        <div className="md:hidden flex items-center">
          <Link href="/">
            <Image
              src={logo}
              alt="Logo"
              width={80}
              height={32}
              className={cn(
                "transition-all duration-300",
                scrolled ? "w-16" : "w-20",
              )}
            />
          </Link>
        </div>

        {/* Center Group: Links + Logo (Desktop) */}
        <div className="hidden md:flex items-center gap-12">
          {/* Left Links */}
          <div className="flex items-center gap-8">
            {leftLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-sm font-bold tracking-[0.2em] text-muted-foreground transition-colors hover:text-[#2d5d4b]",
                  pathname === link.href && "text-foreground",
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Center Logo */}
          <Link href="/" className="shrink-0 px-4">
            <Image
              src={logo}
              alt="FotosByTito"
              width={32}
              height={32}
              className={cn(
                "h-auto transition-all duration-300 ease-in-out",
                scrolled ? "w-24 md:w-28" : "w-32 md:w-40",
              )}
              priority
            />
          </Link>

          {/* Right Links */}
          <div className="flex items-center gap-8">
            {rightLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-sm font-bold tracking-[0.2em] text-muted-foreground transition-colors hover:text-[#2d5d4b]",
                  pathname === link.href && "text-foreground",
                )}
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <>
                {role === "admin" && (
                  <Link
                    href="/admin"
                    className="text-sm font-bold tracking-[0.2em] text-primary transition-colors hover:text-primary/80"
                  >
                    DASHBOARD
                  </Link>
                )}
                <button
                  onClick={async () => {
                    await signOut();
                  }}
                  className="text-sm font-bold tracking-[0.2em] text-muted-foreground transition-colors hover:text-red-500"
                >
                  LOGOUT
                </button>
              </>
            ) : null}
            <div className="pl-4 border-l border-border/50 ml-4">
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Far Right: Theme Toggle (Desktop Only) */}

        {/* Mobile: Hamburger Button (Right) */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-muted-foreground hover:text-foreground"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 top-0 z-40 bg-background md:hidden"
          >
            <div className="flex flex-col items-center space-y-8 p-8 pt-32">
              {allLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "text-3xl font-bold uppercase transition-colors hover:text-[#2d5d4b]",
                    pathname === link.href
                      ? "text-primary"
                      : "text-muted-foreground",
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex items-center gap-4 pt-4">
                {user ? (
                  <>
                    {role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setIsOpen(false)}
                        className="text-xl font-bold uppercase text-primary hover:text-primary/80"
                      >
                        Dashboard
                      </Link>
                    )}
                    <button
                      onClick={async () => {
                        await signOut();
                      }}
                      className="text-xl font-bold uppercase text-red-500 hover:text-red-600"
                    >
                      Logout
                    </button>
                  </>
                ) : null}
              </div>
              <div className="flex items-center gap-4 pt-4">
                <ThemeToggle />
                <Link
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-border/40 p-2 hover:bg-accent hover:text-accent-foreground transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
