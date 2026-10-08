import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { CTASection } from "@/components/CTASection";
import { ArticleTable } from "@/components/article/ArticleTable";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/site.config";
import { getPost, posts, formatDate, type ArticleBlock, type Post } from "@/lib/content";
import { ArticleArt } from "@/components/insights/ArticleArt";

type Params = Promise<{ slug: string }>;

// Closing CTA copy per service.
/**
 * The closing call to action on every article.
 *
 * It used to send readers to a service page with no conversion step, and the
 * ambassador variant read "Explore our ambassador program" — so a student
 * searching "college brand ambassador program" landed on the article and was
 * funnelled to the one page with two Become an Ambassador buttons on it. That
 * is a direct pipe from editorial traffic to the lead type we get too many of.
 *
 * Now: the primary action is always a brand conversion, the service page is
 * demoted to a secondary link, and students get an explicit way out so they
 * self-select instead of travelling down the brand funnel.
 */
const SERVICE_CTA: Record<
  Post["ctaService"],
  {
    heading: string;
    blurb: string;
    primary: { label: string; href: string };
    secondary: { label: string; href: string };
  }
> = {
  "brand-ambassadors": {
    heading: "Want ambassadors on your campuses?",
    blurb:
      "We screen, verify and manage campus ambassadors, so brands get reliable representation rather than a gamble. Price a program in about a minute.",
    primary: { label: "Build a campaign", href: "/build-a-campaign" },
    secondary: { label: "How the program works", href: "/services/brand-ambassadors" },
  },
  events: {
    heading: "Planning a campus activation?",
    blurb:
      "Plug into the Night School Tour and our welcome-week network across campus markets. Tell us the goal and we will come back with a plan and firm pricing.",
    primary: { label: "Book a call", href: "/contact" },
    secondary: { label: "How events work", href: "/services/events" },
  },
  "product-placement": {
    heading: "Want product in students' hands?",
    blurb:
      "Place product directly into campus events, student organizations, venues and ambassador-led content. Price a run across the campuses you care about.",
    primary: { label: "Build a campaign", href: "/build-a-campaign" },
    secondary: { label: "How placement works", href: "/services#product-placement" },
  },
};

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Article not found" };
  // Only set a per-article image when the post has a real raster photo; otherwise
  // omit it so the generated site OG PNG (app/opengraph-image.tsx) is inherited
  // (avoids falling back to an SVG, which social platforms don't render well).
  const image = post.image ?? post.ogImage;
  return {
    title: post.metaTitle ?? post.title,
    description: post.metaDescription ?? post.excerpt,
    alternates: { canonical: `/insights/${slug}` },
    openGraph: {
      title: post.metaTitle ?? post.title,
      description: post.metaDescription ?? post.excerpt,
      type: "article",
      url: `${siteConfig.url}/insights/${slug}`,
      publishedTime: post.date,
      authors: [post.author ?? siteConfig.companyName],
      ...(image ? { images: [{ url: image, width: 1200, height: 630, alt: post.title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      ...(image ? { images: [image] } : {}),
    },
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
    case "table":
      return <ArticleTable block={block} />;
  }
}

export default async function InsightArticle({ params }: { params: Params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const author = post.author ?? siteConfig.companyName;
  const cta = SERVICE_CTA[post.ctaService];

  return (
    <>
      <ArticleJsonLd
        title={post.title}
        description={post.excerpt}
        slug={post.slug}
        date={post.date}
        image={post.image ?? post.ogImage}
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
            <div className="relative">
              <ArticleArt slug={post.slug} category={post.category} art={post.art} image={post.image} imageAlt={post.imageAlt} className="aspect-[16/8] w-full" />
              <span className="absolute bottom-4 left-4 z-20 rounded-full border-2 border-ink bg-white/90 px-3 py-1 text-xs font-bold text-ink">
                {post.category}
              </span>
            </div>
            {post.image && post.imageCredit && (
              <p className="mt-3 text-xs text-[color:var(--muted-on-light)]">
                Photo:{" "}
                {post.imageSource ? (
                  <a href={post.imageSource} className="underline" rel="noopener noreferrer">
                    {post.imageCredit}
                  </a>
                ) : (
                  post.imageCredit
                )}
                {post.imageLicense && (
                  <>
                    {" "}
                    · <a href={post.imageLicense} className="underline" rel="noopener noreferrer">License</a>
                  </>
                )}
                .{" "}
                {/* The disclaimer is only true of licensed stock. Printing it
                    under our own activation photography would be false. */}
                {post.imageRights === "owned"
                  ? "Photographed at a Collegiate Agency activation."
                  : "Illustrative campus photograph, not a Collegiate Agency activation or endorsement."}
              </p>
            )}
          </Container>
        </Section>

        <Section tone="light" className="pt-10">
          <Container className="max-w-3xl px-0">
            <div className="prose-custom space-y-6 text-base leading-relaxed text-[color:var(--muted-on-light)] [&_a]:font-semibold [&_a]:text-accent [&_a:hover]:underline [&_strong]:text-ink">
              {post.body.map((block, i) => (
                <Block key={i} block={block} />
              ))}
            </div>

            {/* Closing CTA: brand conversion first, service page second. */}
            <div className="mt-12 rounded-[4px] border-2 border-ink bg-[color:var(--accent)] p-6 text-white shadow-[8px_8px_0_var(--ink)] sm:p-8">
              <h2 className="font-display text-2xl font-bold">{cta.heading}</h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/90">{cta.blurb}</p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href={cta.primary.href}
                  className="brutal-press inline-flex shrink-0 items-center justify-center gap-1.5 rounded-[3px] border-2 border-ink bg-[color:var(--accent-2)] px-5 py-2.5 text-sm font-bold text-ink shadow-[4px_4px_0_var(--ink)]"
                >
                  {cta.primary.label} <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href={cta.secondary.href}
                  className="inline-flex shrink-0 items-center gap-1.5 text-sm font-bold text-white underline decoration-2 underline-offset-4"
                >
                  {cta.secondary.label}
                </Link>
              </div>
              {/* Students searching these same terms get a door of their own,
                  rather than being pushed through the brand funnel. */}
              <p className="mt-5 border-t-2 border-white/20 pt-4 text-xs text-white/70">
                Student, not a brand?{" "}
                <Link href="/become-an-ambassador" className="font-semibold text-white underline underline-offset-4">
                  Apply to the ambassador network
                </Link>
                .
              </p>
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
