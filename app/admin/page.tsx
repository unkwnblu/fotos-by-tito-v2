"use client";

import { useState, useEffect } from "react";
// import { categories } from "@/lib/data"; // Removed static import
import { savePhotoMetadata, PhotoData } from "./actions";
import {
  Loader2,
  Upload,
  FileImage,
  CheckCircle,
  AlertCircle,
  X,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";

export default function AdminDashboard() {
  // Use state for categories
  const [categories, setCategories] = useState<{ id: string; title: string }[]>(
    []
  );
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // State for upload process
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Progress State
  const [progress, setProgress] = useState(0);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const init = async () => {
      // 1. Check Auth
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setAuthChecking(false);

      // 2. Fetch Categories
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("created_at", { ascending: true });

      if (data) {
        setCategories(data);
        if (data.length > 0) {
          setSelectedCategory(data[0].id);
        }
      }
      setLoadingCategories(false);
    };
    init();
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

  const clearFiles = () => {
    setSelectedFiles([]);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) return;
    if (!isAuthenticated) {
      setStatusMessage({
        type: "error",
        text: "You are not authenticated. Please reload or log in.",
      });
      return;
    }
    if (!selectedCategory) {
      setStatusMessage({
        type: "error",
        text: "Please select a category.",
      });
      return;
    }

    setIsUploading(true);
    setStatusMessage(null);
    setProgress(0);
    setCurrentFileIndex(0);

    try {
      const uploadedPhotos: PhotoData[] = [];
      const errors: string[] = [];
      const totalFiles = selectedFiles.length;

      // 1. Upload files to Supabase Storage directly from client
      for (let i = 0; i < totalFiles; i++) {
        const file = selectedFiles[i];
        setCurrentFileIndex(i + 1);

        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(7)}.${fileExt}`;
        const filePath = `${selectedCategory}/${fileName}`;

        // Perform upload
        const { data, error } = await supabase.storage
          .from("photos")
          .upload(filePath, file);

        if (error) {
          console.error(`Upload failed for ${file.name}`, error);
          errors.push(`${file.name} (${error.message})`);
          continue;
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from("photos")
          .getPublicUrl(filePath);

        uploadedPhotos.push({
          url: publicUrlData.publicUrl,
          storage_path: filePath,
          category_id: selectedCategory,
        });

        // Update progress
        setProgress(Math.round(((i + 1) / totalFiles) * 100));
      }

      if (uploadedPhotos.length === 0) {
        throw new Error(`All uploads failed. Errors: ${errors.join(", ")}`);
      }

      // 2. Save metadata to Database via Server Action
      const result = await savePhotoMetadata(uploadedPhotos);

      if (!result.success) {
        throw new Error(result.error);
      }

      setStatusMessage({
        type: "success",
        text: `Successfully uploaded ${uploadedPhotos.length} photo${
          uploadedPhotos.length !== 1 ? "s" : ""
        }! ${errors.length > 0 ? `Failed: ${errors.join(", ")}` : ""}`,
      });

      // Clear files on success
      setSelectedFiles([]);
      setProgress(0);
      setCurrentFileIndex(0);
    } catch (error: any) {
      console.error("Upload process error:", error);
      setStatusMessage({
        type: "error",
        text: error.message || "An error occurred during upload.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your portfolio content and uploads.
        </p>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm max-w-4xl">
        <div className="p-6 flex flex-col space-y-1.5">
          <h3 className="font-semibold leading-none tracking-tight">
            Upload New Photos
          </h3>
          <p className="text-sm text-muted-foreground">
            Add new photos to your portfolio categories.
          </p>
        </div>
        <div className="p-6 pt-0">
          {!authChecking && !isAuthenticated ? (
            <div className="p-4 bg-red-100 text-red-700 rounded-md mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span>
                Authentication check failed. Please refresh the page or sign in
                again.
              </span>
            </div>
          ) : null}

          <form onSubmit={handleUpload} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              {loadingCategories ? (
                <div className="flex h-10 w-full items-center px-3 border rounded-md bg-muted">
                  <Loader2 className="w-4 h-4 animate-spin mr-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Loading categories...
                  </span>
                </div>
              ) : (
                <select
                  name="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {categories.length === 0 && (
                    <option value="">No categories found</option>
                  )}
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.title}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Photos</label>
              <div
                className={`relative flex flex-col items-center justify-center w-full min-h-[16rem] border-2 border-dashed rounded-lg transition-colors ${
                  dragActive
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:bg-muted/50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4 w-full">
                  <Upload className="w-10 h-10 mb-4 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    SVG, PNG, JPG or GIF
                  </p>
                </div>
                <input
                  type="file"
                  id="file-upload"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept="image/*"
                  multiple
                  onChange={handleChange}
                  disabled={isUploading}
                />
              </div>
            </div>

            {/* Progress Bar */}
            <AnimatePresence>
              {isUploading && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Uploading...</span>
                    <span>
                      {currentFileIndex} / {selectedFiles.length}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* File List Preview */}
            <AnimatePresence>
              {!isUploading && selectedFiles.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Selected Files ({selectedFiles.length})
                    </h4>
                    <button
                      type="button"
                      onClick={clearFiles}
                      className="text-xs text-red-500 hover:underline"
                      disabled={isUploading}
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        className="relative group border rounded-lg p-2 flex flex-col items-center bg-background"
                      >
                        <div className="w-full h-24 bg-muted/50 rounded-md mb-2 flex items-center justify-center overflow-hidden">
                          <FileImage className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <p className="text-xs w-full truncate text-center font-medium">
                          {file.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>

                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          disabled={isUploading}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm disabled:opacity-0"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {statusMessage && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`flex items-center p-3 text-sm rounded-md ${
                    statusMessage.type === "error"
                      ? "bg-red-500/10 text-red-500"
                      : "bg-green-500/10 text-green-500"
                  }`}
                >
                  {statusMessage.type === "error" ? (
                    <AlertCircle className="w-4 h-4 mr-2" />
                  ) : (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  )}
                  {statusMessage.text}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              disabled={isUploading || selectedFiles.length === 0}
              className="inline-flex w-full h-11 items-center justify-center rounded-md bg-primary text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 font-medium bg-black text-white dark:bg-white dark:text-black"
            >
              {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isUploading
                ? `Uploading ${currentFileIndex}/${selectedFiles.length}...`
                : `Upload ${selectedFiles.length} Photo${
                    selectedFiles.length !== 1 ? "s" : ""
                  }`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
