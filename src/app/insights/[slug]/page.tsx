import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { PlaceholderImage } from "@/components/Placeholders";
import { CTASection } from "@/components/CTASection";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getPost, posts, formatDate } from "@/lib/content";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Article not found" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/insights/${slug}` },
    openGraph: { title: post.title, description: post.excerpt, type: "article" },
  };
}

export default async function InsightArticle({ params }: { params: Params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <>
      <ArticleJsonLd
        title={post.title}
        description={post.excerpt}
        slug={post.slug}
        date={post.date}
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
            <div className="mt-6 flex items-center gap-3 text-xs text-[color:var(--muted-on-light)]">
              <Badge>{post.category}</Badge>
              <span>{formatDate(post.date)}</span>
              <span>· {post.readingTime}</span>
            </div>
            <h1 className="mt-4 text-balance font-display text-4xl font-bold leading-[1.05] text-ink sm:text-5xl">
              {post.title}
            </h1>
            <p className="mt-4 text-lg text-[color:var(--muted-on-light)]">{post.excerpt}</p>
          </Container>
          <Container className="mt-10 max-w-4xl px-0">
            <PlaceholderImage label="Article hero image" index={0} aspect="aspect-[16/8]" />
          </Container>
        </Section>

        <Section tone="light" className="pt-10">
          <Container className="max-w-3xl px-0">
            <div className="prose-custom space-y-6 text-base leading-relaxed text-[color:var(--muted-on-light)]">
              <p className="rounded-xl border border-dashed border-[color:var(--border-on-light)] bg-surface-muted/60 p-4 text-sm">
                This is a placeholder article body. Replace it with real copy in{" "}
                <code className="rounded bg-white px-1.5 py-0.5 text-ink">
                  src/lib/content.ts
                </code>{" "}
                or wire the template to a CMS / MDX before launch.
              </p>
              <h2 className="font-display text-2xl font-bold text-ink">
                A subhead goes here
              </h2>
              <p>
                Body copy goes here. Keep the voice confident, culturally fluent, and
                benefit-led — the same tone as the rest of the site. Aim for real,
                useful perspective a brand marketer would actually forward to a colleague.
              </p>
              <p>
                Add supporting points, examples, and a takeaway. When you&apos;re ready to
                scale this out, swap this template for MDX files or a headless CMS and map
                the fields to the existing <code className="text-ink">Post</code> type.
              </p>
              <h2 className="font-display text-2xl font-bold text-ink">Another section</h2>
              <p>
                More placeholder body copy. The layout, typography, and metadata are all
                production-ready — only the words need to be written.
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
