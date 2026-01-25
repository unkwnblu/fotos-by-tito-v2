import { HomepageManager } from "@/components/admin/homepage-manager";
import { getHomepageImages } from "@/lib/homepage";

export default async function AdminHomepagePage() {
  const images = await getHomepageImages();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Homepage Grid</h1>
        <p className="text-muted-foreground">
          Manage the images displayed on the homepage grid interactively.
        </p>
      </div>

      <HomepageManager initialImages={images} />
    </div>
  );
}
