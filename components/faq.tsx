"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "WHAT TYPE OF PHOTOGRAPHY DO YOU SPECIALIZE IN?",
    answer:
      "I specialize in Portrait, Landscape, and Event photography, capturing moments that tell unique stories. My goal is to create timeless images that resonate with the viewer.",
  },
  {
    question: "HOW CAN I BOOK A PHOTOGRAPHY SESSION WITH YOU?",
    answer:
      "Booking is simple! You can contact me through the 'Contact' form on this website/sidebar, or reach out via Instagram. I recommend booking at least 2 weeks in advance.",
  },
  {
    question: "WHAT EQUIPMENT DO YOU USE FOR YOUR PHOTOGRAPHY?",
    answer:
      "I use professional-grade Canon/Sony mirrorless cameras and a variety of prime lenses to ensure the highest quality images in any lighting condition.",
  },
  {
    question: "CAN I REQUEST A SPECIFIC LOCATION FOR A SESSION?",
    answer:
      "Absolutely! I love exploring new locations. If you have a specific spot in mind, let me know. If not, I can suggest several beautiful locations based on your vision.",
  },
  {
    question: "WHAT IS YOUR EDITING PROCESS LIKE?",
    answer:
      "I personally edit every photo to ensure color accuracy and style consistency. My process involves color correction, exposure adjustment, and subtle retouching to enhance the natural beauty.",
  },
  {
    question: "ARE DIGITAL FILES INCLUDED IN YOUR PHOTOGRAPHY PACKAGES?",
    answer:
      "Yes, all my packages include high-resolution digital files. You will receive a private online gallery where you can download your photos.",
  },
  {
    question: "DO YOU OFFER PRINTS OF YOUR PHOTOGRAPHS?",
    answer:
      "Yes, prints are available for purchase. You can order professional quality prints directly from your private online gallery.",
  },
  {
    question:
      "HOW LONG DOES IT TAKE TO RECEIVE THE EDITED PHOTOS AFTER A SESSION?",
    answer:
      "My typical turnaround time is 2 weeks. I will send you a few sneak peeks within 48 hours of our session!",
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full py-2 md:py-16 text-foreground">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-2 border-gray-200 dark:border-gray-800 py-8"
      >
        <p className="text-sm font-medium tracking-widest text-muted-foreground uppercase mb-2">
          FAQ'S
        </p>
        <h2 className="text-3xl md:text-5xl font-serif tracking-tight text-[#2d5d4b] dark:text-[#4d8d7b] uppercase">
          Frequently Asked Questions
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-2 border-t border-gray-200 dark:border-gray-800">
        {/* Left Column (Indices 0, 1, 2, 3) */}
        <div className="flex flex-col">
          {faqs.slice(0, 4).map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <FaqItem
                faq={faq}
                isOpen={openIndex === idx}
                onClick={() => toggleFaq(idx)}
                className="md:border-r border-gray-200 dark:border-gray-800"
              />
            </motion.div>
          ))}
        </div>

        {/* Right Column (Indices 4, 5, 6, 7) */}
        <div className="flex flex-col">
          {faqs.slice(4).map((faq, idx) => (
            <motion.div
              key={idx + 4}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (idx + 4) * 0.1 }}
            >
              <FaqItem
                faq={faq}
                isOpen={openIndex === idx + 4}
                onClick={() => toggleFaq(idx + 4)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqItem({
  faq,
  isOpen,
  onClick,
  className,
}: {
  faq: { question: string; answer: string };
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-b border-gray-200 dark:border-gray-800 px-6",
        className
      )}
    >
      <button
        onClick={onClick}
        className="flex w-full items-center justify-between py-8 text-left focus:outline-none group"
      >
        <span className="text-sm md:text-base font-medium uppercase tracking-wide pr-6 group-hover:text-primary transition-colors">
          {faq.question}
        </span>
        <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-gray-300 dark:border-gray-700 transition-colors group-hover:border-primary">
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-300",
              isOpen && "rotate-180"
            )}
          />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-8 text-sm text-muted-foreground leading-relaxed pr-6">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
