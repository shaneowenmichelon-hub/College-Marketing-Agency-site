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
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  m._compile(compiled, file);
  return m.exports;
}

function loadTs(rel) {
  return load(resolveSrc(path.join(__dirname, "../src", rel.replace(/\.tsx?$/, ""))));
}

function money(text) {
  return text.match(/\$\d{1,3}(?:,\d{3})*/g) ?? [];
}

test("pricing page uses only published rates and a visible FAQ", () => {
  const { pricingFaqs, pricingRows, pricingIntro, PRICING_DESCRIPTION, publishedRate } = loadTs("lib/pricing-page.ts");
  const { pricing } = loadTs("site.config.ts");
  const { faqPageStructuredData } = loadTs("lib/service-faqs.ts");
  const allowed = new Set(
    [pricing.events.range, pricing["brand-ambassadors"].range, pricing["product-placement"].range].flatMap(
      (range) => range.match(/\$\d{1,3}(?:,\d{3})*/g) ?? [],
    ),
  );

  const faqs = pricingFaqs();
  assert.ok(faqs.length >= 5 && faqs.length <= 7);
  const joined = [pricingIntro(), PRICING_DESCRIPTION, ...faqs.map((item) => item.answer)].join(" ");
  for (const amount of money(joined)) assert.ok(allowed.has(amount), amount);
  assert.equal(joined.includes("ZMM"), false);
  assert.equal(joined.includes("S.O.S"), false);
  assert.equal(joined.includes("SOS"), false);
  assert.match(joined, /quoted per campaign/i);
  assert.equal(PRICING_DESCRIPTION.length <= 160, true, PRICING_DESCRIPTION);

  for (const item of faqs) {
    assert.match(item.answer, /Collegiate Agency/);
    const count = item.answer.split(/(?<=[.!?])\s+/).filter(Boolean).length;
    assert.ok(count >= 1 && count <= 3, `${item.question} (${count})`);
  }

  const rows = pricingRows();
  assert.deepEqual(
    rows.slice(0, 3).map((row) => row.rate),
    [publishedRate("brand-ambassadors"), publishedRate("product-placement"), publishedRate("events")],
  );
  assert.equal(rows.at(-1).rate, "Quoted per campaign");

  const data = faqPageStructuredData(faqs, "/pricing");
  assert.equal(data["@type"], "FAQPage");
  assert.equal(data.mainEntity.length, faqs.length);
  assert.equal(data.mainEntity[0].acceptedAnswer.text, faqs[0].answer);

  const page = fs.readFileSync(path.join(__dirname, "../src/app/pricing/page.tsx"), "utf8");
  assert.match(page, /<ServiceJsonLd slug="brand-ambassadors" \/>/);
  assert.match(page, /<ServiceJsonLd slug="product-placement" \/>/);
  assert.match(page, /<ServiceJsonLd slug="events" \/>/);
  assert.match(page, /<FaqPageJsonLd items=\{faqs\} path="\/pricing" \/>/);
  assert.match(page, /<BreadcrumbJsonLd/);
  assert.match(page, /<ServiceFaq items=\{faqs\} \/>/);
  assert.match(page, /href: "\/contact"/);
  assert.equal(page.includes("ZMM"), false);
  assert.equal(page.includes("SOS"), false);
});

test("product placement is a real service page and the old redirect is gone", () => {
  const config = fs.readFileSync(path.join(__dirname, "../next.config.mjs"), "utf8");
  assert.equal(/source:\s*"\/services\/product-placement"/.test(config), false);
  const page = fs.readFileSync(
    path.join(__dirname, "../src/app/services/product-placement/page.tsx"),
    "utf8",
  );
  assert.match(page, /slug="product-placement"/);
  assert.match(page, /hidePedigree/);
  assert.equal(page.includes("ZMM"), false);
  assert.equal(page.includes("SOS"), false);
  const { servicePageSeo } = loadTs("lib/service-faqs.ts");
  const seo = servicePageSeo("product-placement");
  const hrefs = seo.reading.blocks.flatMap((block) =>
    block.parts.filter((part) => part.href).map((part) => part.href),
  );
  assert.ok(hrefs.includes("/work/nutrl-night-school-tour-product-placement"));
  assert.ok(hrefs.includes("/pricing"));
  assert.ok(hrefs.includes("/contact"));
  const { siteConfig } = loadTs("site.config.ts");
  assert.equal(
    siteConfig.services.find((service) => service.slug === "product-placement").href,
    "/services/product-placement",
  );
  assert.ok(siteConfig.nav.some((item) => item.href === "/pricing"));
});

