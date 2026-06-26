"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  photos: string[];
  title: string;
}

export function ImageGallery({ photos, title }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const images =
    photos.length > 0
      ? photos
      : ["https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&h=800&fit=crop"];

  const goTo = (index: number) => {
    setActiveIndex((index + images.length) % images.length);
  };

  return (
    <>
      <div className="space-y-4">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-surface-800">
          <Image
            src={images[activeIndex]}
            alt={`${title} - photo ${activeIndex + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 60vw"
            priority
          />

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => goTo(activeIndex - 1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-surface-950/70 p-2 text-white backdrop-blur-sm transition-colors hover:bg-surface-950"
                aria-label="Previous photo"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => goTo(activeIndex + 1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-surface-950/70 p-2 text-white backdrop-blur-sm transition-colors hover:bg-surface-950"
                aria-label="Next photo"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="absolute right-3 top-3 rounded-full bg-surface-950/70 p-2 text-white backdrop-blur-sm transition-colors hover:bg-surface-950"
            aria-label="View full size"
          >
            <Expand className="h-4 w-4" />
          </button>

          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-surface-950/70 px-3 py-1 text-xs text-white backdrop-blur-sm">
              {activeIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((photo, index) => (
              <button
                key={photo}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-colors",
                  index === activeIndex
                    ? "border-brand-500"
                    : "border-transparent opacity-60 hover:opacity-100"
                )}
              >
                <Image
                  src={photo}
                  alt={`${title} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute right-4 top-4 rounded-lg bg-surface-800 px-4 py-2 text-sm text-white"
          >
            Close
          </button>
          <div className="relative h-[80vh] w-full max-w-5xl">
            <Image
              src={images[activeIndex]}
              alt={title}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>
      )}
    </>
  );
}
