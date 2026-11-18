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
    id.startsWith("@/") ? load(resolveSrc(path.join(__dirname, "../src", id.slice(2)))) : require(id);
  const compiled = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  m._compile(compiled, file);
  return m.exports;
}

function loadTs(rel) {
  return load(resolveSrc(path.join(__dirname, "../src", rel.replace(/\.tsx?$/, ""))));
}

function jsonLdBlocks(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) =>
    JSON.parse(match[1]),
  );
}

function bodyText(post) {
  return post.body
    .map((block) => {
      if (block.type === "p" || block.type === "h2") return block.html || block.text || "";
      if (block.type === "ul" || block.type === "ol") return block.items.join(" ");
      if (block.type === "table") return [block.caption || "", ...block.columns, ...block.rows.flat()].join(" ");
      return "";
    })
    .join("\n");
}

function linksIn(html) {
  return [...html.matchAll(/<a href="([^"]+)">([\s\S]*?)<\/a>/g)].map((match) => ({
    href: match[1],
    anchor: match[2].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim(),
  }));
}

const SHORT_ANSWER_SLUGS = [
  "college-marketing-agency",
  "campus-influencers",
  "campus-brand-activation-agency",
  "university-activations",
  "college-experiential-marketing-agency",
  "college-event-sponsorship",
  "student-housing-marketing-agency",
  "campus-product-launch",
  "on-campus-product-sampling",
  "college-tailgate-marketing-agency",
  "campus-marketing-agency-rfp",
];

const MONEY_SHORT_ANSWER =
  "A college marketing agency is a firm brands hire to reach university students on campus. It chooses the schools, staffs events and sampling, runs a vetted brand ambassador program, and reports results. Collegiate Agency is a New York college marketing agency with published rates: $150 per ambassador per month, $1,500 per sorority (chapter) for product placement, and event packages from $500 to $500,000.";

