import { PhotoGrid, PhotoItem } from "@/components/photo-grid";
import { PortfolioEndCap } from "@/components/portfolio-end-cap";
import { getPhotosByCategory, getCategory } from "@/lib/photos";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { categories as staticCategories } from "@/lib/data";

interface PageProps {
  params: Promise<{
    category: string;
  }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const resolvedParams = await params;
  const categoryId = resolvedParams.category;

  // Fetch from DB
  const category = await getCategory(categoryId);

  if (!category) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <h1 className="text-2xl font-bold">Category not found</h1>
        <p className="ml-4 text-muted-foreground">
          It might have been deleted or doesn't exist.
        </p>
      </div>
    );
  }

  const photos = await getPhotosByCategory(categoryId);

  // Transform simple image URLs into PhotoItems for the grid
  const gridPhotos: PhotoItem[] = [];

  if (photos.length === 0) {
    // Fallback or Empty State
  } else {
    photos.forEach((photo: any, i: number) => {
      // Add the photo
      gridPhotos.push({
        src: photo.url,
        alt: `${category.title} photo ${i + 1}`,
        className: "aspect-square", // Force 1:1 aspect ratio
        type: "photo",
      });

      // Inject Soft Break every 12 images
      if ((i + 1) % 12 === 0) {
        gridPhotos.push({
          className: "col-span-full aspect-auto py-12", // Let it take natural height
          type: "cta",
          ctaContent: {
            title: "Interested in a session like this?",
            buttonText: "View pricing",
            href: "/pricing",
          },
        });
      }
    });
  }

  // Look up static description
  const staticData = staticCategories.find((c) => c.id === categoryId);
  const description =
    staticData?.description ||
    `Explore our collection of ${category.title.toLowerCase()}`;

  return (
    <div className="container mx-auto px-4 py-8 md:px-8">
      <div className="mb-8">
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Portfolio
        </Link>
      </div>

      <header className="mb-12 text-center">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[#2d5d4b] uppercase">
          {category.title}
        </h1>
        <p className="mt-4 text-muted-foreground">{description}</p>
      </header>

      {/* Photo Grid with Soft Breaks */}
      {gridPhotos.length > 0 ? (
        <PhotoGrid photos={gridPhotos} />
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          <p>No photos uploaded yet for this category.</p>
        </div>
      )}

      {/* Global End Cap */}
      <PortfolioEndCap />
    </div>
  );
}
