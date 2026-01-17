import { getPhotosByCategory } from "@/lib/photos";
import { pricingData } from "@/lib/pricing-data";
import { PricingCategoryContent } from "@/components/pricing/pricing-category-content";
import Link from "next/link";

export const revalidate = 600; // Revalidate every 10 minutes

export async function generateStaticParams() {
  return [
    { category: "family-maternity" },
    { category: "newborn" },
    { category: "portraits-headshots" },
  ];
}

interface PageProps {
  params: Promise<{ category: string }>;
}

export default async function PricingCategoryPage({ params }: PageProps) {
  const { category } = await params;
  const data = pricingData[category];

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Category not found</h1>
          <Link href="/pricing" className="text-primary hover:underline">
            Go Back
          </Link>
        </div>
      </div>
    );
  }

  // Map URL category slug to Database category ID
  let dbCategoryId = "";
  if (category === "family-maternity") dbCategoryId = "family-milestones";
  if (category === "newborn") dbCategoryId = "newborns";
  if (category === "portraits-headshots") dbCategoryId = "portraits";

  // Fetch one photo for this category
  const photos = await getPhotosByCategory(dbCategoryId);
  const dynamicImage = photos && photos.length > 0 ? photos[0].url : undefined;

  return (
    <PricingCategoryContent
      data={data}
      dynamicImage={dynamicImage}
      categoryId={category}
    />
  );
}
