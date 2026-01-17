import { Faq } from "@/components/faq";
import { PhotoGrid, PhotoItem } from "@/components/photo-grid";
import { EnquiryBanner } from "@/components/enquiry-banner";
import { About } from "@/components/about";
import Link from "next/link";
import { WhyWorkWithMe } from "@/components/why-work-with-me";
import { WorkCategories } from "@/components/work-categories";
import { Testimonials } from "@/components/testimonials";
import { Footer } from "@/components/footer";
import { ScrollReveal } from "@/components/scroll-reveal";
import { getAllPhotos, getPhotosForEachCategory } from "@/lib/photos";
import { getTestimonials } from "@/lib/testimonials";

export default async function Home() {
  // Fetch up to 18 photos (3 full blocks of 6)
  let photos = await getAllPhotos(18);

  // Fetch categories for the "Explore the work" section (thumbnails)
  const allCategories = await getPhotosForEachCategory(1);

  // Filter and Sort: Portraits, Family, Newborns (Top 3)
  const featuredSlugs = ["portraits", "family-milestones", "newborns"];
  const categories = featuredSlugs
    .map((slug) => allCategories.find((c) => c.id === slug))
    .filter((c) => c !== undefined);

  // Layout Logic:
  // The grid pattern repeats every 6 items (forming a perfect rectangle).
  // To avoid jagged edges or empty spaces, we trim the photos to the nearest multiple of 6.
  if (photos && photos.length >= 6) {
    const validCount = Math.floor(photos.length / 6) * 6;
    photos = photos.slice(0, validCount);
  }

  const gridPhotos: PhotoItem[] = [];
  const spans = [
    "col-span-2 row-span-2", // Big Square (Left)
    "col-span-2 row-span-1", // Wide (Right Top)
    "col-span-1 row-span-1", // Small (Right Middle 1)
    "col-span-1 row-span-1", // Small (Right Middle 2)
    "col-span-2 row-span-1", // Wide (Bottom Left)
    "col-span-2 row-span-1", // Wide (Bottom Right)
  ];

  if (photos && photos.length > 0) {
    photos.forEach((photo: any, i: number) => {
      gridPhotos.push({
        src: photo.url,
        className: spans[i % spans.length],
        alt: "Portfolio Item",
        type: "photo",
      });
    });
  }

  // Fetch Testimonials
  const testimonials = await getTestimonials(3);

  return (
    <div className="min-h-screen bg-background">
      {/* Photo Grid */}
      <ScrollReveal>
        {gridPhotos.length > 0 ? (
          <PhotoGrid photos={gridPhotos} />
        ) : (
          <div className="text-center py-20 text-muted-foreground bg-muted/20">
            <p>Gallery is waiting for your beautiful shots.</p>
          </div>
        )}
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <div className="flex justify-center -mt-4 mb-16">
          <Link
            href="/portfolio"
            className="bg-[#2d5d4b] text-white px-8 py-3 rounded-md font-bold uppercase tracking-widest hover:bg-[#1e3d32] transition-colors"
          >
            Explore Portfolio
          </Link>
        </div>
      </ScrollReveal>

      {/* Why Work With Me Section */}
      <ScrollReveal>
        <WhyWorkWithMe />
      </ScrollReveal>

      {/* About Section */}
      <ScrollReveal>
        <About />
      </ScrollReveal>

      {/* Explore the Work */}
      <ScrollReveal>
        <WorkCategories categories={categories} />
      </ScrollReveal>

      {/* Testimonials */}
      <ScrollReveal>
        <Testimonials testimonials={testimonials} />
      </ScrollReveal>

      {/* FAQ Section */}
      <ScrollReveal>
        <Faq />
      </ScrollReveal>

      {/* Footer */}
      <ScrollReveal>
        <Footer />
      </ScrollReveal>
    </div>
  );
}
