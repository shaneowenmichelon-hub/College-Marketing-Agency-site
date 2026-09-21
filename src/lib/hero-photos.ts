import fs from "node:fs";
import path from "node:path";

/**
 * Server-side reader for hero collage photos. Returns every image dropped into
 * /public/images/hero (jpg/png/webp/avif), so adding real activation photos is a
 * pure drag-and-drop — no code change needed. Empty folder → caller falls back
 * to the stock photos. Read at build time (the homepage is statically generated).
 */
export type HeroPhoto = { src: string; alt: string };

const DIR = path.join(process.cwd(), "public", "images", "hero");
const IMG = /\.(jpe?g|png|webp|avif)$/i;

export function getHeroPhotos(): HeroPhoto[] {
  try {
    return fs
      .readdirSync(DIR)
      .filter((f) => IMG.test(f))
      .sort()
      .map((f) => ({
        src: `/images/hero/${f}`,
        alt: "Collegiate Agency campus brand activation",
      }));
  } catch {
    return [];
  }
}
