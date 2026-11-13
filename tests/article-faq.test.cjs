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

function decode(html) {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

const FAQ_SLUGS = fs
  .readdirSync(path.join(__dirname, "../content/blog"))
  .filter((file) => file.endsWith(".mdx"))
  .map((file) => file.replace(/\.mdx$/, ""));

const LINK_SLUGS = {
  "campus-ambassador-content-rights": [
    ["/about", "Collegiate Agency"],
    ["/insights/college-brand-ambassador-program", "college brand ambassador program"],
    ["/pricing", "ambassador program rates"],
  ],
  "campus-brand-activation-agency": [
    ["/about", "Collegiate Agency"],
    ["/pricing", "pricing"],
    ["/insights/campus-marketing-agency-rfp", "campus marketing agency RFP checklist"],
    ["/services/product-placement", "product placement options"],
  ],
  "campus-event-accessibility-checklist": [
    ["/about", "Collegiate Agency"],
    ["/pricing", "pricing"],
    ["/insights/campus-brand-activation-agency", "campus brand activation agency checklist"],
  ],
  "campus-field-marketing-agency": [
    ["/about", "Collegiate Agency"],
    ["/pricing", "ambassador, placement, and event rates"],
    ["/insights/campus-brand-activation-agency", "campus brand activation agency checklist"],
  ],
};

const PAGE_FILES = {
  "/about": "src/app/about/page.tsx",
  "/pricing": "src/app/pricing/page.tsx",
  "/contact": "src/app/contact/page.tsx",
  "/services/events": "src/app/services/events/page.tsx",
  "/services/brand-ambassadors": "src/app/services/brand-ambassadors/page.tsx",
  "/services/product-placement": "src/app/services/product-placement/page.tsx",
};

test("commercial articles render one FAQPage whose text matches the visible FAQ", () => {
  const { getPost, posts } = loadTs("lib/content.ts");
  const { articleFaqSchemaItems } = loadTs("lib/article-faq.ts");
  const { ArticleFaq, FaqPageJsonLd } = loadTs("components/services/ServiceFaq.tsx");
  const React = require("react");
  const { renderToStaticMarkup } = require("react-dom/server");

  const withFaq = posts.filter((post) => post.faq?.length);
  assert.deepEqual(
    withFaq.map((post) => post.slug).sort(),
    [...FAQ_SLUGS].sort(),
  );

  const page = fs.readFileSync(path.join(__dirname, "../src/app/insights/[slug]/page.tsx"), "utf8");
  assert.equal(page.match(/<FaqPageJsonLd /g).length, 1);
  assert.match(page, /<ArticleFaq items=\{post\.faq\} \/>/);
  assert.match(page, /id="faq"/);

  for (const slug of FAQ_SLUGS) {
    const post = getPost(slug);
    assert.ok(post?.faq, slug);
    assert.ok(post.faq.length >= 3 && post.faq.length <= 5, slug);
    const buyerFaq = new Set([
      "college-marketing-agency",
      "campus-brand-activation-agency",
      "college-experiential-marketing-agency",
      "student-housing-marketing-agency",
      "campus-field-marketing-agency",
      "college-tour-marketing",
    ]);
    const backfill = new Set([
      "hbcu-marketing-agency",
      "campus-product-sampling-agency",
      "campus-pop-up-activation",
      "college-event-marketing-agency",
      "multi-campus-brand-activation",
      "college-creator-marketing-agency",
      "college-sports-marketing-agency",
      "finals-week-marketing",
      "back-to-school-campus-activation",
    ]);
    const strikingDistanceFaq = new Set([
      "campus-influencers",
      "university-activations",
      "college-event-sponsorship",
      "campus-product-launch",
      "on-campus-product-sampling",
    ]);
    const ctrTitleMetaRevised = new Set([
      "college-marketing-agency",
      "college-experiential-marketing-agency",
      "campus-brand-activation-agency",
    ]);
    const ctrWaveTwo = new Set([
      "college-tour-marketing",
      "campus-field-marketing-agency",
      "student-housing-marketing-agency",
    ]);
    const internalLinksRevised = new Set([
      "campus-ambassador-content-rights",
      "campus-brand-activation-agency",
      "campus-event-accessibility-checklist",
      "campus-field-marketing-agency",
      "college-experiential-marketing-agency",
      "greek-life-marketing-agency",
      "spring-break-marketing-agency",
      "student-housing-marketing-agency",
    ]);
    const pageOneCtr = new Set([
      "college-tailgate-marketing-agency",
      "campus-marketing-agency-rfp",
    ]);
    const faqBatchThree = new Set([
      "campus-product-sampling-ideas",
      "student-brand-reps",
      "college-brand-ambassadors",
      "campus-activation-ideas",
      "college-festival-sponsorship",
      "college-brand-ambassador-program",
    ]);
    const run44 = new Set(["college-app-marketing-agency"]);
    const revisedOn = run44.has(slug) || faqBatchThree.has(slug)
      ? "2026-11-13"
      : buyerFaq.has(slug)
      ? "2026-11-12"
      : backfill.has(slug)
      ? "2026-11-11"
      : strikingDistanceFaq.has(slug)
      ? "2026-11-11"
      : pageOneCtr.has(slug)
      ? "2026-11-10"
      : internalLinksRevised.has(slug)
      ? "2026-11-09"
      : ctrWaveTwo.has(slug)
        ? "2026-11-06"
        : ctrTitleMetaRevised.has(slug)
          ? "2026-11-03"
          : "2026-10-23";
    assert.equal(post.dateModified, revisedOn, slug);
    const schemaItems = articleFaqSchemaItems(post.faq);
    const html = renderToStaticMarkup(
      React.createElement(
        React.Fragment,
        null,
        React.createElement(FaqPageJsonLd, { items: schemaItems, path: `/insights/${slug}` }),
        React.createElement(ArticleFaq, { items: post.faq }),
      ),
    );
    const blocks = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || [];
    assert.equal(blocks.length, 1, `${slug} should emit one JSON-LD script`);
    assert.equal((html.match(/"@type":"FAQPage"/g) || []).length, 1, slug);
    const data = JSON.parse(blocks[0].replace(/^<script type="application\/ld\+json">/, "").replace(/<\/script>$/, ""));
    assert.equal(data["@type"], "FAQPage");
    assert.equal(data["@id"], `https://collegiateagency.com/insights/${slug}#faq`);
    assert.equal(data.mainEntity.length, post.faq.length);
    const questions = [...html.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/g)].map((match) => decode(match[1]));
    const answers = [...html.matchAll(/<dd[^>]*>([\s\S]*?)<\/dd>/g)].map((match) => decode(match[1]));
    assert.deepEqual(questions, post.faq.map((item) => item.question));
    data.mainEntity.forEach((entity, index) => {
      assert.equal(entity["@type"], "Question");
      assert.equal(entity.name, questions[index]);
      assert.equal(entity.acceptedAnswer.text, answers[index]);
      assert.equal(entity.acceptedAnswer.text, schemaItems[index].answer);
      const words = entity.acceptedAnswer.text.split(/\s+/).filter(Boolean);
      assert.ok(words.length >= 40 && words.length <= 80, `${slug} ${entity.name} (${words.length})`);
      assert.match(entity.acceptedAnswer.text, /Collegiate Agency/);
      assert.doesNotMatch(
        entity.acceptedAnswer.text,
        /Celsius|NÜTRL|NUTRL|SOS Consultants|11x|1,200|100K|testimonial|years of/i,
      );
    });
  }
});

