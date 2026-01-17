import { getTestimonials } from "./actions";
import { TestimonialManager } from "@/components/admin/testimonial-manager";

export const revalidate = 0; // Dynamic

export default async function AdminTestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-serif font-bold">Testimonials</h1>
        <p className="text-muted-foreground">
          Manage client feedback and reviews.
        </p>
      </div>

      <TestimonialManager initialData={testimonials || []} />
    </div>
  );
}
