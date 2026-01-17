"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export type PhotoData = {
  url: string;
  storage_path: string;
  category_id: string;
};

export async function savePhotoMetadata(photos: PhotoData[]) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  if (!photos || photos.length === 0) {
    return { success: false, error: "No photos to save" };
  }

  const { error } = await supabase.from("photos").insert(photos);

  if (error) {
    console.error("Error inserting photos:", error);
    return {
      success: false,
      error: `Database insert failed: ${error.message}`,
    };
  }

  revalidatePath("/admin");
  revalidatePath("/portfolio");
  revalidatePath("/");

  return {
    success: true,
    message: `Successfully saved ${photos.length} photo${
      photos.length > 1 ? "s" : ""
    }!`,
  };
}

export async function deletePhoto(id: string, storagePath: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  // 1. Delete from Storage
  const { error: storageError } = await supabase.storage
    .from("photos")
    .remove([storagePath]);

  if (storageError) {
    console.error("Error removing file:", storageError);
    // We'll continue to try deleting the DB record even if storage fails (orphan cleanup)
    // OR return error? Usually better to fail safe.
    return {
      success: false,
      error: `Storage removal failed: ${storageError.message}`,
    };
  }

  // 2. Delete from DB
  const { error: dbError } = await supabase
    .from("photos")
    .delete()
    .eq("id", id);

  if (dbError) {
    console.error("Error removing record:", dbError);
    return {
      success: false,
      error: `Database removal failed: ${dbError.message}`,
    };
  }

  revalidatePath("/admin/photos");
  revalidatePath("/portfolio");
  revalidatePath("/");

  // ... existing code ...
  return { success: true, message: "Photo deleted successfully" };
}

export async function deletePhotos(
  items: { id: string; storagePath: string }[]
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  if (!items || items.length === 0) {
    return { success: false, error: "No items selected" };
  }

  const paths = items.map((i) => i.storagePath);
  const ids = items.map((i) => i.id);

  // 1. Delete from Storage
  const { error: storageError } = await supabase.storage
    .from("photos")
    .remove(paths);

  if (storageError) {
    console.error("Error removing files:", storageError);
    // Continue nicely or fail? Let's try to delete DB records anyway or at least warn.
    // For now we assume if storage fails we return error, but it might be partial.
    return {
      success: false,
      error: `Storage batch removal failed: ${storageError.message}`,
    };
  }

  // 2. Delete from DB
  const { error: dbError } = await supabase
    .from("photos")
    .delete()
    .in("id", ids);

  if (dbError) {
    console.error("Error removing records:", dbError);
    return {
      success: false,
      error: `Database batch removal failed: ${dbError.message}`,
    };
  }

  revalidatePath("/admin/photos");
  revalidatePath("/portfolio");
  return {
    success: true,
    message: `Successfully deleted ${items.length} photos`,
  };
}

export async function createCategory(id: string, title: string) {
  const supabase = await createClient();

  // Basic validation
  // Slug should be lowercase, no spaces (or replace spaces with dashes)
  const slug = id.toLowerCase().trim().replace(/\s+/g, "-");

  if (!slug || !title) {
    return { success: false, error: "ID and Title are required" };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("categories")
    .insert({ id: slug, title });

  if (error) {
    console.error("Error creating category:", error);
    if (error.code === "23505") {
      // Unique violation
      return { success: false, error: "Category ID already exists" };
    }
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/admin");
  revalidatePath("/portfolio");

  return { success: true, message: "Category created successfully" };
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  // Check for existing photos
  const { count, error: countError } = await supabase
    .from("photos")
    .select("*", { count: "exact", head: true })
    .eq("category_id", id);

  if (countError) {
    return { success: false, error: "Failed to check for existing photos" };
  }

  if (count && count > 0) {
    return {
      success: false,
      error: `Cannot delete category. It contains ${count} photos. Please delete them first.`,
    };
  }

  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/admin");
  revalidatePath("/portfolio");

  return { success: true, message: "Category deleted successfully" };
}