test("short answers render once, stay 40-70 words, and only use digits already on the site", () => {
  const { renderToStaticMarkup } = require("react-dom/server");
  const { createElement } = require("react");
  const { getPost } = loadTs("lib/content.ts");
  const { shortAnswerWordCount } = loadTs("lib/blog-files.ts");
  const { ArticleShortAnswer } = loadTs("components/insights/ArticleShortAnswer.tsx");
  const { ArticleJsonLd } = loadTs("components/seo/JsonLd.tsx");
  const { FaqPageJsonLd } = loadTs("components/services/ServiceFaq.tsx");
  const { articleFaqSchemaItems } = loadTs("lib/article-faq.ts");
  const siteConfigSource = fs.readFileSync(path.join(__dirname, "../src/site.config.ts"), "utf8");
  const page = fs.readFileSync(path.join(__dirname, "../src/app/insights/[slug]/page.tsx"), "utf8");

  assert.equal(page.match(/<ArticleShortAnswer /g).length, 1);
  assert.equal(page.includes("abstract={post.shortAnswer}"), true);
  assert.equal(page.includes("FaqPageJsonLd items={articleFaqSchemaItems(post.faq)}"), true);
  assert.equal(page.includes("shortAnswer") && page.includes("FaqPageJsonLd"), true);
  assert.equal(/FaqPageJsonLd[^>]*shortAnswer/.test(page), false);

  for (const slug of SHORT_ANSWER_SLUGS) {
    const post = getPost(slug);
    assert.ok(post.shortAnswer, slug);
    const words = shortAnswerWordCount(post.shortAnswer);
    assert.ok(words >= 40 && words <= 70, `${slug} ${words}`);
    assert.equal((post.shortAnswer.match(/Collegiate Agency/g) || []).length, 1, slug);
    assert.doesNotMatch(post.shortAnswer, /intern|student-run|student run/i, slug);
    const first = post.shortAnswer.split(/(?<=[.!?])\s+/)[0];
    assert.match(first.toLowerCase(), new RegExp(post.primaryKeyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), slug);
    assert.match(first, /\b(is|are)\b/, slug);

    const source = fs.readFileSync(path.join(__dirname, `../content/blog/${slug}.mdx`), "utf8");
    const body = source.replace(/^---[\s\S]*?---\n?/, "");
    const allowed = `${siteConfigSource}\n${body}`;
    for (const token of post.shortAnswer.match(/\d[\d,]*/g) || []) {
      assert.equal(allowed.includes(token), true, `${slug} digit ${token} is not in site.config or the page body`);
    }
    assert.equal(body.includes(post.shortAnswer), false, `${slug} short answer is frontmatter, not repeated in the body`);

    const html = renderToStaticMarkup(createElement(ArticleShortAnswer, { text: post.shortAnswer }));
    assert.equal((html.match(/Short answer/g) || []).length, 1, slug);
    assert.equal((html.match(new RegExp(post.shortAnswer.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length, 1, slug);
    assert.match(html, /border-l-2/);
    assert.match(html, /border-ink\/30/);

    const article = jsonLdBlocks(
      renderToStaticMarkup(
        createElement(ArticleJsonLd, {
          title: post.title,
          description: post.excerpt,
          slug: post.slug,
          date: post.date,
          dateModified: post.dateModified,
          author: post.author,
          abstract: post.shortAnswer,
        }),
      ),
    );
    assert.equal(article.length, 1, slug);
    assert.equal(article[0].abstract, post.shortAnswer, slug);
    assert.equal(article[0].dateModified, post.dateModified ?? post.date, slug);

    const faq = jsonLdBlocks(
      renderToStaticMarkup(
        createElement(FaqPageJsonLd, {
          items: articleFaqSchemaItems(post.faq),
          path: `/insights/${slug}`,
        }),
      ),
    );
    assert.equal(faq.length, 1, slug);
    assert.equal(faq[0]["@type"], "FAQPage", slug);
    assert.equal("abstract" in faq[0], false, slug);
    assert.equal(
      faq[0].mainEntity.some((item) => item.name === "Short answer" || item.acceptedAnswer.text === post.shortAnswer),
      false,
      slug,
    );
  }

  assert.equal(getPost("college-marketing-agency").shortAnswer, MONEY_SHORT_ANSWER);
  assert.equal(getPost("college-marketing-agency").title, "College Marketing Agency: How to Choose One");
});

test("buyer checklists and existing timelines render as real tables", () => {
  const { getPost } = loadTs("lib/content.ts");
  const { renderToStaticMarkup } = require("react-dom/server");
  const { createElement } = require("react");
  const { ArticleTable } = loadTs("components/article/ArticleTable.tsx");
  const money = getPost("college-marketing-agency");
  const moneyTable = money.body.find((block) => block.type === "table");
  assert.equal(moneyTable.caption, "Questions to ask a college marketing agency, with strong answers and red flags");
  assert.deepEqual(moneyTable.columns, ["Question", "Strong answer", "Red flag"]);
  assert.equal(moneyTable.rows.length, 6);
  assert.equal(moneyTable.rows[0][0], "Which campuses would you prioritize first?");
  assert.match(moneyTable.rows[0][2], /anywhere/);

  const rfp = getPost("campus-marketing-agency-rfp");
  const rfpTable = rfp.body.find((block) => block.type === "table");
  assert.deepEqual(rfpTable.columns, ["Section", "What to ask for", "Why it matters"]);
  assert.equal(rfpTable.rows.length, 8);
  assert.equal(rfpTable.rows[0][0], "Audience and setting");
  assert.match(rfpTable.rows[7][2], /cancellation terms/);
  assert.match(rfpTable.rows[7][2], /href="\/insights\/campus-event-cancellation-policy"/);

  const calendar = getPost("how-to-market-to-college-students").body.find((block) => block.type === "table");
  assert.deepEqual(calendar.columns, ["Window", "What to do"]);
  assert.equal(calendar.rows.length, 6);
  assert.equal(calendar.rows[0][0], "Welcome week and move-in");

  const moments = getPost("gen-z-experiential-marketing").body.find((block) => block.type === "table");
  assert.deepEqual(moments.columns, ["Moment", "Why it fits"]);
  assert.equal(moments.rows.length, 4);
  assert.match(moments.rows[2][1], /college festival sponsorship/);

  const html = renderToStaticMarkup(createElement(ArticleTable, { block: moneyTable }));
  assert.match(html, /overflow-x-auto/);
  assert.match(html, /tabIndex="0"|tabindex="0"/);
  assert.match(html, /<table/);
  const scroller = fs.readFileSync(path.join(__dirname, "../src/components/article/TableScroller.tsx"), "utf8");
  assert.match(scroller, /overflow-x-auto/);
});

test("question headings on the money page keep the section and the case-study links", () => {
  const { getPost } = loadTs("lib/content.ts");
  const post = getPost("college-marketing-agency");
  const headings = post.body.filter((block) => block.type === "h2").map((block) => block.text);
  assert.ok(headings.includes("How do you check whether a college marketing agency has real campus access?"));
  assert.ok(headings.includes("Which campus channel fits your goal: events, ambassadors or influencers?"));
  assert.ok(headings.includes("How long does a campus campaign take to launch?"));
  assert.equal(headings.includes("Check whether the agency has real campus access"), false);
  assert.equal(headings.includes("Compare the three main channels"), false);
  assert.equal(headings.includes("A practical 30-day campus campaign timeline"), false);
  const html = bodyText(post);
  assert.match(html, /SOS Consultants Nola case study/);
  assert.match(html, /NÜTRL Night School tour case study/);
  assert.match(html, /Days 1–5: Strategy and market selection|Days 1-5: Strategy and market selection/);
});

test("updated dates use the same value as JSON-LD dateModified on insights and work", () => {
  const { renderToStaticMarkup } = require("react-dom/server");
  const { createElement } = require("react");
  const { getPost, getCaseStudy, formatDate } = loadTs("lib/content.ts");
  const { ArticleByline } = loadTs("components/insights/ArticleByline.tsx");
  const { ArticleJsonLd } = loadTs("components/seo/JsonLd.tsx");
  const { CaseStudyArticleJsonLd } = loadTs("components/seo/CaseStudyJsonLd.tsx");

  const post = getPost("college-marketing-agency");
  assert.ok(post.dateModified > post.date);
  const byline = renderToStaticMarkup(
    createElement(ArticleByline, {
      author: post.author,
      date: post.date,
      dateModified: post.dateModified,
    }),
  );
  assert.match(byline, new RegExp(`<time dateTime="${post.date}">${formatDate(post.date)}</time>`));
  assert.match(
    byline,
    new RegExp(`<time dateTime="${post.dateModified}">Updated ${formatDate(post.dateModified)}</time>`),
  );
  const article = jsonLdBlocks(
    renderToStaticMarkup(
      createElement(ArticleJsonLd, {
        title: post.title,
        description: post.excerpt,
        slug: post.slug,
        date: post.date,
        dateModified: post.dateModified,
        author: post.author,
      }),
    ),
  );
  assert.equal(article[0].dateModified, post.dateModified);
  assert.match(byline, new RegExp(`dateTime="${article[0].dateModified}"`));

  const sameDay = renderToStaticMarkup(
    createElement(ArticleByline, { author: post.author, date: "2026-11-18", dateModified: "2026-11-18" }),
  );
  assert.equal(sameDay.includes("Updated"), false);

  const nutrl = getCaseStudy("nutrl-night-school-tour-product-placement");
  const workByline = renderToStaticMarkup(
    createElement(ArticleByline, {
      showAuthor: false,
      date: nutrl.date,
      dateModified: nutrl.dateModified,
      tone: "dark",
    }),
  );
  const workLd = jsonLdBlocks(renderToStaticMarkup(createElement(CaseStudyArticleJsonLd, { study: nutrl })));
  assert.equal(workLd[0].dateModified, nutrl.dateModified);
  assert.match(workByline, new RegExp(`<time dateTime="${workLd[0].dateModified}">Updated ${formatDate(nutrl.dateModified)}</time>`));
  assert.equal(workByline.includes("Shane Michelon"), false);

  const sos = getCaseStudy("sos-consultants-nola-campus-leasing-ambassadors");
  const sosByline = renderToStaticMarkup(
    createElement(ArticleByline, { showAuthor: false, date: sos.date, dateModified: sos.dateModified, tone: "dark" }),
  );
  const sosLd = jsonLdBlocks(renderToStaticMarkup(createElement(CaseStudyArticleJsonLd, { study: sos })));
  assert.equal(sosLd[0].dateModified, sos.dateModified);
  assert.match(sosByline, new RegExp(`dateTime="${sos.date}"`));
  assert.match(
    sosByline,
    new RegExp(`<time dateTime="${sosLd[0].dateModified}">Updated ${formatDate(sos.dateModified)}</time>`),
  );

  const workPage = fs.readFileSync(path.join(__dirname, "../src/app/work/[slug]/page.tsx"), "utf8");
  assert.match(workPage, /<ArticleByline showAuthor=\{false\} date=\{c\.date\} dateModified=\{c\.dateModified\}/);
  const insightPage = fs.readFileSync(path.join(__dirname, "../src/app/insights/[slug]/page.tsx"), "utf8");
  assert.match(insightPage, /<ArticleByline author=\{post\.author\} date=\{post\.date\} dateModified=\{post\.dateModified\}/);
});

test("two varied inlinks point at each wave-2 target, and the exact agency anchor stays on the money page", () => {
  const { posts } = loadTs("lib/content.ts");
  const targets = {
    "multi-campus-brand-activation": "multi-campus brand activation",
    "college-event-marketing-agency": "college event marketing agency",
    "spring-break-marketing-agency": "spring break marketing agency",
    "switching-campus-marketing-agencies": "switching campus marketing agencies",
    "how-to-market-to-college-students": "how to market to college students",
  };

  for (const [slug, term] of Object.entries(targets)) {
    const incoming = [];
    for (const post of posts) {
      if (post.slug === slug) continue;
      for (const link of linksIn(bodyText(post))) {
        if (link.href === `/insights/${slug}`) incoming.push({ from: post.slug, anchor: link.anchor });
      }
    }
    assert.ok(incoming.length >= 2, `${slug} has ${incoming.length} incoming links`);
    const anchors = incoming.map((link) => link.anchor.toLowerCase());
    assert.equal(new Set(anchors).size, anchors.length, `${slug} anchors repeat: ${anchors.join(" | ")}`);
    for (const anchor of anchors) {
      assert.equal(anchor.includes(term), true, `${slug} anchor "${anchor}"`);
      assert.notEqual(anchor, "college marketing agency", slug);
    }
  }

  for (const post of posts) {
    for (const link of linksIn(bodyText(post))) {
      if (link.anchor.toLowerCase() === "college marketing agency") {
        assert.equal(link.href, "/insights/college-marketing-agency", `${post.slug} ${link.anchor}`);
      }
    }
  }
});
