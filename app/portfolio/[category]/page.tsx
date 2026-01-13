"use client";

import { useParams } from "next/navigation";
import { categories } from "@/lib/data";
import { PhotoGrid } from "@/components/photo-grid";

import { PortfolioEndCap } from "@/components/portfolio-end-cap";
import { PhotoItem } from "@/components/photo-grid";

export default function CategoryPage() {
  const params = useParams();
  const categoryId = params.category as string;
  const category = categories.find((c) => c.id === categoryId);

  if (!category) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <h1 className="text-2xl font-bold">Category not found</h1>
      </div>
    );
  }

  // Transform simple image URLs into PhotoItems with random spans
  const gridPhotos: PhotoItem[] = [];
  const spans = [
    "col-span-1 lg:col-span-2 lg:row-span-2", // 0: Large
    "col-span-1 lg:col-span-1 lg:row-span-1", // 1: Small
    "col-span-2 lg:col-span-1 lg:row-span-1", // 2: Wide
    "col-span-1 lg:col-span-1 lg:row-span-2", // 3: Tall
    "col-span-1 lg:col-span-1 lg:row-span-1", // 4: Small
    "col-span-2 lg:col-span-2 lg:row-span-1", // 5: Wide & Tall-ish
  ];

  category.images.forEach((src, i) => {
    // Add the photo
    gridPhotos.push({
      src,
      alt: `${category.title} photo ${i + 1}`,
      className: spans[i % spans.length],
      type: "photo",
    });

    // Inject Soft Break every 12 images
    if ((i + 1) % 12 === 0) {
      gridPhotos.push({
        className: "col-span-full", // This will be overridden or used by PhotoGrid logic
        type: "cta",
        ctaContent: {
          title: "Interested in a session like this?",
          buttonText: "View pricing",
          href: "/pricing",
        },
      });
    }
  });

  return (
    <div className="container mx-auto px-4 py-8 md:px-8">
      <header className="mb-12 text-center">
        <h1 className="text-3xl font-serif font-medium tracking-wide text-emerald-900 dark:text-emerald-500 uppercase md:text-5xl">
          {category.title}
        </h1>
        <p className="mt-4 text-muted-foreground">
          Explore our collection of {category.title.toLowerCase()}
        </p>
      </header>

      {/* Photo Grid with Soft Breaks */}
      <PhotoGrid photos={gridPhotos} />

      {/* Global End Cap */}
      <PortfolioEndCap />
    </div>
  );
}
