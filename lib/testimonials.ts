import { createClient } from "@/utils/supabase/server";

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  text: string;
  rating: number;
  image_url?: string;
}

export async function getTestimonials(limit: number = 3) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching testimonials:", error);
    return [];
  }

  return data as Testimonial[];
}
