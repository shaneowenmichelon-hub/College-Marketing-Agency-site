import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { CTASection } from "@/components/CTASection";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/site.config";
import { getPost, posts, formatDate, type ArticleBlock, type Post } from "@/lib/content";

type Params = Promise<{ slug: string }>;

// Hero gradients keyed by category so each article reads as finished, not templated.
const HERO_GRADIENT: Record<string, string> = {
  Influencers: "from-[#2F5BFF] via-[#6b7bff] to-[#C6FF3D]",
  Ambassadors: "from-[#0B0B0F] via-[#3a2a4a] to-[#FF3D9A]",
  Events: "from-[#0B0B0F] via-[#2a2340] to-[#FF6A2B]",
  "Campus Strategy": "from-[#2F5BFF] to-[#0B0B0F]",
};

// Closing CTA copy per service.
const SERVICE_CTA: Record<Post["ctaService"], { label: string; href: string; blurb: string }> = {
  influencers: {
    label: "Explore our influencer program",
    href: "/services/influencers",
    blurb: "Every creator in our network is vetted for real, engaged, campus-based audiences before a brand ever pays.",
  },
  "brand-ambassadors": {
    label: "Explore our ambassador program",
    href: "/services/brand-ambassadors",
    blurb: "We screen, verify, and manage campus ambassadors so brands get reliable representation — not a gamble.",
  },
  events: {
    label: "Explore campus events",
    href: "/services/events",
    blurb: "Plug into the Night School Tour and our welcome-week network across campus markets.",
  },
};

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Article not found" };
  const image = post.ogImage ?? "/og.svg";
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/insights/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: `${siteConfig.url}/insights/${slug}`,
      publishedTime: post.date,
      authors: [post.author ?? siteConfig.companyName],
      images: [{ url: image, width: 1200, height: 630, alt: post.title }],
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.excerpt, images: [image] },
  };
}

/** Render one article body block. Content is our own (trusted) copy. */
function Block({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case "h2":
      return <h2 className="font-display text-2xl font-bold text-ink">{block.text}</h2>;
    case "p":
      return <p dangerouslySetInnerHTML={{ __html: block.html }} />;
    case "ul":
      return (
        <ul className="list-disc space-y-2 pl-5">
          {block.items.map((it, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: it }} />
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="list-decimal space-y-2 pl-5">
          {block.items.map((it, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: it }} />
          ))}
        </ol>
      );
  }
}

export default async function InsightArticle({ params }: { params: Params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const author = post.author ?? siteConfig.companyName;
  const gradient = HERO_GRADIENT[post.category] ?? HERO_GRADIENT["Campus Strategy"];
  const cta = SERVICE_CTA[post.ctaService];

  return (
    <>
      <ArticleJsonLd
        title={post.title}
        description={post.excerpt}
        slug={post.slug}
        date={post.date}
        image={post.ogImage ?? "/og.svg"}
        author={author}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Insights", path: "/insights" },
          { name: post.title, path: `/insights/${post.slug}` },
        ]}
      />
      <article>
        <Section tone="light" className="pb-0">
          <Container className="max-w-3xl px-0">
            <Link
              href="/insights"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent"
            >
              <ArrowLeft className="h-4 w-4" /> All insights
            </Link>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-[color:var(--muted-on-light)]">
              <Badge>{post.category}</Badge>
              <span>{formatDate(post.date)}</span>
              <span>· {post.readingTime}</span>
            </div>
            <h1 className="mt-4 text-balance font-display text-4xl font-bold leading-[1.05] text-ink sm:text-5xl">
              {post.title}
            </h1>
            <p className="mt-4 text-lg text-[color:var(--muted-on-light)]">{post.excerpt}</p>
            <p className="mt-4 text-sm font-medium text-ink">
              By {author}
            </p>
          </Container>
          <Container className="mt-10 max-w-4xl px-0">
            <div
              className={`relative flex aspect-[16/8] items-end overflow-hidden rounded-2xl bg-gradient-to-br ${gradient}`}
            >
              <div aria-hidden className="grain absolute inset-0" />
              <span className="relative z-10 m-6 rounded-full bg-black/25 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm">
                {post.category}
              </span>
            </div>
          </Container>
        </Section>

        <Section tone="light" className="pt-10">
          <Container className="max-w-3xl px-0">
            <div className="prose-custom space-y-6 text-base leading-relaxed text-[color:var(--muted-on-light)] [&_a]:font-semibold [&_a]:text-accent [&_a:hover]:underline [&_strong]:text-ink">
              {post.body.map((block, i) => (
                <Block key={i} block={block} />
              ))}
            </div>

            {/* Closing service CTA */}
            <div className="mt-12 flex flex-col gap-4 rounded-2xl border border-[color:var(--border-on-light)] bg-surface-muted p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <p className="max-w-md text-sm text-[color:var(--muted-on-light)]">{cta.blurb}</p>
              <Link
                href={cta.href}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
              >
                {cta.label} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Container>
        </Section>
      </article>

      <CTASection
        title="Ready to reach students?"
        primary={{ label: "Get Started", href: "/contact", variant: "lime" }}
      />
    </>
  );
}
