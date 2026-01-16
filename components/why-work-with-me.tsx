"use client";

import { Sparkles, Hourglass, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export function WhyWorkWithMe() {
  const pillars = [
    {
      icon: Sparkles,
      title: "Calm & Guided",
      text: "I gently guide you throughout the session so you never have to worry about posing — just relax and be yourself.",
    },
    {
      icon: Hourglass,
      title: "Timeless Editing",
      text: "Your images are carefully edited to look like you on your best day, with true skin tones and a clean, timeless finish.",
    },
    {
      icon: Heart,
      title: "Personal Experience",
      text: "Every session is thoughtfully planned and unhurried, so you feel supported, seen, and truly cared for from start to finish.",
    },
  ];

  return (
    <section className="py-10 md:py-10 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px" }}
        >
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              variants={fadeInUp}
              className="flex flex-col items-center text-center space-y-4"
            >
              <div className="bg-[#2d5d4b]/10 p-4 rounded-full text-[#2d5d4b]">
                <pillar.icon size={32} />
              </div>
              <h3 className="text-xl font-bold">{pillar.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {pillar.text}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
