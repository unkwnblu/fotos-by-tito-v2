"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

// Define the interface for a photo object
export interface PhotoItem {
  src?: string;
  alt?: string;
  className: string;
  type?: "photo" | "cta";
  ctaContent?: {
    title: string;
    buttonText: string;
    href: string;
  };
}

const defaultPhotos: PhotoItem[] = [
  {
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80",
    alt: "Beautiful Landscape",
    className: "col-span-1 lg:col-span-2 lg:row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
    alt: "Portrait Mode",
    className: "col-span-1 lg:col-span-1 lg:row-span-1",
  },
  {
    src: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=800&q=80",
    alt: "Fashion Model",
    className: "col-span-2 lg:col-span-1 lg:row-span-1",
  },
  {
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80",
    alt: "Smiling Woman",
    className: "col-span-1 lg:col-span-1 lg:row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800&q=80",
    alt: "Abstract Architecture",
    className: "col-span-1 lg:col-span-1 lg:row-span-1",
  },
  {
    src: "https://images.unsplash.com/photo-1521185496955-15097b20c5fe?w=800&q=80",
    alt: "Urban Design",
    className: "col-span-2 lg:col-span-2 lg:row-span-1",
  },
  {
    src: "https://images.unsplash.com/photo-1554080353-a576cf803bda?w=800&q=80",
    alt: "Photography",
    className: "col-span-1 lg:col-span-1 lg:row-span-1",
  },
  {
    src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
    alt: "Nature",
    className: "col-span-1 lg:col-span-1 lg:row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80",
    alt: "Portrait",
    className: "col-span-2 lg:col-span-1 lg:row-span-1",
  },
  {
    src: "https://images.unsplash.com/photo-1505144808419-1957a94ca61e?w=800&q=80",
    alt: "Beach",
    className: "col-span-1 lg:col-span-2 lg:row-span-1",
  },
  {
    src: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80",
    alt: "Mountain View",
    className: "col-span-1 lg:col-span-2 lg:row-span-1",
  },
  {
    src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80",
    alt: "Forest Path",
    className: "col-span-2 lg:col-span-1 lg:row-span-1",
  },
];

interface PhotoGridProps {
  photos?: PhotoItem[];
}

export function PhotoGrid({ photos = defaultPhotos }: PhotoGridProps) {
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  const handleImageLoad = (idx: number) => {
    setLoadedImages((prev) => new Set(prev).add(idx));
  };

  return (
    <div className="grid grid-cols-2 gap-2 md:gap-4 lg:grid-cols-4 auto-rows-[250px] mb-16 -mx-1 md:mx-0">
      {photos.map((photo, idx) => {
        if (photo.type === "cta" && photo.ctaContent) {
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={cn(
                "col-span-2 md:col-span-2 lg:col-span-4 row-span-1 flex flex-col items-center justify-center py-12 md:py-16 bg-muted/30 rounded-lg text-center px-4",
                photo.className
              )}
            >
              <div className="w-16 h-px bg-primary/20 mb-6" />
              <h3 className="text-xl md:text-2xl font-serif text-emerald-900 mb-6 font-medium">
                {photo.ctaContent.title}
              </h3>
              <a
                href={photo.ctaContent.href}
                className="inline-flex items-center justify-center px-6 py-2 text-sm font-bold uppercase tracking-widest text-white bg-[#2d5d4b] rounded-full hover:bg-[#1e3d32] transition-colors"
              >
                {photo.ctaContent.buttonText}
              </a>
              <div className="w-16 h-px bg-primary/20 mt-6" />
            </motion.div>
          );
        }

        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: idx * 0.05 }}
            className={cn(
              "relative overflow-hidden rounded-lg group bg-muted",
              photo.className
            )}
          >
            {!loadedImages.has(idx) && (
              <Skeleton className="absolute inset-0 h-full w-full" />
            )}
            {photo.src && (
              <Image
                src={photo.src}
                alt={photo.alt || ""}
                fill
                className={cn(
                  "object-cover transition-transform duration-300 group-hover:scale-105",
                  !loadedImages.has(idx) ? "opacity-0" : "opacity-100"
                )}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onLoad={() => handleImageLoad(idx)}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
