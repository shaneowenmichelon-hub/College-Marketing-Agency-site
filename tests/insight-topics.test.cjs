const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

function resolveSrc(p) {
  for (const ext of ["", ".ts", ".tsx", "/index.ts", "/index.tsx"]) {
    if (fs.existsSync(p + ext) && fs.statSync(p + ext).isFile()) return p + ext;
  }
  throw new Error("cannot resolve: " + p);
}

function load(file) {
  const m = new module.constructor(file, module);
  m.filename = file;
  m.paths = module.paths;
  m.require = (id) =>
    id.startsWith("@/")
      ? load(resolveSrc(path.join(__dirname, "../src", id.slice(2))))
      : require(id);
  const compiled = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
  m._compile(compiled, file);
  return m.exports;
}

function loadTs(rel) {
  return load(resolveSrc(path.join(__dirname, "../src", rel.replace(/\.tsx?$/, ""))));
}

const RESERVED_PHRASE = /how to market to gen z/i;
const SERVICE_PATHS = new Set([
  "/services/brand-ambassadors",
  "/services/events",
  "/services/product-placement",
  "/pricing",
]);

test("topic hubs have unique titles, brand copy, and a safe unmapped fallback", () => {
  const { posts, getPost } = loadTs("lib/content.ts");
  const { resolveDocumentTitle, TITLE_LIMIT, pageMetadata } = loadTs("lib/seo.ts");
  const {
    insightTopics,
    insightTopicAssignments,
    insightTopicPath,
    postsForInsightTopic,
    topicForPost,
    articleBreadcrumbItems,
    insightTopicLastModified,
    INSIGHT_TOPICS_UPDATED,
  } = loadTs("lib/insight-topics.ts");
  const { assertInsightArticleSlug } = loadTs("lib/blog-files.ts");

  assert.equal(insightTopics.length, 6);
  assert.equal(insightTopics.some((topic) => /gen-?z/i.test(topic.slug)), false);

  const documentTitles = insightTopics.map((topic) => resolveDocumentTitle(topic.title).text);
  assert.equal(new Set(documentTitles).size, documentTitles.length);
  const articleTitles = new Set(posts.map((post) => resolveDocumentTitle(post.metaTitle ?? post.title).text));
  const pageTitles = [
    "Brand ambassador programs",
    "Campus event marketing",
    "Greek life product placement",
    "Campus marketing insights",
    "Campus marketing pricing",
    "Campus Marketing Services for Brands",
  ].map((lead) => resolveDocumentTitle(lead).text);

  for (const topic of insightTopics) {
    const title = resolveDocumentTitle(topic.title).text;
    assert.ok(title.length <= TITLE_LIMIT, `${title} (${title.length})`);
    assert.ok(title.includes("Collegiate Agency"), title);
    assert.equal(articleTitles.has(title), false, title);
    assert.equal(pageTitles.includes(title), false, title);
    assert.ok(topic.description.length > 40 && topic.description.length <= 160, `${topic.slug} ${topic.description.length}`);
    assert.match(topic.description, /Collegiate Agency/);
    assert.match(topic.intro, /brands hire/);
    assert.match(topic.intro, /college students/);
    const copy = [topic.title, topic.description, topic.heading, topic.intro, topic.breadcrumb, topic.navLabel, topic.serviceLabel, topic.ogTitle, topic.ogAccent].join("\n");
    assert.doesNotMatch(copy, RESERVED_PHRASE, topic.slug);
    assert.doesNotMatch(copy, /intern/i, topic.slug);
    assert.doesNotMatch(copy, /agency for students/i, topic.slug);
    assert.ok(SERVICE_PATHS.has(topic.serviceHref), topic.serviceHref);
    assert.equal(insightTopicPath(topic.slug), `/insights/topics/${topic.slug}`);
    assert.ok(postsForInsightTopic(topic.slug).length >= 1, topic.slug);
    const meta = pageMetadata({ title: topic.title, description: topic.description, path: insightTopicPath(topic.slug) });
    assert.equal(meta.title.absolute, title);
    assert.equal(meta.description, topic.description);
    assert.equal(meta.alternates.canonical, insightTopicPath(topic.slug));
    assert.equal(meta.openGraph.title.absolute, title);
    assert.equal(meta.openGraph.description, topic.description);
    assert.equal(meta.openGraph.url, `https://collegiateagency.com${insightTopicPath(topic.slug)}`);
    assert.equal(meta.twitter.title.absolute, title);
    assert.equal(meta.twitter.description, topic.description);
    assert.equal(meta.images, undefined);
  }

  const expected = {
    "brand-ambassador-programs": [
      "college-brand-ambassador-program",
      "college-brand-ambassadors",
      "student-ambassador-marketing",
      "student-brand-reps",
      "campus-ambassador-content-rights",
    ],
    "campus-events-and-activations": [
      "campus-activation-ideas",
      "university-activations",
      "campus-brand-activation-agency",
      "campus-event-accessibility-checklist",
      "campus-event-cancellation-policy",
      "campus-event-staffing-agency",
      "college-experiential-marketing-agency",
      "why-welcome-week-is-the-highest-leverage-moment-on-campus",
    ],
    "product-sampling-and-placement": [
      "campus-product-sampling-ideas",
      "on-campus-product-sampling",
      "college-welcome-bag-inserts",
      "campus-bookstore-product-placement",
      "greek-life-marketing-agency",
      "campus-product-launch",
    ],
    "student-influencers": ["campus-influencers", "student-influencer-marketing"],
    "campus-sponsorship": [
      "college-event-sponsorship",
      "college-festival-sponsorship",
      "college-tailgate-marketing-agency",
      "college-tour-marketing",
      "spring-break-marketing-agency",
    ],
    "campus-marketing-strategy": [
      "college-marketing-strategy",
      "how-to-market-to-college-students",
      "gen-z-marketing",
      "gen-z-experiential-marketing",
      "college-marketing-agency",
      "campus-marketing-agency-rfp",
      "switching-campus-marketing-agencies",
      "campus-field-marketing-agency",
      "student-housing-marketing-agency",
    ],
  };

  for (const [topicSlug, articles] of Object.entries(expected)) {
    for (const articleSlug of articles) {
      assert.equal(insightTopicAssignments[articleSlug], topicSlug, articleSlug);
      assert.equal(topicForPost(getPost(articleSlug)).slug, topicSlug);
    }
    assert.deepEqual(
      postsForInsightTopic(topicSlug).map((post) => post.slug).sort(),
      [...articles].sort(),
    );
  }

  assert.equal(topicForPost({ slug: "future-article-without-a-topic" }), undefined);
  assert.equal(topicForPost({ slug: "future-article-without-a-topic", topic: "not-a-hub" }), undefined);
  assert.equal(topicForPost({ slug: "future-article-without-a-topic", topic: "campus-sponsorship" }).slug, "campus-sponsorship");
  assert.equal(
    topicForPost({ slug: "college-brand-ambassadors", topic: "campus-sponsorship" }).slug,
    "campus-sponsorship",
  );

  const ambassador = getPost("college-brand-ambassadors");
  assert.deepEqual(
    articleBreadcrumbItems(ambassador).map((item) => item.path),
    ["/", "/insights", "/insights/topics/brand-ambassador-programs", "/insights/college-brand-ambassadors"],
  );
  assert.deepEqual(
    articleBreadcrumbItems({ slug: "future-article-without-a-topic", title: "Future" }).map((item) => item.name),
    ["Home", "Insights", "Future"],
  );

  assert.throws(() => assertInsightArticleSlug("topics", "topics.mdx"), /reserved slug/);
  assert.equal(posts.some((post) => post.slug === "topics"), false);
  assert.ok(insightTopicLastModified("campus-marketing-strategy") >= INSIGHT_TOPICS_UPDATED);

  const source = fs.readFileSync(path.join(__dirname, "../src/lib/insight-topics.ts"), "utf8");
  assert.doesNotMatch(source, RESERVED_PHRASE);
  const hubPage = fs.readFileSync(path.join(__dirname, "../src/app/insights/topics/[slug]/page.tsx"), "utf8");
  assert.equal(hubPage.includes("FaqPage"), false);
  assert.equal(hubPage.includes("FAQPage"), false);
  assert.match(hubPage, /CollectionPageJsonLd/);
  assert.match(hubPage, /BreadcrumbJsonLd/);
  assert.match(hubPage, /topic\.serviceHref/);
  const index = fs.readFileSync(path.join(__dirname, "../src/app/insights/page.tsx"), "utf8");
  assert.match(index, /insightTopics\.map/);
  assert.match(index, /insightTopicPath\(topic\.slug\)/);
  const article = fs.readFileSync(path.join(__dirname, "../src/app/insights/[slug]/page.tsx"), "utf8");
  assert.match(article, /articleBreadcrumbItems\(post\)/);
  assert.match(article, /insightTopicPath\(topic\.slug\)/);
  const publisher = fs.readFileSync(path.join(__dirname, "../scripts/collegiate_seo_autopublish.py"), "utf8");
  assert.match(publisher, /reserved-slug/);
});

