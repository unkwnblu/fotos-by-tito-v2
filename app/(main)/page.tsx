import { Faq } from "@/components/faq";
import { PhotoGrid } from "@/components/photo-grid";
import { EnquiryBanner } from "@/components/enquiry-banner";
import { About } from "@/components/about";
import Link from "next/link";
import { WhyWorkWithMe } from "@/components/why-work-with-me";
import { WorkCategories } from "@/components/work-categories";
import { Testimonials } from "@/components/testimonials";
import { Footer } from "@/components/footer";
import { ScrollReveal } from "@/components/scroll-reveal";

export default function Home() {
  return (
    <div className="min-h-screen bg-background p-2 sm:p-8">
      <ScrollReveal>
        <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tight text-center my-12 text-[#2d5d4b] leading-tight">
          Photography that feels like you <br />- honest warm, timeless
        </h2>
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

      {/* Photo Grid */}
      <ScrollReveal>
        <PhotoGrid />
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
        <WorkCategories />
      </ScrollReveal>

      {/* Testimonials */}
      <ScrollReveal>
        <Testimonials />
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
