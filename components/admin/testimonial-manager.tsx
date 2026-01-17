"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Trash2, Plus, Star, User, Loader2 } from "lucide-react";
import {
  createTestimonial,
  deleteTestimonial,
} from "@/app/admin/testimonials/actions";
import { toast } from "sonner";
import { Modal } from "@/components/ui/modal";
import Image from "next/image";

interface Testimonial {
  id: string;
  created_at: string;
  name: string;
  location: string;
  text: string;
  rating: number;
  image_url?: string;
}

export function TestimonialManager({
  initialData,
}: {
  initialData: Testimonial[];
}) {
  const [data, setData] = useState<Testimonial[]>(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;

    setData((prev) => prev.filter((t) => t.id !== id));
    toast.success("Testimonial deleted");

    const result = await deleteTestimonial(id);
    if (result.error) {
      toast.error(result.error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const result = await createTestimonial(formData);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Testimonial created");
      setIsModalOpen(false);
      // Ideally re-fetch or rely on revalidatePath -> router.refresh,
      // but simplistic reload for now or optimistic if we returned the new obj
      window.location.reload();
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((item) => (
          <div
            key={item.id}
            className="bg-card border rounded-xl overflow-hidden shadow-sm flex flex-col"
          >
            <div className="p-6 flex-1">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {item.image_url ? (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden">
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <User className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold">{item.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {item.location}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-muted-foreground hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex text-yellow-500 mb-3">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-yellow-500" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground italic line-clamp-4">
                "{item.text}"
              </p>
            </div>
            <div className="px-6 py-3 bg-muted/30 border-t text-xs text-muted-foreground">
              Added {format(new Date(item.created_at), "MMM d, yyyy")}
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Testimonial"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <input
                name="name"
                required
                className="w-full border rounded-md px-3 py-2 bg-background"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <input
                name="location"
                required
                placeholder="e.g. USA, NY"
                className="w-full border rounded-md px-3 py-2 bg-background"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Rating (1-5)</label>
            <select
              name="rating"
              className="w-full border rounded-md px-3 py-2 bg-background"
            >
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Review Text</label>
            <textarea
              name="text"
              required
              rows={4}
              className="w-full border rounded-md px-3 py-2 bg-background"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Profile Photo</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              className="w-full text-sm"
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              disabled={isSubmitting}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Testimonial
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
