"use client";

import Link from "next/link";
import { Instagram, ArrowRight } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#2d5d4b] text-white pt-5 pb-10 rounded-xl">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8 mb-20 justify-items-center md:justify-items-stretch">
          {/* Instagram */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-xl font-bold mb-4 font-serif text-white">
              Instagram
            </h3>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-white/80 transition-colors group"
            >
              <Instagram size={24} />
              <span>@fotosbytito</span>
              <ArrowRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
            </a>
            <div className="grid grid-cols-3 gap-2 mt-2 max-w-[200px]">
              {/* Placeholders for IG Feed */}
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-gray-800 rounded-md"
                ></div>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <div className="flex flex-col items-center md:items-end text-center md:text-right">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
              Ready to create <br /> something beautiful?
            </h3>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white hover:bg-white/90 text-[#2d5d4b] px-6 py-3 rounded-full font-bold uppercase tracking-wider transition-colors"
            >
              Book your session
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
