"use client";

import { PortfolioHero } from "@/components/portfolio-hero";
import { PortfolioCategories } from "@/components/portfolio-categories";
import { PortfolioFooter } from "@/components/portfolio-footer";
import { motion } from "framer-motion";

export default function PortfolioPage() {
  return (
    <div className="min-h-screen">
      <PortfolioHero />

      <div className="container mx-auto px-4 py-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <PortfolioCategories />
        </motion.div>
      </div>

      <PortfolioFooter />
    </div>
  );
}
