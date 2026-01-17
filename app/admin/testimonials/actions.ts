"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getTestimonials() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching testimonials:", error);
    return [];
  }

  return data;
}

export async function createTestimonial(formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const location = formData.get("location") as string;
  const text = formData.get("text") as string;
  const rating = parseInt(formData.get("rating") as string);
  const imageFile = formData.get("image") as File;

  let image_url = "";

  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split(".").pop();
    const fileName = `testimonial-${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from("photos")
      .upload(`testimonials/${fileName}`, imageFile);

    if (uploadError) {
      return { error: "Failed to upload image" };
    }

    const { data: publicUrlData } = supabase.storage
      .from("photos")
      .getPublicUrl(`testimonials/${fileName}`);

    image_url = publicUrlData.publicUrl;
  }

  const { error } = await supabase.from("testimonials").insert({
    name,
    location,
    text,
    rating,
    image_url,
  });

  if (error) {
    return { error: "Failed to create testimonial" };
  }

  revalidatePath("/admin/testimonials");
  revalidatePath("/testimonials"); // Public page
  return { success: true };
}

export async function deleteTestimonial(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("testimonials").delete().eq("id", id);

  if (error) {
    return { error: "Failed to delete testimonial" };
  }

  revalidatePath("/admin/testimonials");
  revalidatePath("/testimonials");
  return { success: true };
}
