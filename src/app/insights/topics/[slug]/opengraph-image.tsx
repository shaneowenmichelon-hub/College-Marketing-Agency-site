import { insightTopicBySlug } from "@/lib/insight-topics";
import { ogContentType, ogSize, renderOgCard } from "@/lib/og-card";

export const size = ogSize;
export const contentType = ogContentType;

export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = insightTopicBySlug(slug);
  const alt = topic
    ? `${topic.heading} Insights from Collegiate Agency for brands.`
    : "Collegiate Agency insight topic";
  return [{ id: slug, alt, size: ogSize, contentType: ogContentType }];
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = insightTopicBySlug(slug);
  return renderOgCard({
    kicker: "Insights",
    title: topic?.ogTitle ?? "Insight topic",
    accent: topic?.ogAccent ?? "Campus marketing for brands.",
  });
}
