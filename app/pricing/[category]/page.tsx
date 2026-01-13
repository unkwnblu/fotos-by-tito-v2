"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { pricingData } from "@/lib/pricing-data";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { BookingModal } from "@/components/booking-modal";

export default function PricingCategoryPage() {
  const params = useParams();
  const categoryId = params.category as string;
  const data = pricingData[categoryId];

  // Default to first tab if available
  const [activeTab, setActiveTab] = useState(data?.tabs[0] || "");
  const [selectedPackage, setSelectedPackage] = useState<{
    name: string;
    price: string;
    categoryTitle: string;
  } | null>(null);

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Category not found</h1>
          <Link
            href="/pricing"
            className="mt-4 inline-block text-primary hover:underline"
          >
            Back to Pricing
          </Link>
        </div>
      </div>
    );
  }

  const currentPackages = data.packages[activeTab] || [];

  return (
    <div className="min-h-screen bg-background pt-10 pb-20">
      <div className="container mx-auto px-4 md:px-12 lg:px-24">
        {/* Breadcrumb */}
        <div className="mb-12 text-xs md:text-sm font-bold tracking-widest text-muted-foreground uppercase">
          <Link
            href="/pricing"
            className="hover:text-foreground transition-colors"
          >
            PRICING
          </Link>{" "}
          &gt; <span className="text-foreground">{data.title}</span>
        </div>

        {/* Description */}
        <div className="mb-20 max-w-4xl">
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            {data.description}
          </p>
        </div>

        {/* Tabs - Only show if more than 1 tab */}
        {data.tabs.length > 1 && (
          <div className="mb-16 flex flex-wrap gap-8 md:gap-16 border-b border-border/50 pb-4">
            {data.tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative pb-4 text-sm md:text-base font-bold tracking-widest uppercase transition-colors ${
                  activeTab === tab
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground/70"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground"
                  />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Separator if no tabs */}
        {data.tabs.length <= 1 && (
          <div className="mb-16 border-b border-border/50" />
        )}

        {/* Pricing List */}
        <div className="space-y-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-12"
            >
              {currentPackages.map((pkg, idx) => (
                <div
                  key={pkg.name}
                  className="group border-b border-border/50 pb-12 last:border-0"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
                    {/* Left Column: Price & Title */}
                    <div className="md:col-span-4 flex flex-col justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">
                          {pkg.name}
                        </h3>
                        <div className="text-5xl md:text-6xl font-serif text-muted-foreground/40 font-light mb-6">
                          {pkg.price}
                        </div>
                      </div>
                      <div>
                        <button
                          onClick={() =>
                            setSelectedPackage({
                              name: pkg.name,
                              price: pkg.price,
                              categoryTitle: data.title,
                            })
                          }
                          className="inline-block text-xs font-bold tracking-widest uppercase border-b border-foreground/30 hover:border-foreground pb-1 transition-colors text-left"
                        >
                          BOOK A CALL
                        </button>
                      </div>
                    </div>

                    {/* Right Column: Features */}
                    <div className="md:col-span-8 space-y-4">
                      {pkg.features.map((feature, fIdx) => (
                        <div
                          key={fIdx}
                          className="flex items-center gap-4 rounded-full border border-border p-4 px-6 transition-colors hover:border-foreground/50 hover:bg-muted/30"
                        >
                          <Sparkles className="h-4 w-4 flex-shrink-0 text-foreground/60" />
                          <span className="text-xs md:text-sm font-medium tracking-wide text-muted-foreground uppercase">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          {currentPackages.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              No packages available for this category yet.
            </div>
          )}
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
