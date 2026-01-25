"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { CategoryData } from "@/lib/data";

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

  // If no images, we can hide the carousel or show a placeholder?
  // Let's hide if empty.
  if (!data.images || data.images.length === 0) {
    return null;
  }

  const displayImages =
    data.images.length > 5
      ? data.images
      : [...data.images, ...data.images, ...data.images]; // duplicate for fuller look if few images

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
          {displayImages.length > 3 && (
            <>
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
            </>
          )}
        </div>
      </div>

      {/* Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide px-4 md:px-0 pb-4 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {displayImages.map((src, index) => (
          <Link
            key={`${data.id}-${index}`}
            href={`/portfolio/${data.id}`}
            className="relative h-[400px] min-w-[300px] md:min-w-[400px] flex-shrink-0 snap-start overflow-hidden rounded-2xl bg-muted block"
          >
            <Image
              src={src}
              alt={`${data.title} ${index + 1}`}
              fill
              className="object-cover object-[center_18%] transition-transform duration-500 hover:scale-105"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";

export function PortfolioCategories({
  categories,
}: {
  categories: CategoryData[];
}) {
  // If all categories are empty, show message?
  const hasImages = categories.some((c) => c.images.length > 0);

  if (!hasImages) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <p>No photos uploaded to any category yet.</p>
      </div>
    );
  }

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
