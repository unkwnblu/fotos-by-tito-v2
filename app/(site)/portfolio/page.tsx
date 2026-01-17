import { PortfolioHero } from "@/components/portfolio-hero";
import { PortfolioCategories } from "@/components/portfolio-categories";
import { PortfolioFooter } from "@/components/portfolio-footer";
import { getPhotosForEachCategory } from "@/lib/photos";
import * as motion from "framer-motion/client";
import { fadeInUp } from "@/lib/animations";

export default async function PortfolioPage() {
  const dynamicCategories = await getPhotosForEachCategory(5); // Fetch a few to ensure we have a hero image

  // Extract one "Hero" image from each category
  const heroImages = dynamicCategories
    .map((cat) => cat.images[0])
    .filter((img): img is string => !!img);

  return (
    <div className="min-h-screen">
      <PortfolioHero images={heroImages} />

      <div className="container mx-auto px-4 py-2">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px" }}
        >
          <PortfolioCategories categories={dynamicCategories} />
        </motion.div>
      </div>

      <PortfolioFooter />
    </div>
  );
}
