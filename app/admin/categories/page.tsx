import { createClient } from "@/utils/supabase/server";
import { CategoryManager } from "@/components/admin/category-manager";

async function getCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
  return data || [];
}

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Category Management
        </h1>
        <p className="text-muted-foreground">
          Add new portfolio categories or remove empty ones.
        </p>
      </div>

      <CategoryManager categories={categories} />
    </div>
  );
}
