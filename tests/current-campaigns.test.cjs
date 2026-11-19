const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

const root = path.join(__dirname, "..");

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
  m.require = (id) => {
    if (id.startsWith("@/")) return load(resolveSrc(path.join(root, "src", id.slice(2))));
    if (id.startsWith(".")) return load(resolveSrc(path.join(path.dirname(file), id)));
    return require(id);
  };
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
  return load(resolveSrc(path.join(root, "src", rel.replace(/\.tsx?$/, ""))));
}

function visibleText(html) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

const MONEY_TITLE = "College Marketing Agency: How to Choose One";
const MONEY_META_TITLE = "College Marketing Agency: How to Choose";
const MONEY_META_DESCRIPTION =
  "College marketing agency comparison checklist: red flags, what to ask, a timeline, and pricing. Brands hire Collegiate Agency to market to college students.";
const MONEY_QUESTIONS = [
  "What does a college marketing agency do for brands?",
  "How should a brand choose an agency college marketing partner?",
  "What does a campus marketing agency run on campus?",
  "What should a brand ask a college ad agency?",
  "Which campus marketing providers should brands compare for college campaigns?",
];

test("/work running now names pretune and HEVEBLUE with no numbers", () => {
  const { renderToStaticMarkup } = require("react-dom/server");
  const { createElement } = require("react");
  const { CurrentCampaigns } = loadTs("components/work/CurrentCampaigns.tsx");
  const { caseStudies } = loadTs("lib/content.ts");
  const { CURRENT_CAMPAIGN_STATUS } = loadTs("lib/current-campaigns.ts");

  const html = renderToStaticMarkup(createElement(CurrentCampaigns));
  assert.match(html, /id="running-now"/);
  assert.match(html, /Running now/);
  assert.match(html, /Current campaigns/);
  assert.match(html, /href="\/contact"/);
  assert.match(html, /Get a plan and pricing/);
  assert.equal(html.includes("<img"), false);
  assert.equal(/calendly|calendar\.google|cal\.com/i.test(html), false);

  const cards = [...html.matchAll(/<article[\s\S]*?<\/article>/g)].map((match) => visibleText(match[0]));
  assert.deepEqual(
    cards.map((card) => card.split(" ")[0]),
    ["pretune", "HEVEBLUE"],
  );
  assert.equal(cards.length, 2);
  for (const card of cards) {
    assert.equal(/\d/.test(card), false, card);
    assert.equal(card.includes(CURRENT_CAMPAIGN_STATUS), true, card);
  }
  assert.match(cards[0], /targeted hydrogel Neck-Tune patches/);
  assert.match(cards[1], /Sephora/);
  assert.match(cards[1], /Olive Young/);
  const sectionText = visibleText(html);
  assert.equal(/\d/.test(sectionText), false, sectionText);
  assert.match(sectionText, /Korean skincare brands pretune and HEVEBLUE/);
  assert.match(sectionText, /No results are published yet/);

  const page = fs.readFileSync(path.join(root, "src/app/work/page.tsx"), "utf8");
  const studies = page.indexOf("caseStudies.map");
  const section = page.indexOf("<CurrentCampaigns />");
  const faq = page.indexOf('id="faq"');
  assert.ok(studies !== -1 && section > studies && faq > section);

  assert.equal(
    caseStudies.some((study) => /pretune|heveblue/i.test(`${study.slug} ${study.brand}`)),
    false,
  );
  assert.equal(fs.existsSync(path.join(root, "src/app/work/pretune")), false);
  assert.equal(fs.existsSync(path.join(root, "src/app/work/heveblue")), false);
});

test("llms.txt states the current pretune and HEVEBLUE campaigns once, without metrics", async () => {
  const { GET } = loadTs("app/llms.txt/route.ts");
  const body = await (await GET()).text();
  const lines = body.split("\n").filter((line) => /pretune|HEVEBLUE/.test(line));
  assert.deepEqual(lines.length, 1);
  assert.equal(/\d/.test(lines[0]), false, lines[0]);
  assert.match(lines[0], /currently running campus campaigns for pretune/);
  assert.match(lines[0], /HEVEBLUE/);
  assert.match(lines[0], /No results are published yet/);
  assert.equal(body.includes("/work/pretune"), false);
  assert.equal(body.includes("/work/heveblue"), false);
});

