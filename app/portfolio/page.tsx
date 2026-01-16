"use client";

import { PortfolioHero } from "@/components/portfolio-hero";
import { PortfolioCategories } from "@/components/portfolio-categories";
import { PortfolioFooter } from "@/components/portfolio-footer";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";

export default function PortfolioPage() {
  return (
    <div className="min-h-screen">
      <PortfolioHero />

      <div className="container mx-auto px-4 py-2">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px" }}
        >
          <PortfolioCategories />
        </motion.div>
      </div>

      <PortfolioFooter />
    </div>
  );
}
