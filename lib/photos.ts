import { createClient } from "@/utils/supabase/client";
import { createBrowserClient } from "@supabase/ssr";
import { CategoryData } from "./data";

export const getSupabasePublic = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

// ... imports

export async function getCategory(id: string) {
  const supabase = getSupabasePublic();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error fetching category ${id}:`, error);
    return null;
  }
  return data;
}

export async function getPhotosByCategory(categoryId: string) {
  const supabase = getSupabasePublic();

  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .eq("category_id", categoryId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching photos:", error);
    return [];
  }

  return data;
}

export async function getAllPhotos(limit = 12) {
  const supabase = getSupabasePublic();

  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching photos:", error);
    return [];
  }

  return data;
}

// ... keep imports
// We don't import 'categories' from data anymore for logic, only type if needed.
// import { CategoryData } from "./data"; // Removed duplicate

// ... existing code ...

export async function getPhotosForEachCategory(
  limitPerCategory = 10
): Promise<CategoryData[]> {
  const supabase = getSupabasePublic();

  // 1. Fetch Categories from DB
  const { data: categories, error: catError } = await supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: true });

  if (catError || !categories) {
    console.error("Error fetching categories:", catError);
    return [];
  }

  // 2. Fetch photos for each category
  const promises = categories.map(async (cat: any) => {
    const { data: photos, error } = await supabase
      .from("photos")
      .select("url")
      .eq("category_id", cat.id)
      .order("created_at", { ascending: false })
      .limit(limitPerCategory);

    if (error) {
      console.error(`Error fetching for ${cat.id}:`, error);
      return { id: cat.id, title: cat.title, images: [] };
    }

    const imageUrls = photos.map((d) => d.url);
    return { id: cat.id, title: cat.title, images: imageUrls };
  });

  return Promise.all(promises);
}