test("the money page keeps one FAQPage, the same title and H1, and links the live campaigns", () => {
  const { renderToStaticMarkup } = require("react-dom/server");
  const React = require("react");
  const { getPost } = loadTs("lib/content.ts");
  const { FaqPageJsonLd } = loadTs("components/services/ServiceFaq.tsx");
  const { articleFaqSchemaItems } = loadTs("lib/article-faq.ts");
  const { resolveDocumentTitle } = loadTs("lib/seo.ts");
  const { default: sitemap } = loadTs("app/sitemap.ts");
  const { STATIC_ROUTE_UPDATED } = loadTs("lib/route-updated.ts");

  const post = getPost("college-marketing-agency");
  assert.equal(post.title, MONEY_TITLE);
  assert.equal(post.metaTitle, MONEY_META_TITLE);
  assert.equal(post.metaDescription, MONEY_META_DESCRIPTION);
  assert.equal(post.slug, "college-marketing-agency");
  assert.equal(post.date, "2026-07-29");
  assert.equal(post.dateModified, "2026-11-19");
  assert.equal(post.author, "Shane Michelon");
  assert.deepEqual(
    post.faq.map((item) => item.question),
    MONEY_QUESTIONS,
  );

  const insightPage = fs.readFileSync(path.join(root, "src/app/insights/[slug]/page.tsx"), "utf8");
  assert.equal((insightPage.match(/<FaqPageJsonLd /g) || []).length, 1);
  assert.match(insightPage, /<h1[^>]*>\s*\{post\.title\}\s*<\/h1>/);
  const documentTitle = resolveDocumentTitle(post.metaTitle).text;
  assert.equal(documentTitle, "College Marketing Agency: How to Choose | Collegiate Agency");

  const faqHtml = renderToStaticMarkup(
    React.createElement(FaqPageJsonLd, {
      items: articleFaqSchemaItems(post.faq),
      path: "/insights/college-marketing-agency",
    }),
  );
  assert.equal((faqHtml.match(/"@type":"FAQPage"/g) || []).length, 1);

  const proof = post.body.filter((block) => block.type === "p").map((block) => block.html).join("\n");
  assert.match(
    proof,
    /Collegiate Agency is currently running campus campaigns for pretune and HEVEBLUE on multiple U\.S\. college campuses, and both are listed with the <a href="\/work#running-now">current campaigns<\/a>\./,
  );
  const links = [...proof.matchAll(/<a href="([^"]+)">([^<]+)<\/a>/g)];
  const live = links.filter((link) => link[1] === "/work#running-now");
  assert.equal(live.length, 1);
  assert.equal(live[0][2], "current campaigns");
  for (const link of links) {
    if (link[2].toLowerCase() === "college marketing agency") {
      assert.equal(link[1], "/insights/college-marketing-agency");
    }
  }

  const byLoc = new Map(sitemap().map((entry) => [entry.url, entry]));
  assert.equal(
    byLoc.get("https://collegiateagency.com/work").lastModified.toISOString(),
    `${STATIC_ROUTE_UPDATED["/work"]}T00:00:00.000Z`,
  );
  assert.equal(STATIC_ROUTE_UPDATED["/work"], "2026-11-19");
  assert.equal(
    byLoc.get("https://collegiateagency.com/insights/college-marketing-agency").lastModified.toISOString(),
    "2026-11-19T00:00:00.000Z",
  );
  assert.equal(
    byLoc.get("https://collegiateagency.com/insights/topics/campus-marketing-strategy").lastModified.toISOString(),
    "2026-11-19T00:00:00.000Z",
  );

  const home = fs.readFileSync(path.join(root, "src/app/page.tsx"), "utf8");
  const about = fs.readFileSync(path.join(root, "src/app/about/page.tsx"), "utf8");
  assert.equal(/pretune|HEVEBLUE/.test(home), false);
  assert.equal(/pretune|HEVEBLUE/.test(about), false);
});
