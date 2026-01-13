"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Facebook, Twitter, Linkedin, Star, Instagram } from "lucide-react";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    id: 1,
    name: "Emily Johnson",
    location: "USA, California",
    text: "Damien's photography doesn't just capture moments; it captures emotions. His work is simply mesmerizing.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    desktopPosition: { top: "10%", left: "20%" },
    mobilePosition: { top: "15%", left: "10%" }, // Top Left Mobile
  },
  {
    id: 2,
    name: "Michael Chen",
    location: "UK, London",
    text: "The best photographer I've ever worked with. Professional, creative, and the results were stunning.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    desktopPosition: { top: "10%", right: "20%" },
    mobilePosition: { top: "15%", right: "10%" }, // Top Right Mobile
  },
  {
    id: 5, // Moved to be 3rd in rendering order if we iterate linearly, or just mapped by ID logic
    name: "Alex Thompson",
    location: "USA, New York",
    text: "Highly recommended for any commercial work. TITO understands brand identity perfectly.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop",
    desktopPosition: { top: "45%", left: "5%" },
    mobilePosition: { top: "5%", left: "50%", transform: "translateX(-50%)" }, // Top Center Mobile
  },
  {
    id: 3,
    name: "Sarah Davis",
    location: "Canada, Toronto",
    text: "We hired TITO for our wedding and couldn't be happier. The photos are like scenes from a movie.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
    desktopPosition: { bottom: "20%", left: "20%" },
    mobilePosition: { bottom: "15%", left: "10%" }, // Bottom Left Mobile
  },
  {
    id: 4,
    name: "David Wilson",
    location: "Australia, Sydney",
    text: "Incredible attention to detail. He made me feel comfortable and the headshots came out perfect.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    desktopPosition: { bottom: "20%", right: "20%" },
    mobilePosition: { bottom: "15%", right: "10%" }, // Bottom Right Mobile
  },
  {
    id: 6,
    name: "Jessica Lee",
    location: "France, Paris",
    text: "A true artist. The portrait session was fun and the final images exceeded all my expectations.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop",
    desktopPosition: { top: "45%", right: "5%" },
    mobilePosition: {
      bottom: "5%",
      left: "50%",
      transform: "translateX(-50%)",
    }, // Bottom Center Mobile
  },
];

export function TestimonialsInteractive() {
  const [activeId, setActiveId] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const activeTestimonial =
    testimonials.find((t) => t.id === activeId) || testimonials[0];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-black/20">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10 bg-neutral-950 overflow-hidden">
        <motion.div
          className="absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-emerald-900/20 blur-[120px]"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute bottom-[-20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-blue-900/10 blur-[120px]"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute top-[40%] left-[30%] h-[400px] w-[400px] rounded-full bg-purple-900/10 blur-[120px]"
          animate={{
            x: [0, 50, 0],
            y: [0, 100, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Floating Avatars */}
      {testimonials.map((t) => (
        <motion.button
          key={t.id}
          onClick={() => setActiveId(t.id)}
          className={cn(
            "absolute h-14 w-14 md:h-20 md:w-20 rounded-full border-2 border-white/50 overflow-hidden shadow-lg focus:outline-none focus:ring-2 focus:ring-white",
            activeId === t.id
              ? "ring-2 ring-white border-white scale-110"
              : "opacity-80 grayscale hover:grayscale-0"
          )}
          style={isMobile ? t.mobilePosition : (t.desktopPosition as any)}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 1,
            scale: activeId === t.id ? 1.1 : 1,
            y: [0, -10, 0], // Gentle floating animation
          }}
          transition={{
            opacity: { duration: 0.5 },
            scale: { duration: 0.3 },
            y: {
              duration: 3 + (t.id % 3), // Randomize duration (3-5s)
              repeat: Infinity,
              ease: "easeInOut",
              delay: t.id * 0.2, // Stagger start
            },
          }}
        >
          <Image src={t.image} alt={t.name} fill className="object-cover" />
        </motion.button>
      ))}

      {/* Central Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeId}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="relative z-10 w-[90%] max-w-md rounded-3xl bg-black/80 backdrop-blur-md p-8 md:p-10 text-white shadow-2xl border border-white/10"
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-xl md:text-2xl font-bold font-serif tracking-wide text-white/90">
                {activeTestimonial.name}
              </h3>
              <p className="text-xs md:text-sm text-white/50 uppercase tracking-widest mt-1">
                {activeTestimonial.location}
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer">
                <Facebook className="h-4 w-4" />
              </div>
              <div className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer">
                <Twitter className="h-4 w-4" />
              </div>
              <div className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer">
                <Linkedin className="h-4 w-4" />
              </div>
            </div>
          </div>

          <div className="flex gap-1 mb-6 text-yellow-500">
            {[...Array(activeTestimonial.rating)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-yellow-500" />
            ))}
          </div>

          <p className="text-base md:text-lg leading-relaxed text-white/80 font-light">
            "{activeTestimonial.text}"
          </p>

          {/* Decorative background shape in card if needed, effectively simpler to just keep glassmorphism */}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
