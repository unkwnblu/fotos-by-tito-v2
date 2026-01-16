"use client";

import { useState } from "react";
import Image from "next/image";
import { Send } from "lucide-react";
import { Footer } from "@/components/footer";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/scroll-reveal";
import Img from "../../public/contact.jpg";

export default function ContactPage() {
  const [selectedSubject, setSelectedSubject] = useState("General Inquiry");

  const subjects = [
    "General Inquiry",
    "Portrait Session",
    "Event Coverage",
    "Commercial Project",
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-12">
      <div className="container mx-auto px-4 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-32">
          {/* LEFT: Abstract Image */}
          <ScrollReveal
            direction="right"
            className="relative w-full aspect-[4/5] lg:aspect-auto lg:h-full lg:min-h-[800px] overflow-hidden rounded-sm  p-2"
          >
            <div className="relative w-full h-full overflow-hidden">
              <Image
                src={Img}
                alt="Abstract Art"
                fill
                className="object-cover rounded-xl"
              />
            </div>
          </ScrollReveal>

          {/* RIGHT: Contact Form */}
          <ScrollReveal
            direction="left"
            className="flex flex-col justify-center py-8"
          >
            <form className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="John"
                    className="w-full border-b border-border bg-transparent pb-2 outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/30"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Doe"
                    className="w-full border-b border-border bg-transparent pb-2 outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full border-b border-border bg-transparent pb-2 outline-none focus:border-foreground transition-colors"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 012 3456 789"
                    className="w-full border-b border-border bg-transparent pb-2 outline-none focus:border-foreground transition-colors placeholder:text-foreground"
                  />
                </div>
              </div>

              {/* Radio Group */}
              <div className="space-y-6">
                <label className="text-sm font-bold text-foreground">
                  Select Subject?
                </label>
                <div className="flex flex-wrap gap-6">
                  {subjects.map((subject, i) => (
                    <label
                      key={i}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <div
                        className={cn(
                          "h-4 w-4 rounded-full border border-muted-foreground flex items-center justify-center transition-colors",
                          selectedSubject === subject
                            ? "bg-foreground border-foreground"
                            : "group-hover:border-foreground"
                        )}
                      >
                        {selectedSubject === subject && (
                          <div className="h-1.5 w-1.5 bg-background rounded-full" />
                        )}
                      </div>
                      <span
                        className={cn(
                          "text-xs font-medium text-muted-foreground transition-colors",
                          selectedSubject === subject
                            ? "text-foreground"
                            : "group-hover:text-foreground"
                        )}
                      >
                        {subject}
                      </span>
                      <input
                        type="radio"
                        name="subject"
                        value={subject}
                        className="hidden"
                        checked={selectedSubject === subject}
                        onChange={() => setSelectedSubject(subject)}
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Message
                </label>
                <textarea
                  placeholder="Write your message.."
                  rows={1}
                  className="w-full border-b border-border bg-transparent pb-2 outline-none focus:border-foreground transition-colors resize-none placeholder:text-muted-foreground"
                />
              </div>

              <div className="flex justify-end pt-8">
                <button className="bg-emerald-950 dark:bg-emerald-600 text-white px-8 py-4 rounded-md text-sm font-medium tracking-wide hover:bg-emerald-900 transition-colors shadow-lg">
                  Send Message
                </button>
              </div>
            </form>
          </ScrollReveal>
        </div>

        {/* BOTTOM: Instagram Section */}
        <Footer />
      </div>
    </div>
  );
}
