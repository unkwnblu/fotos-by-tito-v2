"use client";

// Force rebuild

import { useState } from "react";
import { Plus, Trash2, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { createCategory, deleteCategory } from "@/app/admin/actions";
import { Modal } from "@/components/ui/modal";
import { motion, AnimatePresence } from "framer-motion";

interface Category {
  id: string;
  title: string;
  count?: number; // Optional photo count if we fetch it
}

export function CategoryManager({ categories }: { categories: Category[] }) {
  const [isCreating, setIsCreating] = useState(false);
  const [newCategory, setNewCategory] = useState({ id: "", title: "" });
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    isDestructive?: boolean;
  }>({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {},
  });

  const handleCreate = async () => {
    if (!newCategory.title) {
      toast.error("Title is required");
      return;
    }
    // Auto-generate ID if empty from title
    const idToUse =
      newCategory.id || newCategory.title.toLowerCase().replace(/\s+/g, "-");

    setIsCreating(true);
    try {
      const res = await createCategory(idToUse, newCategory.title);
      if (res.success) {
        toast.success(res.message);
        setNewCategory({ id: "", title: "" });
      } else {
        toast.error(res.error);
      }
    } catch (e) {
      toast.error("Failed to create category");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    setModalConfig({ ...modalConfig, isOpen: false });
    // We can add a loading state for specific item if needed, but for now global toast is fine
    try {
      const res = await deleteCategory(id);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.error);
      }
    } catch (e) {
      toast.error("Failed to delete category");
    }
  };

  const promptDelete = (cat: Category) => {
    setModalConfig({
      isOpen: true,
      title: "Delete Category?",
      description: `Are you sure you want to delete "${cat.title}"? This is only possible if the category is empty.`,
      isDestructive: true,
      onConfirm: () => handleDelete(cat.id),
    });
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Existing Categories</h2>
        <div className="bg-card border rounded-lg divide-y">
          {categories.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No categories found.
            </div>
          ) : (
            categories.map((cat) => (
              <div
                key={cat.id}
                className="p-4 flex items-center justify-between group"
              >
                <div>
                  <p className="font-medium">{cat.title}</p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {cat.id}
                  </p>
                </div>
                <button
                  onClick={() => promptDelete(cat)}
                  className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                  title="Delete Category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create Form */}
      <div className="space-y-4">
        <div className="bg-muted/30 border rounded-lg p-6 sticky top-6">
          <h2 className="text-xl font-semibold mb-4">Add New Category</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Title</label>
              <input
                type="text"
                value={newCategory.title}
                onChange={(e) => {
                  const title = e.target.value;
                  // Auto-slugify
                  const slug = title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-+|-+$/g, "");
                  setNewCategory({ title, id: slug });
                }}
                placeholder="e.g. Weddings"
                className="w-full px-3 py-2 rounded-md border bg-background focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Slug (ID)
              </label>
              <input
                type="text"
                value={newCategory.id}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, id: e.target.value })
                }
                placeholder="weddings"
                className="w-full px-3 py-2 rounded-md border bg-background font-mono text-sm focus:ring-2 focus:ring-primary/20 outline-none"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Unique identifier used in URLs.
              </p>
            </div>
            <button
              onClick={handleCreate}
              disabled={isCreating || !newCategory.title}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isCreating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              Create Category
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        title={modalConfig.title}
        description={modalConfig.description}
      >
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setModalConfig({ ...modalConfig, isOpen: false })}
            className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={modalConfig.onConfirm}
            className={`px-4 py-2 text-sm font-bold text-white rounded-md transition-colors ${
              modalConfig.isDestructive
                ? "bg-red-600 hover:bg-red-700"
                : "bg-primary hover:bg-primary/90"
            }`}
          >
            Confirm
          </button>
        </div>
      </Modal>
    </div>
  );
}
