const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("path");
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
  m.require = (id) => {
    if (id.startsWith("@/")) return load(resolveSrc(path.join(__dirname, "../src", id.slice(2))));
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
  return load(resolveSrc(path.join(__dirname, "../src", rel.replace(/\.tsx?$/, ""))));
}

function jsonLd(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) =>
    JSON.parse(match[1]),
  );
}

function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function plainDigits(value) {
  return value.replace(/[^\d]/g, "");
}

test("campus markets publish only when the fact, word, and FAQ gates pass", async () => {
  const React = require("react");
  const { renderToStaticMarkup } = require("react-dom/server");
  const markets = loadTs("lib/campus-markets.ts");
  const { pageMetadata, resolveDocumentTitle, TITLE_LIMIT, organizationStructuredData } = loadTs("lib/seo.ts");
  const { publishedRate } = loadTs("lib/pricing-page.ts");
  const { getStat, siteConfig } = loadTs("site.config.ts");
  const { getCaseStudy, getPost } = loadTs("lib/content.ts");
  const { default: sitemap } = loadTs("app/sitemap.ts");
  const cityPage = loadTs("app/campus-marketing/[slug]/page.tsx");
  const hubPage = loadTs("app/campus-marketing/page.tsx");

  for (const market of markets.campusMarkets) {
    for (const fact of market.facts) {
      assert.match(fact.source, /^https:\/\//, fact.id);
      assert.ok(fact.text.trim().length > 0, fact.id);
    }
  }

  const publishedSlugs = markets.publishedMarkets().map((market) => market.slug);
  assert.deepEqual(publishedSlugs, ["new-orleans"]);
  assert.equal(markets.factGate(markets.campusMarkets.find((market) => market.slug === "austin")), false);
  assert.equal(markets.factGate(markets.campusMarkets.find((market) => market.slug === "oxford-ole-miss")), false);
  assert.equal(markets.campusMarkets.find((market) => market.slug === "austin").caseStudySlug, undefined);
  assert.equal(markets.campusMarkets.find((market) => market.slug === "oxford-ole-miss").caseStudySlug, undefined);

  const study = getCaseStudy("sos-consultants-nola-campus-leasing-ambassadors");
  const studyText = `${study.headline} ${study.approach} ${study.results}`;
  for (const phrase of ["New Orleans leasing", "$2,500", "two shows", "on-site activation", "11x return on ad spend"]) {
    assert.ok(studyText.includes(phrase), phrase);
  }
  assert.match(study.approach, /flyer\/video/);
  assert.match(study.approach, /localized Meta ads/);
  assert.match(study.approach, /same creative/);

  assert.deepEqual(
    cityPage.generateStaticParams(),
    publishedSlugs.map((slug) => ({ slug })),
  );
  assert.equal(cityPage.dynamicParams, false);

  const urls = sitemap().map((entry) => entry.url);
  assert.ok(urls.includes("https://collegiateagency.com/campus-marketing"));
  assert.ok(urls.includes("https://collegiateagency.com/campus-marketing/new-orleans"));
  assert.equal(urls.includes("https://collegiateagency.com/campus-marketing/austin"), false);
  assert.equal(urls.includes("https://collegiateagency.com/campus-marketing/oxford-ole-miss"), false);
  const byLoc = new Map(sitemap().map((entry) => [entry.url, entry]));
  assert.equal(
    byLoc.get("https://collegiateagency.com/campus-marketing").lastModified.toISOString(),
    `${markets.CAMPUS_MARKETING_UPDATED}T00:00:00.000Z`,
  );
  assert.equal(
    byLoc.get("https://collegiateagency.com/campus-marketing/new-orleans").lastModified.toISOString(),
    `${markets.CAMPUS_MARKETING_UPDATED}T00:00:00.000Z`,
  );

  const money = getPost("college-marketing-agency");
  const moneyTitle = resolveDocumentTitle(money.metaTitle).text;
  const titles = new Set([moneyTitle]);
  const hubTitle = resolveDocumentTitle(markets.HUB_TITLE_LEAD).text;
  assert.ok(hubTitle.length <= TITLE_LIMIT, hubTitle);
  assert.equal(titles.has(hubTitle), false);
  titles.add(hubTitle);

  const allowedStats = siteConfig.stats.map((stat) => `${stat.value} ${stat.label}`).join(" ");
  const allowedRates = ["events", "brand-ambassadors", "product-placement"].map((slug) => publishedRate(slug)).join(" ");

  for (const market of markets.publishedMarkets()) {
    const doc = markets.marketDocument(market);
    const words = markets.countWords(markets.marketBodyText(market));
    assert.ok(words >= 350, `${market.slug} has ${words} words`);
    assert.ok(market.localFaq.length >= 4 && market.localFaq.length <= 5, market.slug);
    assert.ok(doc.description.length <= 155, `${doc.description.length}: ${doc.description}`);
    const resolved = resolveDocumentTitle(doc.titleLead).text;
    assert.ok(resolved.length <= TITLE_LIMIT, `${resolved} (${resolved.length})`);
    assert.equal(titles.has(resolved), false, resolved);
    assert.notEqual(resolved, moneyTitle);
    titles.add(resolved);

    const meta = pageMetadata({ title: doc.titleLead, description: doc.description, path: doc.path });
    assert.equal(meta.alternates.canonical, doc.path);
    assert.notEqual(meta.alternates.canonical, MONEY_PATH(money));
    assert.equal(meta.title.absolute, resolved);

    const html = renderToStaticMarkup(
      await cityPage.default({ params: Promise.resolve({ slug: market.slug }) }),
    );
    assert.match(html, new RegExp(`<h1[^>]*>[\\s\\S]*${doc.h1}`));
    const moneyLinks = [...html.matchAll(/href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)]
      .map((match) => ({ href: match[1], anchor: match[2].replace(/<[^>]+>/g, "").trim() }))
      .filter((link) => link.href === "/insights/college-marketing-agency");
    assert.equal(moneyLinks.length, 1, market.slug);
    assert.equal(moneyLinks[0].anchor, markets.moneyPageAnchor(market.slug));
    assert.ok(markets.MONEY_PAGE_ANCHORS.includes(moneyLinks[0].anchor));

    assert.match(html, /href="\/contact"/);
    assert.equal(/calendly|cal\.com|tel:/i.test(html), false, market.slug);
    assert.equal(/intern|student-run/i.test(visibleText(html)), false);

    const nodes = jsonLd(html);
    const types = nodes.flatMap((node) => (Array.isArray(node["@type"]) ? node["@type"] : [node["@type"]]));
    assert.ok(types.includes("Service"), types.join(","));
    assert.ok(types.includes("BreadcrumbList"));
    assert.ok(types.includes("FAQPage"));
    const serialized = JSON.stringify(nodes);
    assert.equal(serialized.includes("LocalBusiness"), false);
    assert.equal(serialized.includes("PostalAddress"), false);
    const service = nodes.find((node) => node["@type"] === "Service");
    assert.equal(service["@id"], `https://collegiateagency.com${doc.path}#service`);
    assert.equal(service.name, `Campus marketing in ${market.city}`);
    assert.equal(service.serviceType, "College marketing");
    assert.equal(service.provider["@id"], "https://collegiateagency.com/#organization");
    assert.ok(service.areaServed.some((area) => area["@type"] === "City" && area.name === market.city));
    assert.ok(service.areaServed.some((area) => area["@type"] === "CollegeOrUniversity"));
    assert.ok(service.offers.length >= 1);

    const visible = visibleText(html);
    const allowed = plainDigits(
      `${allowedRates} ${allowedStats} ${getStat("campuses")} ${market.facts.map((fact) => fact.text).join(" ")}`,
    );
    for (const amount of visible.match(/\d[\d,]*/g) ?? []) {
      assert.ok(allowed.includes(plainDigits(amount)), `${market.slug} number ${amount}`);
    }
  }

  const publishedDocs = markets.publishedMarkets();
  if (publishedDocs.length > 1) {
    for (const left of publishedDocs) {
      for (const right of publishedDocs) {
        if (left.slug === right.slug) continue;
        const share = markets.uniqueWordShare(markets.marketBodyText(left), markets.marketBodyText(right));
        assert.ok(share >= 0.6, `${left.slug} vs ${right.slug}: ${share}`);
      }
    }
  }

  const hubHtml = renderToStaticMarkup(React.createElement(hubPage.default));
  assert.match(hubHtml, /Campus marketing by city/);
  assert.match(hubHtml, /campus marketing in New Orleans/);
  assert.equal(hubHtml.includes("/campus-marketing/austin"), false);
  assert.equal(hubHtml.includes("/campus-marketing/oxford-ole-miss"), false);
  assert.equal(/Murda|Emo's|Laylo|Riverside/i.test(hubHtml), false);
  assert.match(hubHtml, /campus network/);
  assert.match(hubHtml, /href="\/contact"/);
  const hubNodes = jsonLd(hubHtml);
  const hubTypes = hubNodes.flatMap((node) => (Array.isArray(node["@type"]) ? node["@type"] : [node["@type"]]));
  assert.ok(hubTypes.includes("CollectionPage"));
  assert.ok(hubTypes.includes("BreadcrumbList"));
  assert.ok(hubTypes.includes("FAQPage"));
  assert.ok(JSON.stringify(hubNodes).includes("ItemList"));

  const org = organizationStructuredData()[0];
  assert.equal(org.address.streetAddress, "66 W Broadway, Suite 201");
  assert.equal(org.address.postalCode, "10007");
  assert.deepEqual(org.numberOfEmployees, { "@type": "QuantitativeValue", value: 6 });
  assert.equal(org.telephone, undefined);
  assert.equal(siteConfig.offices[0].numberOfEmployees, 6);
  assert.equal(siteConfig.offices[0].phone, "");
  assert.equal(siteConfig.contact.email, "shane@zmmevents.com");
});

function MONEY_PATH() {
  return "/insights/college-marketing-agency";
}
