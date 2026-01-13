"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Instagram, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import logo from "../public/logo.svg";
import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: "Home", href: "/" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Pricing", href: "/pricing" },
    { name: "Testimonials", href: "/testimonials" },
    { name: "Contact", href: "/contact" },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Topbar */}
      <nav className="sticky top-0 z-50 flex items-center justify-between shadow-xl bg-background p-4 md:hidden">
        <div className="flex items-center gap-2">
          <Image src={logo} alt="Logo" width={80} height={32} />
        </div>
        <button onClick={toggleMenu} aria-label="Toggle menu">
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
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={toggleMenu}
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
                <Link
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-gray-200 p-2 hover:bg-accent hover:text-accent-foreground"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar (Hidden on mobile) */}
      <nav className="relative z-10 hidden h-screen w-64 flex-col justify-between shadow-xl bg-background p-6 md:flex">
        {/* Top: Logo + Subtext */}
        <div className="flex flex-col items-center space-y-2 pt-4">
          <p className="text-xs text-muted-foreground uppercase tracking-widest">
            A VISUAL ODESSY
          </p>
          <Image src={logo} alt="Logo" />
        </div>

        {/* Middle: 5 Links */}
        <div className="flex flex-col items-center space-y-6">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "text-xl font-bold uppercase transition-colors hover:text-[#2d5d4b]",
                pathname === link.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Bottom: Controls + Copyright */}
        <div className="flex flex-col space-y-6 pb-4">
          {/* Controls: Theme Toggle (Left) + Instagram (Right) */}
          <div className="flex items-center justify-between px-2">
            <Link
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-gray-200 p-2 hover:bg-accent hover:text-accent-foreground"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground">
              &copy; {new Date().getFullYear()} FotosByTito
            </p>
          </div>
        </div>
      </nav>
    </>
  );
}
