import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { posts } from "@/lib/content";
import { resolveScene } from "@/lib/article-art";
import {
  artStorageConfigured,
  readArtManifest,
  writeArtManifest,
  type ArtManifest,
  type ArtManifestItem,
} from "@/lib/article-art-manifest";

/**
 * Runs every 48h (see vercel.json crons). Scans every published article,
 * assigns each one an on-brand animated cover scene, records the assignment in
 * a Blob manifest (locking a cover onto any newly published article), and
 * revalidates the insight pages so new articles + their covers go live.
 *
 * Covers already render deterministically at request time, so this job is the
 * scheduled ledger/safety-net — it never blocks an article from having art.
 */

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return true; // no secret set → allow (Vercel cron still works; manual runs allowed)
  const header = request.headers.get("authorization") || "";
  if (header === `Bearer ${secret}`) return true; // Vercel cron sends this automatically
  return new URL(request.url).searchParams.get("key") === secret; // manual trigger fallback
}

async function run(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const now = new Date().toISOString();
  const prior = await readArtManifest();
  const priorBySlug = new Map((prior?.items ?? []).map((item) => [item.slug, item]));

  const items: ArtManifestItem[] = posts.map((post) => {
    const existing = priorBySlug.get(post.slug);
    return {
      slug: post.slug,
      title: post.title,
      category: post.category,
      scene: resolveScene(post.slug, post.category, post.art),
      date: post.date,
      coveredAt: existing?.coveredAt ?? now,
    };
  });

  const newlyCovered = items
    .filter((item) => !priorBySlug.has(item.slug))
    .map((item) => ({ slug: item.slug, scene: item.scene }));

  const manifest: ArtManifest = { generatedAt: now, count: items.length, items };
  const manifestStored = await writeArtManifest(manifest);

  // Refresh the insight index + each article so new posts and covers render.
  revalidatePath("/insights");
  for (const post of posts) revalidatePath(`/insights/${post.slug}`);

  return NextResponse.json({
    ok: true,
    generatedAt: now,
    storageConfigured: artStorageConfigured(),
    manifestStored,
    total: items.length,
    newlyCoveredCount: newlyCovered.length,
    newlyCovered,
  });
}

export async function GET(request: Request) {
  return run(request);
}

export async function POST(request: Request) {
  return run(request);
}
