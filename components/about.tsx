"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function About() {
  const [loadedSecondary, setLoadedSecondary] = useState(false);

  return (
    <section className="w-full py-8 md:py-16 px-8 md:px-24 lg:px-48">
      <div className="grid gap-2 md:grid-cols-3 md:items-center">
        {/* Left Column: Text */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="order-2 md:order-1 col-span-2"
        >
          <p className="text-xl leading-relaxed text-muted-foreground tracking-wide">
            <span className="font-bold text-[#2d5d4b] uppercase">
              Hi, I’m Praise, the person behind the camera 😊
            </span>
            <br />
            I believe the most beautiful photos happen when you feel
            comfortable, seen, and celebrated. <br />
            I’m drawn to real moments — the quiet glances, the laughter in
            between poses, the joy that can’t be staged.
            <br />
            My sessions are relaxed, playful, and full of encouragement (yes,
            you’ll hear “so beautiful” more than once 😊). My goal is simple: to
            create images that feel natural now and meaningful years from now.
            <br />
          </p>
        </motion.div>

        {/* Right Column: Images */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="order-1 flex justify-center mb-12 md:mb-0 md:order-2 md:justify-end"
        >
          <div className="flex justify-center items-center">
            <div className="relative h-64 w-64 md:h-80 md:w-80 overflow-hidden rounded-full border-4 border-background bg-muted shadow-xl">
              {!loadedSecondary && (
                <Skeleton className="absolute inset-0 h-full w-full" />
              )}
              <Image
                src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=800"
                alt="Photographer Portrait"
                fill
                className={cn(
                  "object-cover transition-opacity duration-500",
                  loadedSecondary ? "opacity-100" : "opacity-0",
                )}
                onLoad={() => setLoadedSecondary(true)}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
