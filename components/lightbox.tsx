"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { PhotoItem } from "./photo-grid";

interface LightboxProps {
  images: PhotoItem[];
  initialIndex: number;
  onClose: () => void;
}

export function Lightbox({ images, initialIndex, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Filter out CTA items just in case, though parent should handle this
  const photos = images.filter((img) => img.type !== "cta");

  // Update internal index if initialIndex changes (unlikely but good practice)
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  }, [photos.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    // Lock body scroll
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [handleNext, handlePrev, onClose]);

  if (!photos[currentIndex]) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-sm"
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 rounded-full bg-black/50 p-2 text-white hover:bg-white/20 transition-colors"
        aria-label="Close lightbox"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Main Image Area */}
      <div className="relative flex-1 w-full max-w-7xl mx-auto flex items-center justify-center p-4">
        {/* Prev Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className="absolute left-4 z-50 hidden md:flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-white transition-all hover:bg-white/20 hover:scale-105"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        {/* Image */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative h-full w-full flex items-center justify-center"
          >
            {photos[currentIndex].src && (
              <div className="relative h-full w-full">
                <Image
                  src={photos[currentIndex].src}
                  alt={photos[currentIndex].alt || "Portfolio image"}
                  fill
                  className="object-contain"
                  priority
                  quality={90}
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Next Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute right-4 z-50 hidden md:flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-white transition-all hover:bg-white/20 hover:scale-105"
          aria-label="Next image"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Thumbnails Strip */}
      <div className="w-full h-24 bg-black/80 backdrop-blur-md border-t border-white/10 overflow-hidden flex-shrink-0">
        <div className="h-full w-full overflow-x-auto flex items-center gap-2 px-4 scrollbar-hide">
          {photos.map((photo, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                "relative h-16 w-16 min-w-[64px] rounded-md overflow-hidden transition-all duration-300 border-2",
                currentIndex === idx
                  ? "border-emerald-500 scale-105 opacity-100"
                  : "border-transparent opacity-50 hover:opacity-80",
              )}
            >
              {photo.src && (
                <Image
                  src={photo.src}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
