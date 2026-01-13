"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export function PortfolioEndCap() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-background">
      <div className="container mx-auto px-4 max-w-4xl relative z-10 flex flex-col items-center text-center">
        {/* Strong Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative w-full max-w-lg aspect-[4/5] md:aspect-[3/2] rounded-2xl overflow-hidden mb-12 shadow-2xl"
        >
          <Image
            src="https://images.unsplash.com/photo-1542038784456-1ea0e93ca64b?q=80&w=2000&auto=format&fit=crop"
            alt="End cap visual"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/10" />
        </motion.div>

        {/* Short Line */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-3xl md:text-5xl font-serif font-medium tracking-wide mb-10 text-emerald-900"
        >
          Ready to create something beautiful?
        </motion.h2>

        {/* Two Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-6"
        >
          <Link
            href="/pricing"
            className="px-8 py-3 rounded-full border-2 border-[#2d5d4b] text-[#2d5d4b] font-bold uppercase tracking-widest hover:bg-[#2d5d4b] hover:text-white transition-all duration-300"
          >
            Pricing
          </Link>
          <Link
            href="/contact"
            className="px-10 py-3.5 rounded-full bg-[#2d5d4b] text-white font-bold uppercase tracking-widest hover:bg-[#1e3d32] shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Contact
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
