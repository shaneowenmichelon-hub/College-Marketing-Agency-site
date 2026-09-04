import { list, put } from "@vercel/blob";
import type { Scene } from "@/lib/article-art";

/**
 * Durable record of which articles have a cover assigned and to which scene.
 * Written by the 48h cron (see /api/cron/article-art) so newly published
 * articles get a graphic locked in and there is an auditable trail. Covers
 * still render deterministically without this — the manifest is the ledger.
 */

export type ArtManifestItem = {
  slug: string;
  title: string;
  category: string;
  scene: Scene;
  date: string;
  /** First time the cron assigned this article a cover. */
  coveredAt: string;
};

export type ArtManifest = {
  generatedAt: string;
  count: number;
  items: ArtManifestItem[];
};

const KEY = "article-art/manifest.json";

export function artStorageConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

export async function readArtManifest(): Promise<ArtManifest | null> {
  if (!artStorageConfigured()) return null;
  try {
    const page = await list({ prefix: KEY, limit: 10 });
    const blob = page.blobs.find((b) => b.pathname === KEY) ?? page.blobs[0];
    if (!blob) return null;
    const res = await fetch(blob.url, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as ArtManifest;
  } catch (error) {
    console.warn("[article-art] failed to read manifest", error);
    return null;
  }
}

export async function writeArtManifest(manifest: ArtManifest): Promise<boolean> {
  if (!artStorageConfigured()) return false;
  try {
    await put(KEY, JSON.stringify(manifest, null, 2), {
      access: "public",
      allowOverwrite: true,
      contentType: "application/json; charset=utf-8",
    });
    return true;
  } catch (error) {
    console.error("[article-art] manifest write failed", error);
    return false;
  }
}
