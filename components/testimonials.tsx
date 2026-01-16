"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Emily Johnson",
    text: "Damien's photography doesn't just capture moments; it captures emotions. His work is simply mesmerizing.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    text: "The best photographer I've ever worked with. Professional, creative, and the results were stunning.",
    rating: 5,
  },
  {
    name: "Sarah Davis",
    text: "We hired TITO for our wedding and couldn't be happier. The photos are like scenes from a movie.",
    rating: 5,
  },
];

import { fadeInUp, staggerContainer } from "@/lib/animations";

export function Testimonials() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold mb-16 text-center text-[#2d5d4b] uppercase"
        >
          Stories & Reviews
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px" }}
        >
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              variants={fadeInUp}
              className="bg-background p-8 rounded-xl shadow-sm border border-border/50 flex flex-col items-start"
            >
              <div className="flex gap-1 mb-4 text-[#2d5d4b]">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed flex-grow">
                "{t.text}"
              </p>
              <div className="mt-auto">
                <span className="font-bold text-lg">{t.name}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