test("striking-distance articles render one FAQPage whose Q&A matches the visible FAQ", () => {
  const { getPost } = loadTs("lib/content.ts");
  const { articleFaqSchemaItems } = loadTs("lib/article-faq.ts");
  const { insightTopicLastModified } = loadTs("lib/insight-topics.ts");
  const { ArticleFaq, FaqPageJsonLd } = loadTs("components/services/ServiceFaq.tsx");
  const { default: sitemap } = loadTs("app/sitemap.ts");
  const React = require("react");
  const { renderToStaticMarkup } = require("react-dom/server");
  const page = fs.readFileSync(path.join(__dirname, "../src/app/insights/[slug]/page.tsx"), "utf8");
  assert.equal(page.match(/<FaqPageJsonLd /g).length, 1);
  assert.match(page, /<ArticleFaq items=\{post\.faq\} \/>/);

  const slugs = {
    "campus-influencers": [
      /how do you do influencer marketing for college students/i,
      /campus influencers/i,
      /campus creators/i,
    ],
    "university-activations": [/campus activations/i, /on-campus activation/i, /university activation/i],
    "college-event-sponsorship": [/college event sponsorship/i, /sponsorship for college events/i],
    "campus-product-launch": [/campus product launch/i, /campus launch/i],
    "on-campus-product-sampling": [/student product sampling/i, /student product samples/i],
  };
  const hubs = {
    "student-influencers": "2026-11-11",
    "campus-events-and-activations": "2026-11-13",
    "campus-sponsorship": "2026-11-13",
    "product-sampling-and-placement": "2026-11-13",
    "campus-marketing-strategy": "2026-11-13",
  };

  const byLoc = new Map(sitemap().map((entry) => [entry.url, entry]));
  assert.equal(byLoc.get("https://collegiateagency.com/insights").lastModified.toISOString(), "2026-11-13T00:00:00.000Z");
  for (const [topic, stamp] of Object.entries(hubs)) {
    assert.equal(insightTopicLastModified(topic), stamp, topic);
    assert.equal(
      byLoc.get(`https://collegiateagency.com/insights/topics/${topic}`).lastModified.toISOString(),
      `${stamp}T00:00:00.000Z`,
      topic,
    );
  }
  assert.equal(getPost("gen-z-marketing").dateModified, "2026-10-23");
  assert.equal(getPost("gen-z-experiential-marketing").dateModified, "2026-10-23");

  for (const [slug, patterns] of Object.entries(slugs)) {
    const post = getPost(slug);
    assert.ok(post?.faq, slug);
    assert.ok(post.faq.length >= 4 && post.faq.length <= 6, `${slug} ${post.faq.length}`);
    assert.equal(post.dateModified, "2026-11-11", slug);
    assert.equal(post.date === "2026-11-11", false, slug);
    const schemaItems = articleFaqSchemaItems(post.faq);
    const html = renderToStaticMarkup(
      React.createElement(
        React.Fragment,
        null,
        React.createElement(FaqPageJsonLd, { items: schemaItems, path: `/insights/${slug}` }),
        React.createElement(ArticleFaq, { items: post.faq }),
      ),
    );
    const blocks = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || [];
    assert.equal(blocks.length, 1, slug);
    assert.equal((html.match(/"@type":"FAQPage"/g) || []).length, 1, slug);
    const data = JSON.parse(blocks[0].replace(/^<script type="application\/ld\+json">/, "").replace(/<\/script>$/, ""));
    assert.equal(data["@type"], "FAQPage");
    assert.equal(data["@id"], `https://collegiateagency.com/insights/${slug}#faq`);
    assert.equal(data.mainEntity.length, post.faq.length);
    const questions = [...html.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/g)].map((match) => decode(match[1]));
    const answers = [...html.matchAll(/<dd[^>]*>([\s\S]*?)<\/dd>/g)].map((match) => decode(match[1]));
    assert.deepEqual(questions, post.faq.map((item) => item.question));
    assert.deepEqual(answers, schemaItems.map((item) => item.answer));
    data.mainEntity.forEach((entity, index) => {
      assert.equal(entity.name, questions[index]);
      assert.equal(entity.acceptedAnswer.text, answers[index]);
    });
    const visible = `${questions.join(" ")} ${answers.join(" ")}`;
    for (const pattern of patterns) assert.match(visible, pattern, slug);
    assert.equal(
      byLoc.get(`https://collegiateagency.com/insights/${slug}`).lastModified.toISOString(),
      "2026-11-11T00:00:00.000Z",
      slug,
    );
  }
});

