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

/**
 * Per-file alt text. Files not listed fall back to a generic description.
 *
 * Every file here is cropped 3:2 to match the collage tile exactly, so the
 * tile never has to crop again. Before that they were 2:3 portraits squeezed
 * into a 2.5:1 tile, which showed about a quarter of each photo and scaled it
 * up to fit - the reason the strip read as smudged.
 */
const ALT: Record<string, string> = {
  "01-beatbox-stage-crowd.jpg":
    "BEATBOX carton held up toward the stage and crowd at a sponsored live event",
  "02-campus-nightlife-pair.jpg":
    "Two attendees with sponsor product at a campus nightlife activation",
  "03-nutrl-crowd-campus-event.jpg":
    "Two attendees holding a NUTRL can in the crowd at a sponsored campus event",
  "04-stiizy-event-staffing.jpg":
    "Staffer running a giant-dice game beside a branded STIIZY inflatable",
  "05-beatbox-performer-stage.jpg":
    "Performer on stage holding a BEATBOX carton at a sponsored tour stop",
  "06-nutrl-pair-venue.jpg":
    "Two attendees holding NUTRL cans at a sponsored venue event",
  "07-beatbox-festival-crowd.jpg":
    "Attendee in the crowd with a BEATBOX carton at a sponsored festival activation",
  "08-dazed-staffed-table.jpg":
    "Staffed Dazed activation table with branded merchandise at an outdoor campus event",
  "09-nutrl-toast-tent.jpg":
    "Attendees toasting NUTRL cans under the tent at a sponsored campus event",
  "10-beatbox-trio-venue.jpg":
    "Three attendees holding BEATBOX cartons outside a sponsored venue event",
  "11-beatbox-attendees-pair.jpg":
    "Two attendees holding BEATBOX cartons at a sponsored venue event",
  "12-nutrl-can-outdoor.jpg":
    "Attendee holding a NUTRL can at an outdoor campus event",
  "13-nutrl-bar-cart.jpg":
    "Branded NUTRL bar cart staffed at a campus event activation",
  "14-dazed-caps-trio.jpg":
    "Three attendees wearing branded Dazed caps at a campus activation",
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
