import { createClient } from "@/utils/supabase/client";
import { createBrowserClient } from "@supabase/ssr";
import { HomepageImage } from "@/types/homepage";

export const getSupabasePublic = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

export async function getHomepageImages(): Promise<HomepageImage[]> {
  const supabase = getSupabasePublic();
  const { data, error } = await supabase
    .from("homepage_images")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(12);

  if (error) {
    console.error("Error fetching homepage images:", error);
    return [];
  }

  return data || [];
}

export async function addHomepageImage(url: string, altText?: string) {
  const supabase = getSupabasePublic();
  const { data: lastImage } = await supabase
    .from("homepage_images")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1)
    .single();

  const nextOrder = (lastImage?.display_order || 0) + 1;

  const { data: newImage, error: insertError } = await supabase
    .from("homepage_images")
    .insert([{ url, alt_text: altText, display_order: nextOrder }])
    .select()
    .single();

  if (insertError) {
    throw insertError;
  }
  return newImage;
}

export async function deleteHomepageImage(id: string) {
  const supabase = getSupabasePublic();
  const { error } = await supabase
    .from("homepage_images")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}

export async function updateHomepageImageOrder(
  items: { id: string; display_order: number }[],
) {
  const supabase = getSupabasePublic();

  const updates = items.map((item) =>
    supabase
      .from("homepage_images")
      .update({ display_order: item.display_order })
      .eq("id", item.id),
  );

  await Promise.all(updates);
}