test("sitemap, llms.txt, and llms-full.txt list every topic hub", async () => {
  const { default: sitemap } = loadTs("app/sitemap.ts");
  const { insightTopics, insightTopicPath, insightTopicLastModified } = loadTs("lib/insight-topics.ts");
  const byLoc = new Map(sitemap().map((entry) => [entry.url, entry]));

  for (const topic of insightTopics) {
    const url = `https://collegiateagency.com${insightTopicPath(topic.slug)}`;
    const entry = byLoc.get(url);
    assert.ok(entry, url);
    assert.equal(entry.lastModified.toISOString(), `${insightTopicLastModified(topic.slug)}T00:00:00.000Z`);
    assert.equal(entry.images, undefined);
  }

  const { GET } = loadTs("app/llms.txt/route.ts");
  const llms = await (await GET()).text();
  assert.match(llms, /## Insight topics/);
  for (const topic of insightTopics) {
    assert.match(llms, new RegExp(insightTopicPath(topic.slug).replace(/\//g, "\\/")));
  }
  assert.match(llms, /Topic: https:\/\/collegiateagency\.com\/insights\/topics\/brand-ambassador-programs/);

  const { GET: fullGet } = loadTs("app/llms-full.txt/route.ts");
  const full = await (await fullGet()).text();
  assert.match(full, /# Topic hubs/);
  for (const topic of insightTopics) {
    assert.match(full, new RegExp(`URL: https://collegiateagency\\.com${insightTopicPath(topic.slug).replace(/\//g, "\\/")}`));
  }
  assert.match(full, /Topic: https:\/\/collegiateagency\.com\/insights\/topics\/campus-marketing-strategy/);
  assert.doesNotMatch(full, RESERVED_PHRASE);
  assert.doesNotMatch(llms, RESERVED_PHRASE);
});

test("topic hub JSON-LD is CollectionPage, ItemList, and BreadcrumbList", () => {
  const React = require("react");
  const { renderToStaticMarkup } = require("react-dom/server");
  const { CollectionPageJsonLd, BreadcrumbJsonLd } = loadTs("components/seo/JsonLd.tsx");
  const { postsForInsightTopic, insightTopicPath, insightTopics } = loadTs("lib/insight-topics.ts");
  const { resolveDocumentTitle } = loadTs("lib/seo.ts");
  const topic = insightTopics.find((item) => item.slug === "student-influencers");
  const articles = postsForInsightTopic(topic.slug);
  const pathName = insightTopicPath(topic.slug);
  const html = renderToStaticMarkup(
    React.createElement(
      React.Fragment,
      null,
      React.createElement(CollectionPageJsonLd, {
        name: resolveDocumentTitle(topic.title).text,
        description: topic.description,
        path: pathName,
        items: articles.map((post) => ({ name: post.title, path: `/insights/${post.slug}` })),
      }),
      React.createElement(BreadcrumbJsonLd, {
        items: [
          { name: "Home", path: "/" },
          { name: "Insights", path: "/insights" },
          { name: topic.breadcrumb, path: pathName },
        ],
      }),
    ),
  );
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) =>
    JSON.parse(match[1]),
  );
  const collection = blocks.find((block) => block["@type"] === "CollectionPage");
  const crumbs = blocks.find((block) => block["@type"] === "BreadcrumbList");
  assert.ok(collection);
  assert.equal(collection.mainEntity["@type"], "ItemList");
  assert.equal(collection.mainEntity.itemListElement.length, articles.length);
  assert.deepEqual(
    collection.mainEntity.itemListElement.map((item) => item.url),
    articles.map((post) => `https://collegiateagency.com/insights/${post.slug}`),
  );
  assert.equal(collection["@type"] === "FAQPage", false);
  assert.equal(html.includes("FAQPage"), false);
  assert.deepEqual(
    crumbs.itemListElement.map((item) => item.item),
    [
      "https://collegiateagency.com/",
      "https://collegiateagency.com/insights",
      "https://collegiateagency.com/insights/topics/student-influencers",
    ],
  );
});
