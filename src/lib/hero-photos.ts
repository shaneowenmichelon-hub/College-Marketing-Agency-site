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

/** Per-file alt text. Files not listed fall back to a generic description. */
const ALT: Record<string, string> = {
  "01-beatbox-festival-crowd.jpg":
    "Student in the crowd with a BeatBox at a sponsored festival activation",
  "02-night-school-tour-pair.jpg":
    "Two students with sponsor product at a Night School Tour activation",
  "03-nutrl-bar-cart-activation.jpg":
    "Branded NUTRL bar cart staffed at a campus event activation",
  "04-campus-nightlife-pair.jpg":
    "Two students with sponsor product at a campus nightlife activation",
  "05-beatbox-green-room.jpg":
    "Student with a BeatBox in the green room at a sponsored event",
  "06-stiizy-event-staffing.jpg":
    "Staffer running a giant-dice game beside a branded STIIZY inflatable",
};

export function getHeroPhotos(): HeroPhoto[] {
  try {
    return fs
      .readdirSync(DIR)
      .filter((f) => IMG.test(f))
      .sort()
      .map((f) => ({
        src: `/images/hero/${f}`,
        alt: ALT[f] ?? "Collegiate Agency campus brand activation",
      }));
  } catch {
    return [];
  }
}
