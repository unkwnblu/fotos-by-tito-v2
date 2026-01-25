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
  const { data, error } = await supabase
    .from("homepage_images")
    .insert([{ url, alt_text: altText }])
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data;
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
