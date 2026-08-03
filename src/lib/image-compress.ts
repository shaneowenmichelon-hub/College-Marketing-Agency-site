/**
 * Client-side image downscale + re-encode. Keeps ID/proof photos well under
 * Vercel's ~4.5MB serverless request-body limit so submissions don't 413.
 *
 * Runs in the browser only. Non-image files (PDF) and anything the browser can't
 * decode (e.g. HEIC in some browsers) are returned unchanged - the server still
 * enforces the 10MB hard cap as a backstop.
 */
export async function compressImage(
  file: File,
  { maxDim = 1600, quality = 0.82 } = {},
): Promise<File> {
  if (!file.type.startsWith("image/")) return file;
  // Small images don't need it.
  if (file.size < 700 * 1024) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
    const w = Math.max(1, Math.round(bitmap.width * scale));
    const h = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close?.();

    const blob = await new Promise<Blob | null>((res) =>
      canvas.toBlob(res, "image/jpeg", quality),
    );
    if (!blob || blob.size >= file.size) return file; // never upsize

    const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], name, { type: "image/jpeg", lastModified: file.lastModified });
  } catch {
    return file; // couldn't decode (e.g. HEIC in Chrome) - leave as-is
  }
}
