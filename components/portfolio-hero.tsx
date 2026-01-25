"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { MoveRight, Star } from "lucide-react";

const defaultSlides = [
  "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2071&auto=format&fit=crop", // Landscape person
  "https://images.unsplash.com/photo-1554080353-a576cf803bda?q=80&w=1000&auto=format&fit=crop", // Photography
  "https://images.unsplash.com/photo-1623945419047-4f6534570076?q=80&w=2071&auto=format&fit=crop", // Architecture/Abstract
];

export function PortfolioHero({ images = [] }: { images?: string[] }) {
  const slides = images.length > 0 ? images : defaultSlides;
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[85vh] w-full overflow-hidden bg-background">
      {/* 1. The BACKGROUND SLIDESHOW */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="popLayout">
          <motion.img
            key={currentSlide}
            src={slides[currentSlide]}
            alt="Portfolio slide"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="h-full w-full object-cover object-[50%_25%]"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* BOTTOM RIGHT GLASS PANEL (Scroll Indicator) */}
      <div className="absolute bottom-0 right-0 z-10 h-[15%] md:h-[12%] w-[45%] md:w-[15%] rounded-tl-[2rem] md:rounded-tl-[3rem] flex items-center justify-center bg-white/30 backdrop-blur-md border-t border-l border-white/20 shadow-lg">
        {/* INVERTED CORNER: Top-Right of the panel (connecting to right edge up) */}
        {/* Mask mimics: Square minus Circle at Bottom-Right */}
        <div
          className="absolute -top-12 md:-top-16 right-0 h-12 w-12 md:h-16 md:w-16 bg-white/30 backdrop-blur-md border-r border-white/20"
          style={{
            maskImage:
              "radial-gradient(circle at 0% 0%, transparent 70%, black 71%)",
            WebkitMaskImage:
              "radial-gradient(circle at 0% 0%, transparent 70%, black 71%)",
          }}
        />

        <div className="flex flex-col items-center gap-2 text-[13px] md:text-xs font-bold tracking-widest uppercase text-muted-foreground">
          <span className="text-center">
            Scroll Down
            <br />
            to see the works
          </span>
        </div>
      </div>
    </div>
  );
}
