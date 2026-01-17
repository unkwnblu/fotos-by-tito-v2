"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Facebook, Twitter, Linkedin, Star, User } from "lucide-react";
import { cn } from "@/lib/utils";

// Define the static positions for the orbit effect
const POSITIONS = [
  {
    desktopPosition: { top: "10%", left: "20%" },
    mobilePosition: { top: "15%", left: "10%" },
  },
  {
    desktopPosition: { top: "10%", right: "20%" },
    mobilePosition: { top: "15%", right: "10%" },
  },
  {
    desktopPosition: { top: "45%", left: "5%" },
    mobilePosition: { top: "5%", left: "50%", transform: "translateX(-50%)" },
  },
  {
    desktopPosition: { bottom: "20%", left: "20%" },
    mobilePosition: { bottom: "15%", left: "10%" },
  },
  {
    desktopPosition: { bottom: "20%", right: "20%" },
    mobilePosition: { bottom: "15%", right: "10%" },
  },
  {
    desktopPosition: { top: "45%", right: "5%" },
    mobilePosition: {
      bottom: "5%",
      left: "50%",
      transform: "translateX(-50%)",
    },
  },
];

interface TestimonialsClientProps {
  testimonials: any[];
}

export function TestimonialsClient({ testimonials }: TestimonialsClientProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Set initial active ID
  useEffect(() => {
    if (testimonials.length > 0 && !activeId) {
      setActiveId(testimonials[0].id);
    }
  }, [testimonials, activeId]);

  const activeTestimonial =
    testimonials.find((t) => t.id === activeId) || testimonials[0];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!activeTestimonial) return null;

  return (
    <div className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-[#fdfdfd] z-0">
      {/* Background Layers */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Lighter, airy gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-zinc-50 to-slate-100 opacity-90" />

        {/* Light Aurora 1: Soft Emerald */}
        <div className="absolute top-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-emerald-400/20 blur-[100px] animate-aurora-1 mix-blend-multiply" />

        {/* Light Aurora 2: Soft Blue/Indigo */}
        <div className="absolute bottom-[-10%] right-[-10%] h-[800px] w-[800px] rounded-full bg-indigo-300/20 blur-[120px] animate-aurora-2 mix-blend-multiply" />

        {/* Light Aurora 3: Warm Peach/Gold */}
        <div className="absolute top-[30%] left-[60%] h-[400px] w-[400px] rounded-full bg-orange-200/30 blur-[90px] animate-aurora-3 mix-blend-multiply" />

        {/* Texture Overlay (lighter grain) */}
        <div
          className="absolute inset-0 opacity-[0.04] z-10"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
          }}
        />
      </div>

      {/* Floating Avatars */}
      {testimonials.map((t, idx) => {
        const pos = POSITIONS[idx % POSITIONS.length];

        return (
          <motion.button
            key={t.id}
            onClick={() => setActiveId(t.id)}
            className={cn(
              "absolute z-20 h-14 w-14 md:h-20 md:w-20 rounded-full border-2 border-white/80 overflow-hidden shadow-md focus:outline-none focus:ring-2 focus:ring-zinc-400 transition-all duration-300 bg-white",
              activeId === t.id
                ? "ring-2 ring-zinc-400 border-white scale-110 grayscale-0 shadow-xl"
                : "opacity-70 grayscale hover:grayscale-0 hover:opacity-100"
            )}
            style={isMobile ? pos.mobilePosition : (pos.desktopPosition as any)}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: activeId === t.id ? 1.1 : 1,
              y: [0, -10, 0],
            }}
            transition={{
              opacity: { duration: 0.5 },
              scale: { duration: 0.3 },
              y: {
                duration: 3 + (idx % 3),
                repeat: Infinity,
                ease: "easeInOut",
                delay: idx * 0.2,
              },
            }}
          >
            {t.image_url ? (
              <Image
                src={t.image_url}
                alt={t.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-zinc-100 text-zinc-400">
                <User className="w-8 h-8" />
              </div>
            )}
          </motion.button>
        );
      })}

      {/* Central Card - Light Glassmorphism */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeId}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="relative z-30 w-[90%] max-w-md rounded-3xl bg-white/70 backdrop-blur-xl p-8 md:p-10 text-zinc-900 shadow-2xl border border-white/60"
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-xl md:text-2xl font-bold font-serif tracking-wide text-zinc-900">
                {activeTestimonial.name}
              </h3>
              <p className="text-xs md:text-sm text-zinc-500 uppercase tracking-widest mt-1">
                {activeTestimonial.location}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {[Facebook, Twitter, Linkedin].map((Icon, i) => (
                <div
                  key={i}
                  className="p-2 rounded-full bg-zinc-100/50 hover:bg-zinc-200/50 transition-colors cursor-pointer border border-zinc-100 text-zinc-600"
                >
                  <Icon className="h-4 w-4" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-1 mb-6 text-yellow-500">
            {[...Array(activeTestimonial.rating || 5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-yellow-500" />
            ))}
          </div>

          <p className="text-base md:text-lg leading-relaxed text-zinc-700 font-light italic">
            "{activeTestimonial.text}"
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
