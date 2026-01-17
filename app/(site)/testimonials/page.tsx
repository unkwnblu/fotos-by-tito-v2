import { getTestimonials } from "@/app/admin/testimonials/actions";
import { TestimonialsClient } from "@/components/testimonials-client";

export const revalidate = 0;

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();

  // If no testimonials, we pass an empty array.
  // The client component handles empty states or defaults if needed.

  return <TestimonialsClient testimonials={testimonials || []} />;
}
