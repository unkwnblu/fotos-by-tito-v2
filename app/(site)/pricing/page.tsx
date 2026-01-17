"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const offerings = [
  {
    id: "family",
    title: "Family & Milestones",
    subtitle: "Cherished Moments",
    price: "Starting at €165",
    description:
      "From growing families to joyful celebrations, these sessions are designed to capture connection, personality, and the moments you’ll want to remember years from now.",
    features: [
      "Relaxed & Fun",
      "No Stiff Posing",
      "Families, Birthdays, Maternity",
      "Professional Editing",
    ],
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop",
    link: "/pricing/family-maternity",
  },
  {
    id: "newborn",
    title: "Newborns",
    subtitle: "Tiny Beginnings",
    price: "Starting at €250",
    description:
      "Gentle, unhurried sessions focused on your baby’s earliest days — with comfort, safety, and simplicity at the heart of every shoot.",
    features: [
      "Baby-led Pace",
      "Comfort & Safety First",
      "In-home Sessions",
      "Timeless Edits",
    ],
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop",
    link: "/pricing/newborn",
  },
  {
    id: "portraits",
    title: "Portraits & Headshots",
    subtitle: "Boldly You",
    price: "Starting at €100",
    description:
      "Clean, professional portraits that reflect who you are — whether for work, personal branding, or simply celebrating yourself.",
    features: [
      "Professional Guidance",
      "Personal Branding",
      "LinkedIn & Websites",
      "Confidence Boosting",
    ],
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop",
    link: "/pricing/portraits-headshots",
  },
];

export default function PricingPage() {
  const [activeId, setActiveId] = useState<string | null>("newborn");

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row overflow-hidden relative">
      {/* Mobile Header (Visible only on small screens) */}
      <div className="md:hidden pt-24 pb-8 px-6">
        <h1 className="text-4xl font-serif font-bold tracking-tighter text-foreground mb-2">
          Select Session
        </h1>
        <p className="text-muted-foreground uppercase text-xs tracking-widest">
          Tap to expand
        </p>
      </div>

      {offerings.map((offering) => {
        const isActive = activeId === offering.id;

        return (
          <motion.div
            key={offering.id}
            layout
            onClick={() => setActiveId(isActive ? null : offering.id)}
            className={cn(
              "relative flex-1 md:h-screen min-h-[100px] md:min-h-0 flex flex-col justify-end overflow-hidden cursor-pointer group transition-all duration-700 ease-in-out border-b md:border-b-0 md:border-r border-border hover:flex-[1.5]",
              isActive ? "flex-[5] md:flex-[2.5]" : "flex-[1]"
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Background Image */}
            <div className="absolute inset-0 z-0 bg-zinc-200 dark:bg-zinc-900">
              <Image
                src={offering.image}
                alt={offering.title}
                fill
                className={cn(
                  "object-cover transition-all duration-1000 ease-out",
                  isActive
                    ? "scale-105 opacity-40 md:opacity-100"
                    : "scale-100 opacity-60 grayscale md:grayscale-[0.5] group-hover:grayscale-0"
                )}
              />
              <div
                className={cn(
                  "absolute inset-0 transition-colors duration-500",
                  isActive
                    ? "bg-background/80 md:bg-black/40"
                    : "bg-black/50 group-hover:bg-transparent"
                )}
              />
            </div>

            {/* Vertical Title (Desktop Inactive) */}
            {!isActive && (
              <div className="hidden md:flex absolute inset-0 items-center justify-center z-10 pointer-events-none">
                <h2 className="text-4xl font-serif font-bold text-white uppercase tracking-widest rotate-[-90deg] whitespace-nowrap opacity-90 drop-shadow-md">
                  {offering.title}
                </h2>
              </div>
            )}

            {/* Content Container */}
            <div className="relative z-20 p-8 md:p-12 lg:p-16 flex flex-col h-full justify-between">
              {/* Header (Active Only on Desktop, Always on Mobile if active) */}
              <AnimatePresence>
                {(isActive ||
                  (typeof window !== "undefined" &&
                    window.innerWidth < 768)) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2"
                  >
                    <p
                      className={cn(
                        "text-xs font-bold tracking-[0.2em] uppercase md:text-white/80",
                        isActive ? "text-primary/80" : "text-white/90"
                      )}
                    >
                      {offering.subtitle}
                    </p>
                    <h2
                      className={cn(
                        "text-4xl md:text-6xl font-serif font-bold leading-none md:text-white",
                        isActive ? "text-foreground" : "text-white"
                      )}
                    >
                      {offering.title}
                    </h2>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Expanded Details */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-8 pt-6 md:max-w-md"
                  >
                    <div className="h-px w-12 bg-primary/50 md:bg-white/50" />

                    <p className="text-lg md:text-xl text-muted-foreground md:text-white/90 leading-relaxed font-light">
                      {offering.description}
                    </p>

                    <div className="space-y-3">
                      {offering.features.map((feature, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 text-sm md:text-base text-foreground/80 md:text-white/80"
                        >
                          <Check className="w-4 h-4 text-primary md:text-emerald-400" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 flex flex-col md:flex-row items-start md:items-center gap-6">
                      <span className="text-3xl font-serif text-foreground md:text-white">
                        {offering.price}
                      </span>
                      <Link
                        href={offering.link}
                        className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#2d5d4b] text-background md:bg-[#2d5d4b] md:text-white font-medium hover:scale-105 transition-transform"
                      >
                        Book Session <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
