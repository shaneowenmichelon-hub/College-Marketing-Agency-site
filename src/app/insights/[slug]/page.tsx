import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ArticleCtaCard, ArticleFooterCta } from "@/components/insights/ArticleCta";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { ArticleTable } from "@/components/article/ArticleTable";
import { ArticleFigure } from "@/components/article/ArticleFigure";
import { ArticleFaq, FaqPageJsonLd } from "@/components/services/ServiceFaq";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { articleFaqSchemaItems } from "@/lib/article-faq";
import { articleSocialImage, pageMetadata, resolveArticleAuthor } from "@/lib/seo";
import { getPost, posts, formatDate, type ArticleBlock, type Post } from "@/lib/content";
import { articleBreadcrumbItems, insightTopicPath, topicForPost } from "@/lib/insight-topics";
import { ArticleArt } from "@/components/insights/ArticleArt";
import { ArticleByline } from "@/components/insights/ArticleByline";

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
    secondary: { label: "How placement works", href: "/services/product-placement" },
  },
};

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) {
    return pageMetadata({
      title: "Article not found",
      description: "That article does not exist.",
      index: false,
    });
  }
  const description = post.metaDescription ?? post.excerpt;
  const image = articleSocialImage(post);
  return pageMetadata({
    title: post.metaTitle ?? post.title,
    description,
    path: `/insights/${slug}`,
    type: "article",
    publishedTime: post.date,
    modifiedTime: post.dateModified ?? post.date,
    authors: [resolveArticleAuthor(post.author).name],
    images: [image],
  });
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
    case "figure":
      return <ArticleFigure block={block} />;
  }
}

export default async function InsightArticle({ params }: { params: Params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const cta = SERVICE_CTA[post.ctaService];
  const topic = topicForPost(post);

  return (
    <>
      <ArticleJsonLd
        title={post.title}
        description={post.excerpt}
        slug={post.slug}
        date={post.date}
        dateModified={post.dateModified}
        image={post.image ?? post.ogImage}
        author={post.author}
      />
      {post.faq && post.faq.length > 0 && (
        <FaqPageJsonLd items={articleFaqSchemaItems(post.faq)} path={`/insights/${post.slug}`} />
      )}
      <BreadcrumbJsonLd items={articleBreadcrumbItems(post)} />
      <article>
        <Section tone="light" className="pb-0">
          <Container className="max-w-3xl px-0">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <Link
                href="/insights"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent"
              >
                <ArrowLeft className="h-4 w-4" /> All insights
              </Link>
              {topic ? (
                <Link
                  href={insightTopicPath(topic.slug)}
                  className="text-sm font-semibold text-accent hover:underline"
                >
                  {topic.breadcrumb}
                </Link>
              ) : null}
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-[color:var(--muted-on-light)]">
              <Badge>{post.category}</Badge>
              <span>{formatDate(post.date)}</span>
              <span>· {post.readingTime}</span>
            </div>
            <h1 className="mt-4 text-balance font-display text-4xl font-bold leading-[1.05] text-ink sm:text-5xl">
              {post.title}
            </h1>
            <p className="mt-4 text-lg text-[color:var(--muted-on-light)]">{post.excerpt}</p>
            <ArticleByline author={post.author} />
          </Container>
          <Container className="mt-10 max-w-4xl px-0">
            <div className="relative">
              <ArticleArt slug={post.slug} category={post.category} art={post.art} image={post.image} imageAlt={post.imageAlt} imageWidth={post.imageWidth} imageHeight={post.imageHeight} className="aspect-[16/8] w-full" />
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
            {(() => {
              const h2Indexes = post.body.flatMap((block, index) => (block.type === "h2" ? [index] : []));
              // After the second section when the article has one, otherwise after the first heading.
              const midAt = h2Indexes.length >= 3 ? h2Indexes[2] : h2Indexes.length >= 1 ? h2Indexes[0] + 1 : post.body.length;
              const prose =
                "prose-custom space-y-6 text-base leading-relaxed text-[color:var(--muted-on-light)] [&_a]:font-semibold [&_a]:text-accent [&_a:hover]:underline [&_strong]:text-ink";
              return (
                <>
                  <div className={prose}>
                    {post.body.slice(0, midAt).map((block, i) => (
                      <Block key={i} block={block} />
                    ))}
                  </div>
                  <ArticleCtaCard slug={post.slug} position="mid" cta={cta} />
                  <div className={prose}>
                    {post.body.slice(midAt).map((block, i) => (
                      <Block key={midAt + i} block={block} />
                    ))}
                    {post.faq && post.faq.length > 0 && (
                      <div id="faq" className="scroll-mt-24">
                        <h2 className="font-display text-2xl font-bold text-ink">Questions brands ask</h2>
                        <ArticleFaq items={post.faq} />
                      </div>
                    )}
                  </div>
                </>
              );
            })()}

            <ArticleCtaCard slug={post.slug} position="closing" cta={cta} />
          </Container>
        </Section>
      </article>

      <ArticleFooterCta slug={post.slug} />
    </>
  );
}
