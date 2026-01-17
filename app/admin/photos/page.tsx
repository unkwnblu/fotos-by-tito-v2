import { createClient } from "@/utils/supabase/server";
import { PhotoManager } from "@/components/admin/photo-manager";

// We need to fetch all records.
// IMPORTANT: We need all records, not just a limit.
async function getAllAdminPhotos() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: categories, error: catError } = await supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: true });

  if (error || catError) {
    console.error("Error fetching data:", error || catError);
    return { photos: [], categories: [] };
  }

  return { photos: data || [], categories: categories || [] };
}

export default async function AdminPhotosPage() {
  const { photos, categories } = await getAllAdminPhotos();

  // Group by category
  const groupedPhotos: Record<string, any[]> = {};

  photos.forEach((photo) => {
    if (!groupedPhotos[photo.category_id]) {
      groupedPhotos[photo.category_id] = [];
    }
    groupedPhotos[photo.category_id].push(photo);
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Photo Management</h1>
        <p className="text-muted-foreground">
          View and manage photos across all categories.
        </p>
      </div>

      <PhotoManager groupedPhotos={groupedPhotos} categories={categories} />
    </div>
  );
}