test("sitemap, llms.txt, and the insights feed include the new URLs", async () => {
  const { default: sitemap } = loadTs("app/sitemap.ts");
  const byLoc = new Map(sitemap().map((entry) => [entry.url, entry]));
  for (const path of ["/pricing", "/services/product-placement"]) {
    const entry = byLoc.get(`https://collegiateagency.com${path}`);
    assert.ok(entry, path);
    assert.equal(entry.lastModified.toISOString(), "2026-10-22T00:00:00.000Z");
  }
  assert.equal(
    byLoc.get("https://collegiateagency.com/services/events").lastModified.toISOString(),
    "2026-10-21T00:00:00.000Z",
  );

  const { GET } = loadTs("app/llms.txt/route.ts");
  const llms = await (await GET()).text();
  assert.match(llms, /\]\(https:\/\/collegiateagency\.com\/services\/product-placement\)/);
  assert.match(llms, /\]\(https:\/\/collegiateagency\.com\/pricing\)/);
  assert.match(llms, /https:\/\/collegiateagency\.com\/feed\.xml/);
  assert.equal(llms.includes("there is no separate product-placement URL"), false);

  const feed = loadTs("app/feed.xml/route.ts");
  const xml = await (await feed.GET()).text();
  assert.match(xml, /<rss version="2\.0"/);
  assert.match(xml, /<link>https:\/\/collegiateagency\.com\/insights\/college-marketing-agency<\/link>/);
  assert.equal(xml.includes("<item>"), true);

  const { pageMetadata } = loadTs("lib/seo.ts");
  const meta = pageMetadata({ title: "Campus marketing pricing", description: "Rates.", path: "/pricing" });
  assert.equal(meta.alternates.canonical, "/pricing");
  assert.equal(meta.alternates.types["application/rss+xml"], "/feed.xml");
});

test("IndexNow key file matches the publisher and only recent URLs are submitted", async () => {
  const { INDEXNOW_KEY, entriesFromSitemapXml, indexNowKeyLocation, pingIndexNow, urlsForIndexNow } =
    loadTs("lib/indexnow.ts");
  const parsed = entriesFromSitemapXml(
    `<urlset><url><loc>https://collegiateagency.com/pricing</loc><lastmod>2026-10-22T00:00:00.000Z</lastmod></url></urlset>`,
  );
  assert.deepEqual(parsed, [
    { url: "https://collegiateagency.com/pricing", lastModified: "2026-10-22T00:00:00.000Z" },
  ]);
  const instrumentation = fs.readFileSync(path.join(__dirname, "../src/instrumentation.ts"), "utf8");
  assert.doesNotMatch(instrumentation, /app\/sitemap|blog-files|node:fs/);
  assert.match(INDEXNOW_KEY, /^[a-zA-Z0-9-]{8,128}$/);
  const keyFile = fs.readFileSync(path.join(__dirname, "../public", `${INDEXNOW_KEY}.txt`), "utf8").trim();
  assert.equal(keyFile, INDEXNOW_KEY);
  assert.equal(indexNowKeyLocation(), `https://collegiateagency.com/${INDEXNOW_KEY}.txt`);

  const now = Date.parse("2026-10-22T17:00:00.000Z");
  const urls = urlsForIndexNow(
    [
      { url: "https://collegiateagency.com/pricing", lastModified: "2026-10-22T00:00:00.000Z" },
      { url: "https://collegiateagency.com/about", lastModified: "2026-08-01T00:00:00.000Z" },
    ],
    now,
  );
  assert.deepEqual(urls, ["https://collegiateagency.com/pricing"]);

  let posted;
  const result = await pingIndexNow(
    [{ url: "https://collegiateagency.com/pricing", lastModified: new Date(now) }],
    now,
    async (url, init) => {
      posted = { url, body: JSON.parse(init.body) };
      return { status: 200, text: async () => "ok" };
    },
  );
  assert.equal(result.status, 200);
  assert.equal(posted.url, "https://api.indexnow.org/indexnow");
  assert.equal(posted.body.host, "collegiateagency.com");
  assert.equal(posted.body.key, INDEXNOW_KEY);
  assert.deepEqual(posted.body.urlList, ["https://collegiateagency.com/pricing"]);

  const empty = await pingIndexNow(
    [{ url: "https://collegiateagency.com/about", lastModified: "2026-01-01T00:00:00.000Z" }],
    now,
    async () => {
      throw new Error("should not post");
    },
  );
  assert.equal(empty.count, 0);
});

test("homepage hero photos all have alt text, including the collage duplicate", () => {
  const { getHeroPhotos } = loadTs("lib/hero-photos.ts");
  const photos = getHeroPhotos();
  assert.equal(photos.length, 7);
  for (const photo of photos) {
    assert.ok(photo.alt && photo.alt.trim().length > 12, photo.src);
  }
  const collage = fs.readFileSync(path.join(__dirname, "../src/components/home/HeroCollage.tsx"), "utf8");
  assert.match(collage, /alt=\{p\.alt\}/);
  assert.equal(collage.includes('alt=""'), false);
  assert.equal(collage.includes("first ? p.alt"), false);
});

test("public routes that were missing social images now have generated cards", () => {
  const routes = [
    "about",
    "services",
    "services/events",
    "services/brand-ambassadors",
    "services/product-placement",
    "work",
    "work/[slug]",
    "contact",
    "build-a-campaign",
    "become-an-ambassador",
    "insights",
    "pricing",
  ];
  for (const route of routes) {
    for (const file of ["opengraph-image.tsx", "twitter-image.tsx"]) {
      assert.ok(
        fs.existsSync(path.join(__dirname, "../src/app", route, file)),
        `${route}/${file}`,
      );
    }
  }
  const card = fs.readFileSync(path.join(__dirname, "../src/lib/og-card.tsx"), "utf8");
  assert.equal(card.includes("/logos"), false);
  assert.equal(card.includes("<img"), false);
});
