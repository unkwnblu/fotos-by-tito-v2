"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { CategoryData } from "@/lib/data";

interface WorkCategoriesProps {
  categories: CategoryData[];
}

export function WorkCategories({ categories }: WorkCategoriesProps) {
  // Filter out categories with no images? Or use a placeholder?
  // Let's assume passed categories are what we want to show.

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          className="text-3xl md:text-5xl font-bold mb-12 text-center text-[#2d5d4b] uppercase"
        >
          Explore the works
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px" }}
        >
          {categories.map((category) => {
            const imageSrc = category.images[0] || "/placeholder-image.jpg"; // You might want a real placeholder
            return (
              <motion.div
                key={category.id}
                variants={fadeInUp}
                className="group relative aspect-[4/5] overflow-hidden rounded-xl cursor-pointer"
              >
                <Link
                  href={`/portfolio/${category.id}`}
                  className="block w-full h-full"
                >
                  <Image
                    src={imageSrc}
                    alt={category.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 transition-opacity group-hover:bg-black/50" />

                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white">
                    <h3 className="text-2xl font-bold mb-4">
                      {category.title}
                    </h3>
                    <span className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 text-white/90">
                      View Gallery <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
