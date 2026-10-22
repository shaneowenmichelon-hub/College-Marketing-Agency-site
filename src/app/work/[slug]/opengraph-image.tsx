import { getCaseStudy } from "@/lib/content";
import { ogContentType, ogSize, renderOgCard } from "@/lib/og-card";

export const size = ogSize;
export const contentType = ogContentType;

export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  const alt = study
    ? `${study.brand} ${study.type} case study from Collegiate Agency${study.sample ? ", an industry example" : ""}`
    : "Collegiate Agency case study";
  return [{ id: slug, alt, size: ogSize, contentType: ogContentType }];
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  return renderOgCard({
    kicker: "Work",
    title: study?.brand ?? "Case study",
    accent: study ? `${study.type} case study` : "Campus marketing",
    detail: study?.sample ? "Industry example" : "Collegiate Agency",
  });
}
