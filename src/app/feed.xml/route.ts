import { posts } from "@/lib/content";
import { siteConfig } from "@/site.config";

export const dynamic = "force-static";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * RSS 2.0 feed of published insights. Linked from page metadata as
 * rel="alternate" type="application/rss+xml".
 */
export function GET() {
  const url = siteConfig.url;
  const items = [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));
  const lastBuild = items.reduce((latest, post) => {
    const stamp = post.dateModified ?? post.date;
    return stamp > latest ? stamp : latest;
  }, "2026-10-22");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.companyName)} Insights</title>
    <link>${url}/insights</link>
    <atom:link href="${url}/feed.xml" rel="self" type="application/rss+xml"/>
    <description>${escapeXml(siteConfig.definition)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date(`${lastBuild}T00:00:00.000Z`).toUTCString()}</lastBuildDate>
${items
  .map((post) => {
    const link = `${url}/insights/${post.slug}`;
    const published = post.dateModified ?? post.date;
    return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${new Date(`${published}T00:00:00.000Z`).toUTCString()}</pubDate>
      <description>${escapeXml(post.excerpt)}</description>
    </item>`;
  })
  .join("\n")}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
