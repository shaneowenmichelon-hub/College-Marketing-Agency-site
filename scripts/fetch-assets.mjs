/**
 * Build-time asset fetcher (non-fatal).
 * ------------------------------------
 * Downloads the real ZMM sponsor logos and event photos into /public so the site
 * self-hosts them. Runs automatically via the `prebuild` npm hook (so Vercel
 * populates them on every deploy) and can be run manually: `node scripts/fetch-assets.mjs`.
 *
 * It NEVER fails the build: any 404, network block, or timeout is skipped and
 * logged. Files already present are left untouched. Components fall back to the
 * live remote URL, then a wordmark/gradient, so missing assets never look broken.
 *
 * NOTE: some sandboxed build environments block outbound access to zmm.events; in
 * that case everything is skipped here and the assets are fetched on Vercel instead.
 */
import { mkdir, writeFile, access, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const LOGO_DIR = join(ROOT, "public", "logos");
const PHOTO_DIR = join(ROOT, "public", "images", "events");

// Keep this curated list in sync with `eventPhotos` in src/site.config.ts.
const PHOTO_FILES = [
  "t1.jpg", "t4.jpg", "t7.jpg", "t10.jpg", "t13.jpg", "t16.jpg", "t20.jpg",
  "t24.jpg", "t28.jpg", "t32.jpg", "t37.jpg", "t42.jpg", "t47.jpg", "t51.jpg",
  "t53.jpg", "t54.jpg",
];

const SPONSOR_COUNT = 22;
const TIMEOUT_MS = 8000;

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function download(url, dest) {
  if (await exists(dest)) {
    const s = await stat(dest);
    if (s.size > 100) return "exists";
  }
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (!res.ok) return `skip(${res.status})`;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 100) return "skip(tiny)";
    await writeFile(dest, buf);
    return "ok";
  } catch (err) {
    return `skip(${err?.name || "err"})`;
  }
}

async function main() {
  await mkdir(LOGO_DIR, { recursive: true });
  await mkdir(PHOTO_DIR, { recursive: true });

  const jobs = [];
  for (let n = 1; n <= SPONSOR_COUNT; n++) {
    jobs.push({
      kind: "logo",
      url: `https://www.zmm.events/assets/sponsors/sponsor${n}.png`,
      dest: join(LOGO_DIR, `sponsor${n}.png`),
    });
  }
  for (const file of PHOTO_FILES) {
    jobs.push({
      kind: "photo",
      url: `https://www.zmm.events/assets/ticker/${file}`,
      dest: join(PHOTO_DIR, file),
    });
  }

  const results = await Promise.all(
    jobs.map(async (j) => ({ ...j, result: await download(j.url, j.dest) })),
  );

  const ok = results.filter((r) => r.result === "ok").length;
  const kept = results.filter((r) => r.result === "exists").length;
  const skipped = results.filter((r) => r.result.startsWith("skip")).length;

  console.log(
    `[fetch-assets] downloaded ${ok}, already present ${kept}, skipped ${skipped} of ${jobs.length}.`,
  );
  if (skipped > 0 && ok === 0 && kept === 0) {
    console.log(
      "[fetch-assets] nothing fetched — likely blocked in this environment. " +
        "Assets will download on Vercel's build, or run this script from a machine with open network.",
    );
  }
}

// Never let this crash a build.
main().catch((err) => {
  console.warn("[fetch-assets] non-fatal error:", err?.message || err);
  process.exit(0);
});
