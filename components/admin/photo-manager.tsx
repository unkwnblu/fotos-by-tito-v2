"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Trash2,
  AlertCircle,
  Loader2,
  CheckSquare,
  Square,
  X,
} from "lucide-react";
// import { categories } from "@/lib/data"; // Removed
import { deletePhoto, deletePhotos } from "@/app/admin/actions";
import { updatePhotoOrder } from "@/lib/photos";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Modal } from "@/components/ui/modal";
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
import { GripVertical } from "lucide-react";

interface Photo {
  id: string;
  url: string;
  storage_path: string;
  created_at: string;
}

interface PhotoManagerProps {
  categories: { id: string; title: string }[]; // Added prop
  // Map of categoryId -> Photos[]
  groupedPhotos: Record<string, Photo[]>;
}

interface SortablePhotoProps {
  photo: Photo;
  isSelectionMode: boolean;
  selectedIds: Set<string>;
  toggleSelection: (id: string) => void;
  promptSingleDelete: (photo: Photo) => void;
  deletingId: string | null;
}

const SortablePhoto = ({
  photo,
  isSelectionMode,
  selectedIds,
  toggleSelection,
  promptSingleDelete,
  deletingId,
}: SortablePhotoProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: photo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative aspect-square bg-muted rounded-lg overflow-hidden border shadow-sm cursor-pointer transition-all ${
        isSelectionMode && selectedIds.has(photo.id)
          ? "ring-2 ring-primary ring-offset-2"
          : ""
      } ${isDragging ? "shadow-xl ring-2 ring-primary" : ""}`}
      onClick={() => {
        if (isSelectionMode) toggleSelection(photo.id);
      }}
    >
      <Image
        src={photo.url}
        alt="Portfolio item"
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105 pointer-events-none"
      />

      {/* Selection Overlay */}
      {isSelectionMode && (
        <div
          className={`absolute top-2 left-2 z-10 rounded-sm bg-white/90 p-0.5 shadow-sm transition-colors ${
            selectedIds.has(photo.id) ? "text-primary" : "text-muted-foreground"
          }`}
        >
          {selectedIds.has(photo.id) ? (
            <CheckSquare className="w-5 h-5 fill-current" />
          ) : (
            <Square className="w-5 h-5" />
          )}
        </div>
      )}

      {/* Hover Actions (Only if not in selection mode) */}
      {!isSelectionMode && (
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          {/* Drag Handle */}
          <div
            className="cursor-move bg-white/10 text-white p-2 rounded-full hover:bg-white/20 transition-colors touch-none"
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="h-5 w-5" />
          </div>

          <button
            disabled={deletingId === photo.id}
            onClick={(e) => {
              e.stopPropagation();
              promptSingleDelete(photo);
            }}
            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
            title="Delete Photo"
          >
            {deletingId === photo.id ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Trash2 className="w-5 h-5" />
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export function PhotoManager({ groupedPhotos, categories }: PhotoManagerProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(categories[0]?.id || "");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Batch Selection State
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  // Modal State
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

  // Local state for photos to support optimistic reordering
  const [photosMap, setPhotosMap] =
    useState<Record<string, Photo[]>>(groupedPhotos);

  // Sync prop changes to local state
  useEffect(() => {
    setPhotosMap(groupedPhotos);
  }, [groupedPhotos]);

  const currentPhotos = photosMap[activeTab] || [];

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = currentPhotos.findIndex((p) => p.id === active.id);
      const newIndex = currentPhotos.findIndex((p) => p.id === over?.id);

      const newOrder = arrayMove(currentPhotos, oldIndex, newIndex);

      // Update local state
      setPhotosMap((prev) => ({
        ...prev,
        [activeTab]: newOrder,
      }));

      // Save to server
      const updates = newOrder.map((p, index) => ({
        id: p.id,
        display_order: index,
      }));

      try {
        await updatePhotoOrder(updates);
        router.refresh();
      } catch (error: any) {
        console.error("Failed to reorder:", error);
        toast.error(error.message || "Failed to save new order");
      }
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
    setIsSelectionMode(false);
  };

  const selectAll = () => {
    const newSelected = new Set(selectedIds);
    currentPhotos.forEach((p) => newSelected.add(p.id));
    setSelectedIds(newSelected);
  };

  const executeBatchDelete = async () => {
    setIsBulkDeleting(true);
    setModalConfig({ ...modalConfig, isOpen: false }); // Close modal immediately or keep open with loading state? Better allow toast to take over.

    try {
      const itemsToDelete: { id: string; storagePath: string }[] = [];

      Object.values(groupedPhotos)
        .flat()
        .forEach((photo) => {
          if (selectedIds.has(photo.id)) {
            itemsToDelete.push({
              id: photo.id,
              storagePath: photo.storage_path,
            });
          }
        });

      const res = await deletePhotos(itemsToDelete);

      if (res.success) {
        toast.success(res.message);
        setSelectedIds(new Set());
        setIsSelectionMode(false);
      } else {
        toast.error(res.error);
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to execute batch delete.");
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const promptBatchDelete = () => {
    if (selectedIds.size === 0) return;
    setModalConfig({
      isOpen: true,
      title: "Delete Photos?",
      description: `Are you sure you want to delete ${selectedIds.size} photos? This action cannot be undone.`,
      onConfirm: executeBatchDelete,
      isDestructive: true,
    });
  };

  const executeSingleDelete = async (photo: Photo) => {
    setModalConfig({ ...modalConfig, isOpen: false });
    setDeletingId(photo.id);

    try {
      const res = await deletePhoto(photo.id, photo.storage_path);
      if (res.success) {
        toast.success("Photo deleted successfully");
      } else {
        toast.error(res.error);
      }
    } catch (e) {
      toast.error("Failed to delete photo");
    } finally {
      setDeletingId(null);
    }
  };

  const promptSingleDelete = (photo: Photo) => {
    setModalConfig({
      isOpen: true,
      title: "Delete Photo?",
      description:
        "Are you sure you want to delete this photo? This action cannot be undone.",
      onConfirm: () => executeSingleDelete(photo),
      isDestructive: true,
    });
  };

  return (
    <>
      <div className="space-y-8">
        {/* Tabs & Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-2">
          <div className="flex overflow-x-auto gap-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === cat.id
                    ? "bg-primary text-primary-foreground border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {cat.title} ({groupedPhotos[cat.id]?.length || 0})
              </button>
            ))}
          </div>

          {/* Batch Actions Toolbar */}
          <div className="flex items-center gap-2">
            {isSelectionMode ? (
              <>
                <span className="text-sm font-medium mr-2">
                  {selectedIds.size} Selected
                </span>
                <button
                  onClick={selectAll}
                  className="text-xs text-primary hover:underline"
                >
                  Select All
                </button>
                <button
                  onClick={clearSelection}
                  className="text-xs text-muted-foreground hover:underline"
                >
                  Cancel
                </button>
                <button
                  onClick={promptBatchDelete}
                  disabled={isBulkDeleting || selectedIds.size === 0}
                  className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {isBulkDeleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Delete ({selectedIds.size})
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsSelectionMode(true)}
                className="flex items-center gap-2 px-3 py-1.5 border rounded-md text-sm hover:bg-muted transition-colors"
              >
                <CheckSquare className="w-4 h-4" />
                Select Photos
              </button>
            )}
          </div>
        </div>

        {/* Grid */}
        <div className="min-h-[400px]">
          {currentPhotos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground bg-muted/10 rounded-xl border border-dashed">
              <AlertCircle className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-lg font-medium">No records available</p>
              <p className="text-sm">
                There are no photos in this category yet.
              </p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={currentPhotos.map((p) => p.id)}
                strategy={rectSortingStrategy}
              >
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {currentPhotos.map((photo) => (
                    <SortablePhoto
                      key={photo.id}
                      photo={photo}
                      isSelectionMode={isSelectionMode}
                      selectedIds={selectedIds}
                      toggleSelection={toggleSelection}
                      promptSingleDelete={promptSingleDelete}
                      deletingId={deletingId}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
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
    </>
  );
}
