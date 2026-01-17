// import { categories } from "@/lib/data"; // Removed
import { PhotoGrid, PhotoItem } from "@/components/photo-grid";
import { PortfolioEndCap } from "@/components/portfolio-end-cap";
import { getPhotosByCategory, getCategory } from "@/lib/photos";

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

  if (photos.length === 0) {
    // Fallback or Empty State
    // If user wants NO UNSPLASH, we show empty state or just empty grid.
    // Let's show empty message for now to be clear.
  } else {
    photos.forEach((photo: any, i: number) => {
      // Add the photo
      gridPhotos.push({
        src: photo.url,
        alt: `${category.title} photo ${i + 1}`,
        className: spans[i % spans.length],
        type: "photo",
      });

      // Inject Soft Break every 12 images
      if ((i + 1) % 12 === 0) {
        gridPhotos.push({
          className: "col-span-full",
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

  return (
    <div className="container mx-auto px-4 py-8 md:px-8">
      <header className="mb-12 text-center">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[#2d5d4b] uppercase">
          {category.title}
        </h1>
        <p className="mt-4 text-muted-foreground">
          Explore our collection of {category.title.toLowerCase()}
        </p>
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
