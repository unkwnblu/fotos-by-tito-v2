"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun, Menu, X, Instagram } from "lucide-react";
import { useTheme } from "next-themes";
import logo from "../public/logo.svg";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function PortfolioNavbar() {
  const pathname = usePathname();
  const { setTheme, theme } = useTheme();
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
          "sticky top-0 z-50 flex items-center shadow-xl justify-between md:justify-center dark:border-gray-800 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300 ease-in-out",
          scrolled ? "py-2" : "p-4 md:p-6"
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
                scrolled ? "w-16" : "w-20"
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
                  pathname === link.href && "text-foreground"
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
                "dark:invert h-auto transition-all duration-300 ease-in-out",
                scrolled ? "w-24 md:w-28" : "w-32 md:w-40"
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
                  pathname === link.href && "text-foreground"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Far Right: Theme Toggle (Desktop Only) */}
        <div className="hidden md:block absolute right-8 md:right-12 lg:right-24 top-1/2 -translate-y-1/2">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="relative rounded-full border border-border/40 p-2 hover:bg-accent hover:text-accent-foreground focus:outline-none transition-colors"
            aria-label="Toggle theme"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </button>
        </div>

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
                      : "text-muted-foreground"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex items-center gap-4 pt-4">
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="relative rounded-full border border-border/40 p-2 hover:bg-accent hover:text-accent-foreground focus:outline-none transition-colors"
                  aria-label="Toggle theme"
                >
                  <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </button>
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
