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
import { getHomepageImages } from "@/lib/homepage";
import { getPhotosForEachCategory } from "@/lib/photos";
import { getTestimonials } from "@/lib/testimonials";

export default async function Home() {
  // Fetch homepage images
  const photos = await getHomepageImages();

  // Fetch categories for the "Explore the work" section (thumbnails)
  const allCategories = await getPhotosForEachCategory(1);

  // Filter and Sort: Portraits, Family, Newborns (Top 3)
  const featuredSlugs = ["portraits", "family-milestones", "newborns"];
  const categories = featuredSlugs
    .map((slug) => allCategories.find((c) => c.id === slug))
    .filter((c) => c !== undefined);

  // Transform to PhotoItem for the grid
  const gridPhotos: PhotoItem[] = photos.map((photo) => ({
    src: photo.url,
    alt: photo.alt_text || "Portfolio Item",
    className: "aspect-square", // Force 1:1 aspect ratio
    type: "photo",
  }));

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
