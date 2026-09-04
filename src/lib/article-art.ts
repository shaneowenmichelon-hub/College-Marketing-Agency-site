/**
 * Single source of truth for article cover art. Each article is mapped to one of
 * a small set of on-brand animated scenes, chosen from an optional explicit
 * `art` frontmatter value first, otherwise inferred from the slug + category.
 * Used both by the <ArticleArt> render component and the 48h cron that assigns
 * covers to newly published articles.
 */

export type Scene = "creators" | "product" | "events" | "ambassadors" | "strategy";

export const SCENES: Scene[] = ["creators", "product", "events", "ambassadors", "strategy"];

function isScene(value: string): value is Scene {
  return (SCENES as string[]).includes(value);
}

/** Pick a scene from an explicit override, then the slug, then the category. */
export function resolveScene(slug: string, category: string, override?: string): Scene {
  if (override && isScene(override.trim().toLowerCase())) {
    return override.trim().toLowerCase() as Scene;
  }
  const s = `${slug} ${category}`.toLowerCase();
  if (/(influencer|creator|content|ugc|gen-?z|social|tiktok|livestream)/.test(s)) return "creators";
  if (/(product|sampling|nutrl|celsius|launch|drop|placement|package|sample)/.test(s)) return "product";
  if (/(event|tour|sponsor|activation|welcome|festival|night school|concert|tailgate|party)/.test(s))
    return "events";
  if (/(ambassador|\brep\b|reps|sos|boots|street|advocate|word of mouth)/.test(s)) return "ambassadors";
  return "strategy";
}