test("next striking-distance articles render one FAQPage from the rewritten FAQ", () => {
  const { getPost } = loadTs("lib/content.ts");
  const { articleFaqSchemaItems } = loadTs("lib/article-faq.ts");
  const { insightTopicLastModified } = loadTs("lib/insight-topics.ts");
  const { ArticleFaq, FaqPageJsonLd } = loadTs("components/services/ServiceFaq.tsx");
  const { default: sitemap } = loadTs("app/sitemap.ts");
  const React = require("react");
  const { renderToStaticMarkup } = require("react-dom/server");
  const page = fs.readFileSync(path.join(__dirname, "../src/app/insights/[slug]/page.tsx"), "utf8");
  assert.equal(page.match(/<FaqPageJsonLd /g).length, 1);
  assert.equal(page.match(/<ArticleFaq /g).length, 1);

  const slugs = {
    "college-marketing-agency": [
      /college marketing agency/i,
      /agency college marketing/i,
      /campus marketing agency/i,
      /college ad agency/i,
      /campus marketing providers should brands compare for college campaigns/i,
    ],
    "campus-brand-activation-agency": [
      /brand activation agency that specializes in universities and colleges/i,
      /campus brand activation agency/i,
      /campus activation/i,
      /on-campus activation/i,
      /experiential brand activation for universities/i,
    ],
    "college-experiential-marketing-agency": [
      /experiential marketing in college campuses/i,
      /college experiential marketing agency/i,
      /college experiential marketing/i,
    ],
    "student-housing-marketing-agency": [
      /student housing marketing company/i,
      /student housing marketing agency/i,
      /student housing online marketing/i,
      /student housing digital marketing/i,
    ],
    "campus-field-marketing-agency": [/campus marketing specialists/i, /campus field marketing/i],
    "college-tour-marketing": [/college tour marketing/i, /10-campus tour/i, /localized creative/i, /short-run retail/i],
  };
  const published = {
    "college-marketing-agency": "2026-07-29",
    "campus-brand-activation-agency": "2026-10-13",
    "college-experiential-marketing-agency": "2026-10-20",
    "student-housing-marketing-agency": "2026-10-26",
    "campus-field-marketing-agency": "2026-10-15",
    "college-tour-marketing": "2026-08-14",
  };
  const hubs = {
    "campus-events-and-activations": "2026-11-13",
    "campus-sponsorship": "2026-11-13",
    "campus-marketing-strategy": "2026-11-13",
    "student-influencers": "2026-11-11",
    "product-sampling-and-placement": "2026-11-13",
  };

  const byLoc = new Map(sitemap().map((entry) => [entry.url, entry]));
  assert.equal(byLoc.get("https://collegiateagency.com/insights").lastModified.toISOString(), "2026-11-13T00:00:00.000Z");
  for (const [topic, stamp] of Object.entries(hubs)) {
    assert.equal(insightTopicLastModified(topic), stamp, topic);
    assert.equal(
      byLoc.get(`https://collegiateagency.com/insights/topics/${topic}`).lastModified.toISOString(),
      `${stamp}T00:00:00.000Z`,
      topic,
    );
  }

  for (const [slug, patterns] of Object.entries(slugs)) {
    const post = getPost(slug);
    assert.ok(post?.faq, slug);
    assert.equal(post.faq.length, 5, slug);
    assert.equal(post.dateModified, "2026-11-12", slug);
    assert.equal(post.date, published[slug], slug);
    assert.equal(post.author, "Shane Michelon", slug);
    const schemaItems = articleFaqSchemaItems(post.faq);
    const html = renderToStaticMarkup(
      React.createElement(
        React.Fragment,
        null,
        React.createElement(FaqPageJsonLd, { items: schemaItems, path: `/insights/${slug}` }),
        React.createElement(ArticleFaq, { items: post.faq }),
      ),
    );
    const blocks = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || [];
    assert.equal(blocks.length, 1, slug);
    assert.equal((html.match(/"@type":"FAQPage"/g) || []).length, 1, slug);
    const data = JSON.parse(blocks[0].replace(/^<script type="application\/ld\+json">/, "").replace(/<\/script>$/, ""));
    assert.equal(data["@type"], "FAQPage");
    assert.equal(data["@id"], `https://collegiateagency.com/insights/${slug}#faq`);
    assert.equal(data.mainEntity.length, post.faq.length);
    const questions = [...html.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/g)].map((match) => decode(match[1]));
    const answers = [...html.matchAll(/<dd[^>]*>([\s\S]*?)<\/dd>/g)].map((match) => decode(match[1]));
    assert.deepEqual(questions, post.faq.map((item) => item.question));
    assert.deepEqual(answers, schemaItems.map((item) => item.answer));
    data.mainEntity.forEach((entity, index) => {
      assert.equal(entity.name, questions[index]);
      assert.equal(entity.acceptedAnswer.text, answers[index]);
    });
    const visible = `${questions.join(" ")} ${answers.join(" ")}`;
    for (const pattern of patterns) assert.match(visible, pattern, slug);
    assert.doesNotMatch(visible, /1,000|intern|agency for students/i, slug);
    assert.equal(
      byLoc.get(`https://collegiateagency.com/insights/${slug}`).lastModified.toISOString(),
      "2026-11-12T00:00:00.000Z",
      slug,
    );
  }

  const tour = getPost("college-tour-marketing");
  const tourText = tour.faq.map((item) => `${item.question} ${item.answer}`).join(" ");
  assert.match(tourText, /does not publish a 10-campus tour package or a daily attendee capacity/i);
  assert.match(tourText, /does not publish a separate short-run retail activation package/i);
  assert.match(tourText, /four campuses/);
});

