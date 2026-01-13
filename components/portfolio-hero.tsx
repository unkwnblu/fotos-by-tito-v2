"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { MoveRight, Star } from "lucide-react";

const slides = [
  "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2071&auto=format&fit=crop", // Landscape person
  "https://images.unsplash.com/photo-1554080353-a576cf803bda?q=80&w=1000&auto=format&fit=crop", // Photography
  "https://images.unsplash.com/photo-1623945419047-4f6534570076?q=80&w=2071&auto=format&fit=crop", // Architecture/Abstract
];

export function PortfolioHero() {
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
            className="h-full w-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* 2. GLASS OVERLAYS */}

      {/* TOP LEFT GLASS PANEL */}
      <div className="absolute left-0 top-0 z-10 h-[40%] md:h-[50%] w-[85%] md:w-[35%] flex flex-col justify-center px-8 md:px-10 rounded-br-[3rem] md:rounded-br-[4rem] bg-white/30 dark:bg-black/30 backdrop-blur-md border-r border-b border-white/20 shadow-lg">
        {/* Helper for smooth left-edge continuation if needed, but primary focus is the bottom-right curve */}
        {/* We removed the confusing bottom-left shadow helper as it was redundant for a top-left panel */}

        <p className="mb-2 md:mb-4 text-xs font-bold tracking-widest text-muted-foreground uppercase">
          Portfolio
        </p>
        <h1 className="mb-3 md:mb-6 text-3xl md:text-7xl font-serif font-medium tracking-tight text-foreground">
          VISUAL POETRY <br />
          <span className="text-emerald-900 dark:text-emerald-500">
            IN PIXELS
          </span>
        </h1>
        <p className="max-w-md text-xs md:text-base text-muted-foreground leading-relaxed line-clamp-3 md:line-clamp-none">
          Step into a visual journey that encapsulates the essence of my lens.
          Each photograph in this portfolio is a narrative, a frozen moment in
          time.
        </p>
      </div>

      {/* TOP RIGHT: Floating Link */}
      <div className="absolute top-8 right-8 z-20">
        <a
          href="#gallery-start"
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/30 dark:bg-black/30 backdrop-blur-md border border-white/20 shadow-lg hover:bg-white/40 transition-all group"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-foreground">
            View sessions
          </span>
          <MoveRight className="w-4 h-4 text-foreground group-hover:translate-x-1 transition-transform" />
        </a>
      </div>

      {/* BOTTOM LEFT: Glass Star Icon */}
      <div className="absolute top-[40%] md:top-[50%] left-6 z-20 md:left-10 -translate-y-1/2">
        <div className="flex h-12 w-12 md:h-24 md:w-24 items-center justify-center rounded-full bg-white/30 dark:bg-black/30 backdrop-blur-md border border-white/20 shadow-lg">
          <Star className="h-6 w-6 md:h-10 md:w-10 text-foreground rotate-45 stroke-1" />
        </div>
      </div>

      {/* BOTTOM RIGHT GLASS PANEL (Scroll Indicator) */}
      <div className="absolute bottom-0 right-0 z-10 h-[15%] md:h-[12%] w-[45%] md:w-[15%] rounded-tl-[2rem] md:rounded-tl-[3rem] flex items-center justify-center bg-white/30 dark:bg-black/30 backdrop-blur-md border-t border-l border-white/20 shadow-lg">
        {/* INVERTED CORNER: Top-Right of the panel (connecting to right edge up) */}
        {/* Mask mimics: Square minus Circle at Bottom-Right */}
        <div
          className="absolute -top-12 md:-top-16 right-0 h-12 w-12 md:h-16 md:w-16 bg-white/30 dark:bg-black/30 backdrop-blur-md border-r border-white/20"
          style={{
            maskImage:
              "radial-gradient(circle at 0% 0%, transparent 70%, black 71%)",
            WebkitMaskImage:
              "radial-gradient(circle at 0% 0%, transparent 70%, black 71%)",
          }}
        />

        <div className="flex flex-col items-center gap-2 text-[10px] md:text-xs font-medium tracking-widest uppercase text-muted-foreground">
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
