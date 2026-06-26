"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { uploadMultiplePhotos, validateImageFile } from "@/lib/firebase/storage";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface PhotoUploadProps {
  photos: string[];
  onChange: (photos: string[]) => void;
  equipmentId?: string;
  className?: string;
}

export function PhotoUpload({
  photos,
  onChange,
  equipmentId = "temp",
  className,
}: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [error, setError] = useState("");

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setError("");
    const fileArray = Array.from(files);

    for (const file of fileArray) {
      const validationError = validateImageFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    setUploading(true);
    setProgress({ done: 0, total: fileArray.length });

    try {
      const urls = await uploadMultiplePhotos(fileArray, equipmentId, (done, total) => {
        setProgress({ done, total });
      });
      onChange([...photos, ...urls]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (index: number) => {
    onChange(photos.filter((_, i) => i !== index));
  };

  return (
    <div className={cn("space-y-4", className)}>
      <label className="block text-sm font-medium text-surface-300">Photos</label>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
        {photos.map((photo, index) => (
          <div key={photo} className="relative aspect-square overflow-hidden rounded-lg bg-surface-800">
            <Image src={photo} alt={`Photo ${index + 1}`} fill className="object-cover" sizes="120px" />
            <button
              type="button"
              onClick={() => removePhoto(index)}
              className="absolute right-1 top-1 rounded-full bg-red-600 p-1 text-white hover:bg-red-500"
              aria-label="Remove photo"
            >
              <X className="h-3 w-3" />
            </button>
            {index === 0 && (
              <span className="absolute bottom-1 left-1 rounded bg-brand-600 px-1.5 py-0.5 text-[10px] font-medium text-white">
                Main
              </span>
            )}
          </div>
        ))}

        <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-surface-700 bg-surface-900 transition-colors hover:border-brand-600 hover:bg-surface-800">
          {uploading ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
              <span className="mt-1 text-xs text-surface-400">
                {progress.done}/{progress.total}
              </span>
            </>
          ) : (
            <>
              <Upload className="h-6 w-6 text-surface-500" />
              <span className="mt-1 text-xs text-surface-400">Upload</span>
            </>
          )}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="hidden"
            disabled={uploading}
            onChange={(e) => handleFiles(e.target.files)}
          />
        </label>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}
      <p className="text-xs text-surface-500">
        First photo is used as the main listing image. Max 5MB per file.
      </p>
    </div>
  );
}
