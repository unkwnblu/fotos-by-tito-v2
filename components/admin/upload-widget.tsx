"use client";

import { useState, useEffect } from "react";
import { savePhotoMetadata, PhotoData } from "@/app/admin/actions";
import {
  Loader2,
  Upload,
  FileImage,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";

export function UploadWidget() {
  const [categories, setCategories] = useState<{ id: string; title: string }[]>(
    []
  );
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);

  const supabase = createClient();

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from("categories")
        .select("*")
        .order("created_at", { ascending: true });

      if (data) {
        setCategories(data);
        if (data.length > 0) setSelectedCategory(data[0].id);
      }
      setLoadingCategories(false);
    };
    fetchCategories();
  }, [supabase]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0 || !selectedCategory) return;

    setIsUploading(true);
    setStatusMessage(null);
    setProgress(0);
    setCurrentFileIndex(0);

    try {
      const uploadedPhotos: PhotoData[] = [];
      const errors: string[] = [];
      const totalFiles = selectedFiles.length;

      for (let i = 0; i < totalFiles; i++) {
        const file = selectedFiles[i];
        setCurrentFileIndex(i + 1);

        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(7)}.${fileExt}`;
        const filePath = `${selectedCategory}/${fileName}`;

        const { error } = await supabase.storage
          .from("photos")
          .upload(filePath, file);

        if (error) {
          errors.push(`${file.name} (${error.message})`);
          continue;
        }

        const { data: publicUrlData } = supabase.storage
          .from("photos")
          .getPublicUrl(filePath);

        uploadedPhotos.push({
          url: publicUrlData.publicUrl,
          storage_path: filePath,
          category_id: selectedCategory,
        });

        setProgress(Math.round(((i + 1) / totalFiles) * 100));
      }

      if (uploadedPhotos.length > 0) {
        await savePhotoMetadata(uploadedPhotos);
      }

      setStatusMessage({
        type: uploadedPhotos.length > 0 ? "success" : "error",
        text: `Uploaded ${uploadedPhotos.length} / ${totalFiles} photos.`,
      });

      if (uploadedPhotos.length > 0) {
        setSelectedFiles([]);
        setProgress(0);
      }
    } catch (error: any) {
      setStatusMessage({ type: "error", text: error.message });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-card border rounded-xl shadow-sm p-6 h-full flex flex-col">
      <div className="mb-6">
        <h3 className="font-serif font-bold text-lg">Quick Upload</h3>
        <p className="text-sm text-muted-foreground">
          Add new photos to your portfolio.
        </p>
      </div>

      <form onSubmit={handleUpload} className="space-y-6 flex-1 flex flex-col">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Category
          </label>
          <select
            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            disabled={loadingCategories}
          >
            {loadingCategories ? (
              <option>Loading...</option>
            ) : (
              categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.title}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="space-y-2 flex-1 flex flex-col">
          <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Files
          </label>
          <div
            className={`relative flex-1 flex flex-col items-center justify-center w-full min-h-[200px] border-2 border-dashed rounded-lg transition-colors ${
              dragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:bg-muted/50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center text-center p-4">
              <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
              <p className="text-sm text-muted-foreground font-medium">
                Drag & Drop or Click
              </p>
            </div>
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept="image/*"
              multiple
              onChange={handleChange}
              disabled={isUploading}
            />
          </div>
        </div>

        {/* Selected Files List (Compact) */}
        {selectedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-muted/20 rounded-md">
            {selectedFiles.map((file, idx) => (
              <div
                key={idx}
                className="relative group bg-background border px-2 py-1 rounded text-xs flex items-center gap-2"
              >
                <span className="truncate max-w-[100px]">{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(idx)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {isUploading && (
          <div className="w-full bg-muted rounded-full h-1 overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {statusMessage && (
          <div
            className={`p-3 rounded-md text-sm flex items-center gap-2 ${
              statusMessage.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {statusMessage.type === "success" ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            {statusMessage.text}
          </div>
        )}

        <button
          type="submit"
          disabled={isUploading || selectedFiles.length === 0}
          className="w-full bg-primary text-primary-foreground h-10 rounded-md font-medium disabled:opacity-50"
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 animate-spin mx-auto" />
          ) : (
            "Upload Photos"
          )}
        </button>
      </form>
    </div>
  );
}
