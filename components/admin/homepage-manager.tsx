"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Trash2, Upload, Loader2, GripVertical } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { HomepageImage } from "@/types/homepage";
import {
  addHomepageImage,
  deleteHomepageImage,
  updateHomepageImageOrder,
} from "@/lib/homepage";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableImageProps {
  image: HomepageImage;
  onDelete: (id: string, url: string) => void;
  isDeleting: string | null;
}

const SortableImage = ({ image, onDelete, isDeleting }: SortableImageProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group aspect-square rounded-lg overflow-hidden border bg-muted select-none ${
        isDragging ? "shadow-xl ring-2 ring-primary" : ""
      }`}
    >
      <Image
        src={image.url}
        alt={image.alt_text || "Homepage Image"}
        fill
        className="object-cover pointer-events-none"
      />
      {/* Controls Overlay */}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        <div
          className="cursor-move bg-white/10 text-white p-2 rounded-full hover:bg-white/20 transition-colors touch-none"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </div>

        <button
          onClick={() => onDelete(image.id, image.url)}
          disabled={isDeleting === image.id}
          className="bg-destructive text-destructive-foreground p-2 rounded-full hover:bg-destructive/90 transition-colors"
          onPointerDown={(e) => e.stopPropagation()}
        >
          {isDeleting === image.id ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
};

interface HomepageManagerProps {
  initialImages: HomepageImage[];
}

export function HomepageManager({ initialImages }: HomepageManagerProps) {
  const [images, setImages] = useState<HomepageImage[]>(initialImages);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();
  const MAX_IMAGES = 12;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files);

    if (images.length + files.length > MAX_IMAGES) {
      alert(
        `You can only have a maximum of ${MAX_IMAGES} images directly on the homepage grid. You currently have ${images.length} and are trying to upload ${files.length}.`,
      );
      e.target.value = "";
      return;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      const newImages: (HomepageImage | null)[] = [];
      const totalFiles = files.length;

      for (let i = 0; i < totalFiles; i++) {
        const file = files[i];
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `homepage/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("photos")
          .upload(filePath, file);

        if (uploadError) {
          console.error(`Error uploading ${file.name}:`, uploadError);
          continue;
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("photos").getPublicUrl(filePath);

        const newImage = await addHomepageImage(
          publicUrl,
          "Homepage Grid Image",
        );
        newImages.push(newImage);

        // Update progress
        setProgress(Math.round(((i + 1) / totalFiles) * 100));
      }

      const validNewImages = newImages.filter(
        (img): img is HomepageImage => img !== null,
      );

      if (validNewImages.length > 0) {
        setImages((prev) => [...validNewImages, ...prev]);
        router.refresh();
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Failed to upload one or more images");
    } finally {
      setIsUploading(false);
      setProgress(0);
      // Reset file input
      e.target.value = "";
    }
  };

  const handleDelete = async (id: string, url: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    setIsDeleting(id);
    try {
      await deleteHomepageImage(id);
      setImages((prev) => prev.filter((img) => img.id !== id));
      router.refresh();
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = images.findIndex((img) => img.id === active.id);
      const newIndex = images.findIndex((img) => img.id === over?.id);

      const newOrder = arrayMove(images, oldIndex, newIndex);
      setImages(newOrder);

      // Save to server
      const updates = newOrder.map((img, index) => ({
        id: img.id,
        display_order: index,
      }));

      try {
        await updateHomepageImageOrder(updates);
      } catch (error) {
        console.error("Failed to save order:", error);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <label className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 w-fit">
          {isUploading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Upload className="mr-2 h-4 w-4" />
          )}
          Upload New Images (Max 12 Total)
          <input
            type="file"
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            disabled={isUploading}
          />
        </label>

        {isUploading && (
          <div className="w-full max-w-xs space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Uploading...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={images.map((img) => img.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {images.map((image) => (
              <SortableImage
                key={image.id}
                image={image}
                onDelete={handleDelete}
                isDeleting={isDeleting}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {images.length === 0 && (
        <div className="col-span-full text-center py-10 text-muted-foreground">
          No images found. Upload one to get started.
        </div>
      )}
    </div>
  );
}
