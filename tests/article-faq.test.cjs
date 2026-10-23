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

const FAQ_SLUGS = [
  "college-marketing-agency",
  "campus-marketing-agency-rfp",
  "campus-brand-activation-agency",
  "college-brand-ambassador-program",
  "spring-break-marketing-agency",
];

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
    assert.equal(post.dateModified, "2026-10-23", slug);
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
