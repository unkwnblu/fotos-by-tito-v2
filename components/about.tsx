"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function About() {
  const [loadedMain, setLoadedMain] = useState(false);
  const [loadedSecondary, setLoadedSecondary] = useState(false);

  return (
    <section className="w-full py-8 md:py-16 px-8 md:px-24 lg:px-48">
      <div className="grid gap-12 md:grid-cols-2 md:items-center">
        {/* Left Column: Text */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="order-2 md:order-1"
        >
          <p className="text-2xl leading-relaxed text-muted-foreground tracking-wide">
            Capturing the essence of every moment, FotosByTito is dedicated to
            the art of visual storytelling. Through a blend of natural light and
            candid emotion, we freeze time to create memories that last a
            lifetime. Whether exploring urban landscapes or documenting personal
            milestones, our lens focuses on the beauty of the authentic. Every
            photograph is more than just an image; it's a piece of a larger
            narrative waiting to be told.
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
          <div className="relative h-[400px] w-[300px] md:h-[500px] md:w-[400px]">
            {/* Main Rectangle Image */}
            <div className="relative h-full w-full overflow-hidden rounded-xl bg-muted">
              {!loadedMain && (
                <Skeleton className="absolute inset-0 h-full w-full" />
              )}
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800"
                alt="Photographer Portrait"
                fill
                className={cn(
                  "object-cover transition-opacity duration-500",
                  loadedMain ? "opacity-100" : "opacity-0"
                )}
                onLoad={() => setLoadedMain(true)}
              />
            </div>

            {/* Overlapping Circle Image */}
            <div className="absolute -bottom-16 -left-16 h-32 w-32 overflow-hidden rounded-full border-4 border-background md:h-48 md:w-48 bg-muted">
              {!loadedSecondary && (
                <Skeleton className="absolute inset-0 h-full w-full" />
              )}
              <Image
                src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=400"
                alt="Secondary Portrait"
                fill
                className={cn(
                  "object-cover transition-opacity duration-500",
                  loadedSecondary ? "opacity-100" : "opacity-0"
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
