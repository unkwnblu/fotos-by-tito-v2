"use client";

import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Left Content Side (Form) */}
      <div className="flex flex-1 flex-col justify-center px-8 py-12 sm:px-12 lg:w-1/2 lg:flex-none lg:px-20 xl:px-24 bg-background overflow-y-auto">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-10">
            <Link
              href="/"
              className="text-2xl font-serif font-bold tracking-tight"
            >
              FotosByTito
            </Link>
          </div>
          {children}
        </div>
      </div>

      {/* Right Image Side */}
      <div className="relative hidden w-0 flex-1 lg:block p-6">
        <div className="relative h-full w-full overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-neutral-900/10 mix-blend-multiply z-10" />
          <Image
            className="absolute inset-0 h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2070&auto=format&fit=crop"
            alt="Photography Background"
            fill
            priority
          />
          <div className="absolute bottom-10 left-10 right-10 z-20 text-white">
            <blockquote className="space-y-2">
              <p className="text-lg font-serif italic">
                "Photography is the story I fail to put into words."
              </p>
              <footer className="text-sm font-medium tracking-wider uppercase opacity-80">
                — Destin Sparks
              </footer>
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  );
}
