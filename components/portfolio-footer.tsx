"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const services = [
  "EVENT PHOTOGRAPHY",
  "COMMERCIAL PHOTOGRAPHY",
  "PRODUCT PHOTOGRAPHY",
  "WEDDING PHOTOGRAPHY",
  "LANDSCAPE PHOTOGRAPHY",
  "BRANDING PHOTOGRAPHY",
  "PORTRAIT PHOTOGRAPHY",
];

export function PortfolioFooter() {
  return (
    <footer className="w-full bg-background pt-24 pb-8 overflow-hidden">
      {/* 1. Large Title */}
      <div className="container mx-auto px-4 mb-16">
        <h1 className="text-right text-5xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-emerald-900">
          FOTOSBYTITO
        </h1>
      </div>

      {/* 2. Scrolling Marquee */}
      <div className="relative w-full bg-[#FFF5E6] py-4 mb-24 overflow-hidden -rotate-1 scale-105">
        <div className="flex whitespace-nowrap">
          <motion.div
            className="flex items-center gap-8"
            animate={{ x: "-50%" }}
            transition={{
              duration: 20,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {[...services, ...services, ...services].map((service, i) => (
              <div key={i} className="flex items-center gap-8">
                <Star className="h-6 w-6 text-emerald-900 fill-emerald-900" />
                <span className="text-sm md:text-base font-medium tracking-widest text-emerald-900">
                  {service}
                </span>
              </div>
            ))}
          </motion.div>
          {/* Duplicate for seamless loop if needed, but the x: -50% trick normally assumes content is duplicated enough */}
          <motion.div
            className="flex items-center gap-8 pl-8"
            animate={{ x: "-50%" }}
            transition={{
              duration: 20,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {[...services, ...services, ...services].map((service, i) => (
              <div key={`dup-${i}`} className="flex items-center gap-8">
                <Star className="h-6 w-6 text-emerald-900 fill-emerald-900" />
                <span className="text-sm md:text-base font-medium tracking-widest text-emerald-900">
                  {service}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* 3. Copyright */}
      <div className="text-center text-xs text-muted-foreground uppercase tracking-widest">
        &copy; {new Date().getFullYear()} Fotos by tito
      </div>
    </footer>
  );
}
