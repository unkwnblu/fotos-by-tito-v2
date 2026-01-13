"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import Link from "next/link";

const offerings = [
  {
    title: "FAMILY & MATERNITY",
    slug: "family-maternity",
    description:
      "Our portrait photography service is all about showcasing your unique personality. Whether you need a professional headshot, a family portrait, or a personal photoshoot, we create images that reflect your true self. We work closely with you to bring out your best angles and expressions, ensuring every portrait tells your story.",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop",
  },
  {
    title: "NEWBORN",
    slug: "newborn",
    description:
      "Capturing the magic of your special day with a blend of candid moments and artistic composition. From the nervous anticipation to the joyous celebration, we document every emotion to create a timeless visual story of your love.",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop",
  },
  {
    title: "PORTRAITS & HEADSHOTS",
    slug: "portraits-headshots",
    description:
      "Elevate your brand with high-quality imagery that speaks to your audience. We specialize in product photography, corporate headshots, and lifestyle visuals that define your brand identity and make a lasting impact.",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background pt-10 pb-20">
      <div className="container mx-auto px-4 md:px-12 lg:px-24">
        {/* Header */}
        <ScrollReveal className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-wide decoration-blue-500 decoration-4 underline-offset-8">
            DIVERSE PHOTOGRAPHY OFFERINGS
          </h1>
        </ScrollReveal>

        {/* Offerings List */}
        <div className="lg:space-y-32 md:space-y-20 space-y-10">
          {offerings.map((offering, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center"
            >
              {/* Text Content */}
              <ScrollReveal
                direction="right"
                className={`order-2 ${
                  idx % 2 === 0 ? "lg:order-1" : "lg:order-2"
                }`}
              >
                <h2 className="text-2xl md:text-3xl font-semibold text-emerald-900 dark:text-emerald-500 uppercase tracking-wider mb-6">
                  {offering.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-8 text-sm md:text-base">
                  {offering.description}
                </p>
                <Link
                  href={`/pricing/${offering.slug}`}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors border-b border-transparent hover:border-foreground pb-1"
                >
                  EXPLORE CATEGORY <ArrowUpRight className="h-3 w-3" />
                </Link>
              </ScrollReveal>

              {/* Image Card with Cutout */}
              <ScrollReveal
                direction="left"
                className={`relative order-1 ${
                  idx % 2 === 0 ? "lg:order-2" : "lg:order-1"
                }`}
              >
                {/* Image Container with Mask */}
                <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden rounded-3xl bg-muted">
                  <Image
                    src={offering.image}
                    alt={offering.title}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/10 transition-colors hover:bg-transparent" />
                </div>
              </ScrollReveal>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
