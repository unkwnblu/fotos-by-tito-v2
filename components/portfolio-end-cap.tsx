"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function PortfolioEndCap() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-background">
      <div className="container mx-auto px-4 max-w-4xl relative z-10 flex flex-col items-center text-center">
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
