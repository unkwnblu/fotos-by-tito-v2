"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { motion } from "framer-motion";

export function EnquiryBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative w-full overflow-hidden rounded-xl bg-gray-900 text-white my-5"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 opacity-40 mix-blend-overlay">
        <Image
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070"
          alt="Architecture Background"
          fill
          className="object-cover grayscale"
        />
      </div>

      {/* Dark Gradient Overlay for readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col justify-between p-8 md:flex-row md:items-end md:p-12 lg:p-16 h-[300px] md:h-[350px]">
        {/* Left Side: Heading */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-xl"
        >
          <h2 className="text-3xl font-bold uppercase leading-tight tracking-tight md:text-5xl">
            Any questions <br />
            or enquiries
          </h2>
        </motion.div>

        {/* Right Side: Contact Info & Button */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col items-start gap-6 md:items-end md:text-right mt-8 md:mt-0"
        >
          <div className="space-y-1 text-sm font-medium tracking-wide opacity-90 uppercase">
            <p className="flex items-center gap-2 md:justify-end">
              <span className="opacity-70">EMAIL:</span> FOTOSBYTITO@GMAIL.COM
            </p>
            <p className="flex items-center gap-2 md:justify-end">
              <span className="opacity-70">PHONE:</span> 06-28374829
            </p>
          </div>

          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 rounded-md bg-[#3a5a4d] px-8 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#2d463c]"
          >
            Get in touch
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
