/** Shared file-upload constraints + validation (client and server). */

export const ALLOWED_UPLOAD_TYPES = [
  "image/jpeg",
  "image/png",
  "image/heic",
  "image/heif",
  "image/webp",
  "application/pdf",
];

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB

export const ACCEPT_ATTR = ".jpg,.jpeg,.png,.heic,.heif,.webp,.pdf,image/*,application/pdf";

/**
 * Validate a File against type + size. Returns an error message, or null if OK.
 * Some HEIC files report an empty MIME type on certain browsers — we accept an
 * empty type (size is still enforced) rather than reject a legitimate photo.
 */
export function validateUpload(file: File): string | null {
  if (file.size > MAX_UPLOAD_BYTES) return "File is larger than 10MB.";
  if (file.type && !ALLOWED_UPLOAD_TYPES.includes(file.type)) {
    return "Use a JPG, PNG, HEIC, WEBP, or PDF.";
  }
  return null;
}

export function humanFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
