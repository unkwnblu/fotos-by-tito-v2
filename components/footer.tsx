"use client";

import Link from "next/link";
import { Instagram, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full overflow-hidden rounded-xl bg-[#2d5d4b] text-white pt-16 pb-16 isolate">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 -z-20 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-[50%] -left-[20%] h-[200%] w-[80%] rounded-full bg-gradient-to-br from-[#3da87d]/20 to-transparent blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute -bottom-[50%] -right-[20%] h-[200%] w-[80%] rounded-full bg-gradient-to-tl from-[#1a4133]/40 to-transparent blur-3xl"
        />
      </div>

      {/* Noise Texture Overlay */}
      <div
        className="absolute inset-0 -z-10 opacity-20 mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8 justify-items-center md:justify-items-stretch">
          {/* Instagram */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-xl font-bold mb-4 font-serif text-white/90">
              Instagram
            </h3>
            <a
              href="https://www.instagram.com/fotos_by_tito"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-white/80 transition-colors group"
            >
              <Instagram size={24} />
              <span>@fotosbytito</span>
              <ArrowRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
            </a>
            <div className="grid grid-cols-3 gap-2 mt-2 max-w-[200px]">
              {/* Placeholders for IG Feed */}
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-white/10 backdrop-blur-sm rounded-md border border-white/5"
                ></div>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <div className="flex flex-col items-center md:items-end text-center md:text-right">
            <h3 className="text-3xl md:text-4xl font-bold mb-6 leading-tight drop-shadow-sm font-serif">
              Ready to create <br /> something beautiful?
            </h3>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white hover:bg-white/90 text-[#2d5d4b] px-8 py-4 rounded-full font-bold uppercase tracking-wider transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Book your session
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
