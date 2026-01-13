"use client";

import { Sparkles, Hourglass, Heart } from "lucide-react";
import { motion } from "framer-motion";

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
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            More than photos — an experience designed around you.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
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
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <p className="text-lg md:text-xl font-medium text-[#2d5d4b]">
            When you book with me, you’re not just booking photos — you’re
            investing in an experience you’ll enjoy and images you’ll truly
            love.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
