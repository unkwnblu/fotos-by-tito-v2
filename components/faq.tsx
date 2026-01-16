"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "What type of photography do you specialize in?",
    answer:
      "I specialize in natural, heartfelt photography — including maternity, newborn, family, portraits, headshots, and celebrations. My focus is on capturing real moments in a relaxed and enjoyable way.",
  },
  {
    question: "What if I’m not comfortable in front of the camera?",
    answer:
      "Most of my clients feel this way at first — and that’s completely okay. I’ll guide you gently throughout the session with natural prompts, so you never feel stiff or awkward.",
  },
  {
    question: "Can I request a specific location for the shoot?",
    answer:
      "Absolutely. Whether it’s your home, a favorite outdoor spot, or my studio, we’ll choose a location that feels right for you and fits the vision for your session.",
  },
  {
    question: "What should we wear?",
    answer:
      "Once your session is booked, you’ll receive a simple styling guide to help you choose outfits that photograph beautifully and feel like you.",
  },
  {
    question: "How long does a session last?",
    answer:
      "Most sessions last between 45–90 minutes, depending on the type of shoot. We always work at a relaxed pace — especially with children.",
  },
  {
    question: "Are digital images included?",
    answer:
      "Yes. Your package includes high-resolution, professionally edited digital images, delivered via a private online gallery. You’ll also have the option to order prints or albums if you wish.",
  },
  {
    question: "What is your editing process like?",
    answer:
      "I carefully edit each image for color, light, and consistency while keeping everything natural. My goal is to enhance your photos — not change how you look.",
  },
  {
    question: "When will we receive our photos?",
    answer:
      "Your final gallery will be delivered within 2–3 weeks after your session.",
  },
  {
    question: "How do I book a session?",
    answer:
      "Simply click the Book Now button and follow the steps. If you have any questions before booking, feel free to get in touch.",
  },
  {
    question: "Can we include our pets?",
    answer:
      "Yes! Pets are family too. Just let me know in advance so we can ensure our chosen location is pet-friendly.",
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
        className="mb-2 border-gray-200 py-8"
      >
        <p className="text-sm font-medium tracking-widest text-muted-foreground uppercase mb-2">
          FAQ'S
        </p>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#2d5d4b] uppercase">
          Frequently Asked Questions
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-2 border-t border-gray-200">
        {/* Left Column (Indices 0, 1, 2, 3, 4) */}
        <div className="flex flex-col">
          {faqs.slice(0, 5).map((faq, idx) => (
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
                className="md:border-r border-gray-200"
              />
            </motion.div>
          ))}
        </div>

        {/* Right Column (Indices 5, 6, 7, 8, 9) */}
        <div className="flex flex-col">
          {faqs.slice(5).map((faq, idx) => (
            <motion.div
              key={idx + 5}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (idx + 5) * 0.1 }}
            >
              <FaqItem
                faq={faq}
                isOpen={openIndex === idx + 5}
                onClick={() => toggleFaq(idx + 5)}
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
    <div className={cn("border-b border-gray-200 px-6", className)}>
      <button
        onClick={onClick}
        className="flex w-full items-center justify-between py-8 text-left focus:outline-none group"
      >
        <span className="text-sm md:text-base font-medium uppercase tracking-wide pr-6 group-hover:text-primary transition-colors">
          {faq.question}
        </span>
        <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-gray-300 transition-colors group-hover:border-primary">
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
