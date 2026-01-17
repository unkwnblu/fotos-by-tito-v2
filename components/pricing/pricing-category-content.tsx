"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { PricingCategory } from "@/lib/pricing-data";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { BookingModal } from "@/components/booking-modal";
import { cn } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/animations";

interface PricingCategoryContentProps {
  data: PricingCategory;
  dynamicImage?: string;
  categoryId: string;
}

export function PricingCategoryContent({
  data,
  dynamicImage,
  categoryId,
}: PricingCategoryContentProps) {
  const router = useRouter();

  // Default to first tab if available
  const [activeTab, setActiveTab] = useState(data.tabs[0] || "");
  const [selectedPackage, setSelectedPackage] = useState<{
    name: string;
    price: string;
    categoryTitle: string;
  } | null>(null);

  const currentPackages = data.packages[activeTab] || [];
  const displayImage = dynamicImage || data.image;

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* LEFT COLUMN: Sticky Image & Title */}
      <div className="w-full md:w-1/2 h-[25vh] md:h-screen sticky top-0 relative z-0 overflow-hidden bg-muted">
        <Image
          src={displayImage}
          alt={data.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30 md:bg-black/20" />

        <div className="absolute inset-0 p-8 md:p-16 flex flex-col justify-between">
          <button
            onClick={() => router.push("/pricing")}
            className="text-white/80 hover:text-white flex items-center gap-2 group w-fit"
          >
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase">
              Back to Pricing
            </span>
          </button>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-none mb-4">
              {data.title}
            </h1>
            <p className="text-white/90 text-sm md:text-lg max-w-md font-light leading-relaxed">
              {data.description}
            </p>
          </motion.div>
        </div>
      </div>

      {/* RIGHT COLUMN: Scrollable Content */}
      <div className="w-full md:w-1/2 min-h-screen bg-background relative z-10 p-6 md:p-16 lg:p-24 flex flex-col">
        {/* Tabs */}
        {data.tabs.length > 1 && (
          <div className="mb-16 flex flex-wrap gap-8 pb-4 sticky top-4 bg-background/95 backdrop-blur-sm z-10 pt-4">
            {data.tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "relative pb-2 text-sm font-bold tracking-widest uppercase transition-colors",
                  activeTab === tab
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground/70"
                )}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2d5d4b]"
                  />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Packages List */}
        <motion.div
          className="space-y-16 md:space-y-24 flex-1"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-50px" }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.4, staggerChildren: 0.1 },
                },
                exit: { opacity: 0, y: -20 },
              }}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-12"
            >
              {currentPackages.map((pkg, idx) => (
                <motion.div
                  key={pkg.name}
                  variants={fadeInUp}
                  className="group flex flex-col gap-6"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-baseline gap-4 border-b border-border py-4">
                    <h3 className="text-2xl md:text-3xl font-serif text-foreground">
                      {pkg.name}
                    </h3>
                    <span className="text-xl md:text-2xl font-light text-foreground">
                      {pkg.price}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {pkg.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
                        <span className="text-sm md:text-base text-muted-foreground leading-relaxed uppercase tracking-wide">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() =>
                      setSelectedPackage({
                        name: pkg.name,
                        price: pkg.price,
                        categoryTitle: data.title,
                      })
                    }
                    className="mt-4 w-full md:w-fit px-8 py-4 bg-[#2d5d4b] text-background text-xs font-bold tracking-[0.2em] uppercase hover:bg-foreground/90 transition-colors"
                  >
                    Request Booking
                  </button>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {currentPackages.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              No packages available for this category yet.
            </div>
          )}
        </motion.div>

        {/* Footer info - What's Included */}
        <div className="mt-24 pt-12 border-t border-border/50">
          <h3 className="text-xl font-serif font-bold mb-8 text-foreground uppercase tracking-wider">
            What’s Included in Every Session
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            {[
              "Professional guidance throughout your session",
              "Carefully edited, high-resolution images",
              "Private online gallery for viewing & downloads",
              "Option to purchase additional images at €10 per image",
              "Simple styling guidance before your shoot",
              "No VAT charged under the KOR scheme",
              "All sessions require a booking retainer of €50",
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 text-muted-foreground"
              >
                <span className="mt-2 w-1 h-1 rounded-full bg-foreground shrink-0" />
                <span className="text-sm font-light leading-relaxed">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BookingModal
        isOpen={!!selectedPackage}
        onClose={() => setSelectedPackage(null)}
        packageDetails={selectedPackage}
      />
    </div>
  );
}
