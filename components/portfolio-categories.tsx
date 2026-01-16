"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { categories, CategoryData } from "@/lib/data";

function CategorySection({ data }: { data: CategoryData }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400; // Approx card width + gap
      const newScrollLeft =
        direction === "left"
          ? scrollRef.current.scrollLeft - scrollAmount
          : scrollRef.current.scrollLeft + scrollAmount;

      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  // Duplicate images to create an "infinite" feel
  const displayImages = Array(20).fill(data.images).flat();

  return (
    <div className="flex flex-col gap-6 py-4">
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-0">
        <Link
          href={`/portfolio/${data.id}`}
          className="hover:opacity-80 transition-opacity"
        >
          <h2 className="text-xl md:text-2xl font-medium tracking-wide text-emerald-900 uppercase">
            {data.title}
          </h2>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide px-4 md:px-0 pb-4 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {displayImages.map((src, index) => (
          <div
            key={`${data.id}-${index}`}
            className="relative h-[400px] min-w-[300px] md:min-w-[400px] flex-shrink-0 snap-start overflow-hidden rounded-2xl bg-muted"
          >
            <Image
              src={src}
              alt={`${data.title} ${index + 1}`}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export function PortfolioCategories() {
  return (
    <div className="flex flex-col gap-2 py-12">
      {categories.map((category) => (
        <motion.div
          key={category.id}
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px" }}
        >
          <CategorySection data={category} />
        </motion.div>
      ))}
    </div>
  );
}
