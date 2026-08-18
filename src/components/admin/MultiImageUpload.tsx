"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import LaceLoader from "@/components/LaceLoader";

export type UploadedImage = { path: string };

export default function MultiImageUpload({
  images,
  onChange,
  mainImage,
  onMainImageChange,
}: {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  mainImage: string | null;
  onMainImageChange: (path: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    setError(null);

    const uploaded: UploadedImage[] = [];
    for (const file of Array.from(fileList)) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        uploaded.push({ path: data.path });
      } else {
        setError(data.error || "One or more images failed to upload.");
      }
    }

    const merged = [...images, ...uploaded];
    onChange(merged);
    // If nothing is set as the main image yet, default to the first upload.
    if (!mainImage && merged.length > 0) onMainImageChange(merged[0].path);

    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function removeImage(path: string) {
    const remaining = images.filter((i) => i.path !== path);
    onChange(remaining);
    if (mainImage === path) onMainImageChange(remaining[0]?.path ?? "");
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-3">
        {images.map((img) => (
          <div
            key={img.path}
            className={`relative h-20 w-20 overflow-hidden rounded-lg border-2 ${
              mainImage === img.path ? "border-wine dark:border-gold" : "border-transparent"
            }`}
          >
            <Image src={img.path} alt="" fill className="object-cover" />
            <button
              type="button"
              onClick={() => onMainImageChange(img.path)}
              title="Set as main image (thumbnail)"
              className={`absolute top-1 left-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                mainImage === img.path
                  ? "bg-wine dark:bg-gold text-cream dark:text-charcoal"
                  : "bg-black/40 text-white"
              }`}
            >
              ★
            </button>
            <button
              type="button"
              onClick={() => removeImage(img.path)}
              title="Remove image"
              className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/40 text-white text-[10px]"
            >
              ✕
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-wine/30 dark:border-gold/30 text-wine dark:text-gold hover:bg-wine/5 dark:hover:bg-gold/10"
        >
          {uploading ? (
            <LaceLoader size={24} />
          ) : (
            <>
              <span className="text-xl leading-none">+</span>
              <span className="text-[10px]">Add photo</span>
            </>
          )}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      <p className="text-xs text-ink-muted dark:text-cream-muted">
        Upload photos straight from your device — click the ★ on the one that should be
        the main product thumbnail.
      </p>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
