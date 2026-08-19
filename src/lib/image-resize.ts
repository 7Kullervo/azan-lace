"use client";

// ============================================================
// Client-side image resizing/compression, done in the browser
// BEFORE the file is uploaded anywhere.
// ------------------------------------------------------------
// Phone camera photos are often 3-8MB at full resolution. Sent
// as-is, that file has to travel browser -> server -> R2 (a
// double hop), which is slow on free hosting, and every visitor
// then downloads that same huge file when viewing the product.
// Shrinking to a sensible max dimension + JPEG compression here
// cuts a typical photo down to a few hundred KB with no visible
// quality loss on a product page, and speeds up both the upload
// itself and every later page load.
// ============================================================

export async function resizeImageForUpload(
  file: File,
  maxDimension = 1600,
  quality = 0.82
): Promise<File> {
  // Skip already-small files, and skip GIFs (re-encoding would strip animation).
  if (file.size < 400 * 1024 || file.type === "image/gif") return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;

    ctx.drawImage(bitmap, 0, 0, width, height);

    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", quality)
    );
    if (!blob) return file;

    const newName = file.name.replace(/\.\w+$/, "") + ".jpg";
    return new File([blob], newName, { type: "image/jpeg" });
  } catch {
    // If resizing fails for any reason (unsupported format, etc.),
    // fall back to uploading the original file rather than blocking.
    return file;
  }
}
