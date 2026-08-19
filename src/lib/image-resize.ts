"use client";

// ============================================================
// Client-side image resizing/compression, done in the browser
// BEFORE the file is uploaded anywhere.
// ------------------------------------------------------------
// Phone camera photos are often 3-8MB at full resolution, and on
// iPhone are usually saved as HEIC — a format browsers can't
// display or re-encode with <canvas>. Sent as-is, a large or
// unsupported file can get rejected by the hosting platform
// itself (before our own code even runs), which returns a plain
// error page instead of JSON and crashes a naive res.json() call.
//
// This step: converts HEIC/HEIF to JPEG first (if needed), then
// shrinks to a sensible max dimension + JPEG compression — cutting
// a typical photo down to a few hundred KB with no visible quality
// loss on a product page, and avoiding platform upload limits.
// ============================================================

export class UnsupportedImageError extends Error {}

export async function resizeImageForUpload(
  file: File,
  maxDimension = 1600,
  quality = 0.82
): Promise<File> {
  let workingFile = file;

  const isHeic =
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    /\.heic$|\.heif$/i.test(file.name);

  if (isHeic) {
    try {
      // Loaded dynamically so it doesn't bloat every page's bundle —
      // only pulled in when an HEIC file actually needs converting.
      const heic2any = (await import("heic2any")).default;
      const converted = await heic2any({ blob: file, toType: "image/jpeg", quality });
      const blob = Array.isArray(converted) ? converted[0] : converted;
      workingFile = new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", {
        type: "image/jpeg",
      });
    } catch (err) {
      console.error("[image-resize] HEIC conversion failed:", err);
      throw new UnsupportedImageError(
        "This photo is in iPhone's HEIC format and couldn't be converted automatically. " +
          'In iPhone Settings > Camera > Formats, switch to "Most Compatible" and retake ' +
          "the photo, or send it to yourself via email/WhatsApp first (that usually converts it to JPEG)."
      );
    }
  }

  // Skip already-small files, and skip GIFs (re-encoding would strip animation).
  if (workingFile.size < 400 * 1024 || workingFile.type === "image/gif") return workingFile;

  try {
    const bitmap = await createImageBitmap(workingFile);
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return workingFile;

    ctx.drawImage(bitmap, 0, 0, width, height);

    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", quality)
    );
    if (!blob) return workingFile;

    const newName = workingFile.name.replace(/\.\w+$/, "") + ".jpg";
    return new File([blob], newName, { type: "image/jpeg" });
  } catch {
    // If resizing fails for any other reason, fall back to the
    // (already HEIC-converted, if needed) file rather than blocking.
    return workingFile;
  }
}
