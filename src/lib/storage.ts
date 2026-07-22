/**
 * Private file storage for sensitive uploads (ambassador IDs, proof-of-work).
 * ---------------------------------------------------------------------------
 * Swappable behind this small interface. Nothing else in the app touches the
 * storage provider directly, so you can move from Vercel Blob to S3/R2 without
 * changing any form or route.
 *
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │ ACTIVE MODE: Vercel Blob with unguessable, random-suffixed pathnames.       │
 * │ NOTE: Vercel Blob currently serves objects over an UNGUESSABLE-but-public   │
 * │ URL (there is no per-object private/expiring download on standard plans).   │
 * │ For true private storage — the correct production choice for government ID  │
 * │ images — swap `deliver()` below for S3 or Cloudflare R2 and return          │
 * │ TIME-LIMITED SIGNED URLs (getSignedUrl, ~15 min). The email links would     │
 * │ then expire; everything else here stays the same.                           │
 * │ TODO: move to S3/R2 signed private URLs before handling real IDs at scale.  │
 * └───────────────────────────────────────────────────────────────────────────┘
 */
import { put } from "@vercel/blob";

export type UploadResult = {
  /** Secure link to the stored object, or null if storage isn't configured / failed. */
  url: string | null;
  /** Human note surfaced in the internal email when url is null. */
  note?: string;
};

export function storageConfigured(): boolean {
  return !!(process.env.BLOB_READ_WRITE_TOKEN && process.env.BLOB_READ_WRITE_TOKEN.trim());
}

/* ── PROVIDER CALL — the single swap point (Vercel Blob → S3/R2 signed URL) ── */
async function deliver(pathname: string, file: File): Promise<string> {
  const { url } = await put(pathname, file, {
    access: "public", // unguessable via addRandomSuffix; see note above
    addRandomSuffix: true,
    contentType: file.type || "application/octet-stream",
  });
  return url;
}
/* ─────────────────────────────────────────────────────────────────────────── */

/**
 * Upload a sensitive file to private storage. Never throws — if storage isn't
 * configured or the upload fails, returns { url: null, note } so the caller can
 * still succeed and flag it in the internal email. The URL is only ever put in
 * the internal notification email — never returned to the browser, logged in
 * plaintext, or placed in analytics / query strings.
 */
export async function uploadPrivate(pathname: string, file: File): Promise<UploadResult> {
  if (!storageConfigured()) {
    return { url: null, note: "not uploaded — storage not configured" };
  }
  try {
    const url = await deliver(pathname, file);
    return { url };
  } catch (err) {
    console.error("[storage] upload failed:", err instanceof Error ? err.message : "unknown");
    return { url: null, note: "not uploaded — storage error" };
  }
}
