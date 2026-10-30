import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ArticleArt } from "@/components/insights/ArticleArt";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { CTASection } from "@/components/CTASection";
import { CollectionPageJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { Badge } from "@/components/ui/Badge";
import { Section } from "@/components/ui/Section";
import { formatDate } from "@/lib/content";
import {
  insightTopicBySlug,
  insightTopicPath,
  insightTopics,
  postsForInsightTopic,
} from "@/lib/insight-topics";
import { pageMetadata, resolveDocumentTitle } from "@/lib/seo";

type Params = Promise<{ slug: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return insightTopics.map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const topic = insightTopicBySlug(slug);
  if (!topic) notFound();
  return pageMetadata({
    title: topic.title,
    description: topic.description,
    path: insightTopicPath(topic.slug),
  });
}

export default async function InsightTopicPage({ params }: { params: Params }) {
  const { slug } = await params;
  const topic = insightTopicBySlug(slug);
  if (!topic) notFound();

  const articles = postsForInsightTopic(topic.slug);
  const path = insightTopicPath(topic.slug);
  const documentTitle = resolveDocumentTitle(topic.title).text;

  return (
    <>
      <CollectionPageJsonLd
        name={documentTitle}
        description={topic.description}
        path={path}
        items={articles.map((post) => ({ name: post.title, path: `/insights/${post.slug}` }))}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Insights", path: "/insights" },
          { name: topic.breadcrumb, path },
        ]}
      />
      <Section tone="light">
        <Link
          href="/insights"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent"
        >
          <ArrowLeft className="h-4 w-4" /> All insights
        </Link>
        <SectionHeading
          as="h1"
          className="mt-6"
          eyebrow="Insights"
          title={topic.heading}
          intro={
            <>
              {topic.intro}{" "}
              <Link href={topic.serviceHref} className="font-semibold text-accent hover:underline">
                {topic.serviceLabel}
              </Link>
              .
            </>
          }
        />

        {articles.length > 0 ? (
          <ul className="mt-12 grid list-none gap-6 p-0 md:grid-cols-2">
            {articles.map((post, index) => (
              <li key={post.slug}>
                <Reveal delay={index * 0.08}>
                  <Link
                    href={`/insights/${post.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-[color:var(--border-on-light)] bg-surface p-6 shadow-soft transition-all card-press hover:-translate-y-1 hover:shadow-soft-lg"
                  >
                    <ArticleArt
                      slug={post.slug}
                      image={post.image}
                      imageAlt={post.imageAlt}
                      imageWidth={post.imageWidth}
                      imageHeight={post.imageHeight}
                      category={post.category}
                      art={post.art}
                      className="mb-5 aspect-[16/7] w-full"
                    />
                    <div className="flex items-center gap-3 text-xs text-[color:var(--muted-on-light)]">
                      <Badge>{post.category}</Badge>
                      <span>{formatDate(post.date)}</span>
                    </div>
                    <h2 className="mt-4 font-display text-xl font-bold text-ink group-hover:text-accent">
                      {post.title}
                    </h2>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-[color:var(--muted-on-light)]">
                      {post.excerpt}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                      Read article <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-12 text-[color:var(--muted-on-light)]">
            Articles assigned to this topic will be listed here.
          </p>
        )}
      </Section>

      <CTASection
        title="Want to reach students?"
        primary={{ label: "Get Started", href: "/contact", variant: "lime" }}
        secondary={{ label: "Become an Ambassador", href: "/become-an-ambassador" }}
      />
    </>
  );
}