test("third striking-distance batch renders one FAQPage from the rewritten FAQ", () => {
  const { getPost } = loadTs("lib/content.ts");
  const { articleFaqSchemaItems } = loadTs("lib/article-faq.ts");
  const { insightTopicLastModified } = loadTs("lib/insight-topics.ts");
  const { servicePageSeo } = loadTs("lib/service-faqs.ts");
  const { ArticleFaq, FaqPageJsonLd } = loadTs("components/services/ServiceFaq.tsx");
  const { default: sitemap } = loadTs("app/sitemap.ts");
  const React = require("react");
  const { renderToStaticMarkup } = require("react-dom/server");
  const page = fs.readFileSync(path.join(__dirname, "../src/app/insights/[slug]/page.tsx"), "utf8");
  const eventsPage = fs.readFileSync(path.join(__dirname, "../src/app/services/events/page.tsx"), "utf8");
  const servicePage = fs.readFileSync(path.join(__dirname, "../src/components/services/ServicePage.tsx"), "utf8");
  assert.equal(page.match(/<FaqPageJsonLd /g).length, 1);
  assert.equal(page.match(/<ArticleFaq /g).length, 1);
  assert.equal(eventsPage.match(/<FaqPageJsonLd /g) || [].length, 0);
  assert.equal(servicePage.match(/<FaqPageJsonLd /g).length, 1);

  const slugs = {
    "campus-product-sampling-ideas": [
      /campus product sampling ideas/i,
      /product sampling at a university/i,
      /on-campus product sampling agency/i,
      /college sampling programs/i,
      /campus product sampling/i,
    ],
    "student-brand-reps": [/student brand reps/i, /field brief/i, /30 days/i],
    "college-brand-ambassadors": [
      /college brand ambassadors/i,
      /campus brand ambassadors/i,
      /brand ambassador for college students/i,
    ],
    "campus-activation-ideas": [
      /campus activation ideas/i,
      /campus activation mean/i,
      /college campus activation/i,
      /school activation campaigns/i,
    ],
    "college-festival-sponsorship": [
      /sponsors for a college fest/i,
      /festival sponsorship activations/i,
      /college fest sponsorship/i,
      /college festival sponsorship/i,
    ],
    "college-brand-ambassador-program": [
      /collegiate ambassador programs/i,
      /collegiate ambassador/i,
      /paid college ambassador programs/i,
      /campus ambassador programs/i,
      /paid ambassador program/i,
    ],
  };
  const published = {
    "campus-product-sampling-ideas": "2026-08-26",
    "student-brand-reps": "2026-08-03",
    "college-brand-ambassadors": "2026-08-12",
    "campus-activation-ideas": "2026-09-03",
    "college-festival-sponsorship": "2026-08-30",
    "college-brand-ambassador-program": "2026-08-24",
  };
  const hubs = {
    "brand-ambassador-programs": "2026-11-13",
    "campus-events-and-activations": "2026-11-13",
    "product-sampling-and-placement": "2026-11-13",
    "campus-sponsorship": "2026-11-13",
    "campus-marketing-strategy": "2026-11-13",
    "student-influencers": "2026-11-11",
  };

  const byLoc = new Map(sitemap().map((entry) => [entry.url, entry]));
  assert.equal(byLoc.get("https://collegiateagency.com/insights").lastModified.toISOString(), "2026-11-13T00:00:00.000Z");
  assert.equal(
    byLoc.get("https://collegiateagency.com/services/events").lastModified.toISOString(),
    "2026-11-13T00:00:00.000Z",
  );
  for (const [topic, stamp] of Object.entries(hubs)) {
    assert.equal(insightTopicLastModified(topic), stamp, topic);
    assert.equal(
      byLoc.get(`https://collegiateagency.com/insights/topics/${topic}`).lastModified.toISOString(),
      `${stamp}T00:00:00.000Z`,
      topic,
    );
  }
  assert.equal(getPost("gen-z-marketing").dateModified, "2026-10-23");
  assert.equal(getPost("gen-z-experiential-marketing").dateModified, "2026-10-23");
  assert.equal(getPost("hbcu-marketing-agency").dateModified, "2026-11-11");
  assert.equal(getPost("campus-product-sampling-agency").dateModified, "2026-11-11");

  for (const [slug, patterns] of Object.entries(slugs)) {
    const post = getPost(slug);
    assert.ok(post?.faq, slug);
    assert.equal(post.faq.length, 5, slug);
    assert.equal(post.dateModified, "2026-11-13", slug);
    assert.equal(post.date, published[slug], slug);
    assert.equal(post.author, "Shane Michelon", slug);
    const source = fs.readFileSync(path.join(__dirname, `../content/blog/${slug}.mdx`), "utf8");
    assert.match(source, /^author: Collegiate Agency$/m, slug);
    const schemaItems = articleFaqSchemaItems(post.faq);
    const html = renderToStaticMarkup(
      React.createElement(
        React.Fragment,
        null,
        React.createElement(FaqPageJsonLd, { items: schemaItems, path: `/insights/${slug}` }),
        React.createElement(ArticleFaq, { items: post.faq }),
      ),
    );
    const blocks = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || [];
    assert.equal(blocks.length, 1, slug);
    assert.equal((html.match(/"@type":"FAQPage"/g) || []).length, 1, slug);
    const data = JSON.parse(blocks[0].replace(/^<script type="application\/ld\+json">/, "").replace(/<\/script>$/, ""));
    assert.equal(data["@type"], "FAQPage");
    assert.equal(data["@id"], `https://collegiateagency.com/insights/${slug}#faq`);
    assert.equal(data.mainEntity.length, post.faq.length);
    const questions = [...html.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/g)].map((match) => decode(match[1]));
    const answers = [...html.matchAll(/<dd[^>]*>([\s\S]*?)<\/dd>/g)].map((match) => decode(match[1]));
    assert.deepEqual(questions, post.faq.map((item) => item.question));
    assert.deepEqual(answers, schemaItems.map((item) => item.answer));
    data.mainEntity.forEach((entity, index) => {
      assert.equal(entity.name, questions[index]);
      assert.equal(entity.acceptedAnswer.text, answers[index]);
    });
    const visible = `${questions.join(" ")} ${answers.join(" ")}`;
    for (const pattern of patterns) assert.match(visible, pattern, slug);
    assert.doesNotMatch(visible, /1,000|intern|agency for students/i, slug);
    assert.equal(
      byLoc.get(`https://collegiateagency.com/insights/${slug}`).lastModified.toISOString(),
      "2026-11-13T00:00:00.000Z",
      slug,
    );
  }

  const events = servicePageSeo("events");
  assert.equal(events.faqs.length, 5);
  const eventVisible = events.faqs.map((item) => `${item.question} ${item.answer}`).join(" ");
  for (const pattern of [
    /campus activations/i,
    /on-campus activation/i,
    /college event marketing/i,
    /college activations/i,
    /university activation/i,
    /school activations/i,
    /sponsorship for college events/i,
    /end-to-end brand activation programs for higher education institutions/i,
  ]) {
    assert.match(eventVisible, pattern);
  }
  assert.doesNotMatch(eventVisible, /intern|agency for students/i);
  const eventHtml = renderToStaticMarkup(
    React.createElement(FaqPageJsonLd, { items: events.faqs, path: "/services/events" }),
  );
  assert.equal((eventHtml.match(/"@type":"FAQPage"/g) || []).length, 1);
});

test("newly linked articles point at routes that exist", () => {
  const { getPost } = loadTs("lib/content.ts");
  for (const [slug, expected] of Object.entries(LINK_SLUGS)) {
    const post = getPost(slug);
    assert.ok(post, slug);
    const html = post.body
      .map((block) => {
        if (block.type === "p") return block.html;
        if (block.type === "ul" || block.type === "ol") return block.items.join(" ");
        if (block.type === "table") return [...block.columns, ...block.rows.flat()].join(" ");
        return "";
      })
      .join("\n");
    const links = [...html.matchAll(/<a href="([^"]+)">([\s\S]*?)<\/a>/g)].map((match) => ({
      href: match[1],
      anchor: decode(match[2]),
    }));
    for (const [href, anchor] of expected) {
      assert.ok(
        links.some((link) => link.href === href && link.anchor === anchor),
        `${slug} missing ${href} (${anchor})`,
      );
      if (href.startsWith("/insights/")) {
        assert.ok(getPost(href.slice("/insights/".length)), href);
      } else {
        const file = PAGE_FILES[href];
        assert.ok(file, href);
        assert.ok(fs.existsSync(path.join(__dirname, "..", file)), href);
      }
    }
  }
});
