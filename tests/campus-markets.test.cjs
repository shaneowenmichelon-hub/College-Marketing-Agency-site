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
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function plainDigits(value) {
  return value.replace(/[^\d]/g, "");
}

const PUBLISHED = ["new-orleans", "syracuse", "oxford-ole-miss", "austin", "dallas"];

test("campus markets publish only cities with at least one activation", async () => {
  const React = require("react");
  const { renderToStaticMarkup } = require("react-dom/server");
  const markets = loadTs("lib/campus-markets.ts");
  const { pageMetadata, resolveDocumentTitle, TITLE_LIMIT, organizationStructuredData } = loadTs("lib/seo.ts");
  const { siteConfig } = loadTs("site.config.ts");
  const { getCaseStudy, getPost } = loadTs("lib/content.ts");
  const { default: sitemap } = loadTs("app/sitemap.ts");
  const cityPage = loadTs("app/campus-marketing/[slug]/page.tsx");
  const hubPage = loadTs("app/campus-marketing/page.tsx");
  const { GET: llmsGet } = loadTs("app/llms.txt/route.ts");

  assert.equal(markets.activationGate({ activations: [] }), false);
  assert.equal(markets.activationGate({ activations: [{ brand: "", whatRan: "x", source: "https://example.com" }] }), false);
  assert.deepEqual(
    markets.campusMarkets.map((market) => market.slug),
    PUBLISHED,
  );
  for (const market of markets.campusMarkets) {
    assert.equal(markets.activationGate(market), true, market.slug);
    assert.ok(market.activations.length >= 1, market.slug);
  }

  const bySlug = Object.fromEntries(markets.campusMarkets.map((market) => [market.slug, market]));
  assert.deepEqual(
    bySlug["new-orleans"].activations.map((item) => item.brand),
    ["SOS Consultants Nola", "BeatBox", "NÜTRL", "Bumble"],
  );
  assert.deepEqual(
    bySlug.syracuse.activations.map((item) => item.brand),
    ["BeatBox", "Dazed", "NÜTRL", "Red Bull"],
  );
  assert.deepEqual(
    bySlug["oxford-ole-miss"].activations.map((item) => item.brand),
    ["Bloom", "NÜTRL", "BeatBox"],
  );
  assert.deepEqual(
    bySlug.austin.activations.map((item) => item.brand),
    ["BeatBox"],
  );
  assert.deepEqual(
    bySlug.dallas.activations.map((item) => item.brand),
    ["BeatBox"],
  );

  const study = getCaseStudy("sos-consultants-nola-campus-leasing-ambassadors");
  const sos = bySlug["new-orleans"].activations[0];
  assert.equal(sos.caseStudySlug, "sos-consultants-nola-campus-leasing-ambassadors");
  assert.match(sos.source, /\/work\/sos-consultants-nola-campus-leasing-ambassadors$/);
  assert.equal(sos.whatRan, "SOS Consultants Nola ran a campus campaign with Collegiate Agency in New Orleans.");
  assert.equal(sos.result, undefined);
  assert.equal(study.slug, "sos-consultants-nola-campus-leasing-ambassadors");
  assert.equal(sos.date, undefined);

  assert.match(bySlug.austin.activations[0].whatRan, /Fri Oct 23, 2026/);
  assert.match(bySlug.austin.activations[0].whatRan, /CAMP on West 6th/);
  assert.match(bySlug.austin.activations[0].whatRan, /bar takeover/);
  assert.equal(bySlug.austin.activations[0].date, "2026-10-23");
  assert.equal(/Night School|Murda|Emo|Sep 11|September 11|Riverside/i.test(bySlug.austin.activations[0].whatRan), false);
  assert.equal(bySlug.austin.activations[0].source.includes("universe.com"), false);

  assert.match(bySlug.dallas.activations[0].whatRan, /Thu Nov 5, 2026/);
  assert.match(bySlug.dallas.activations[0].whatRan, /Tree Haus/);
  assert.equal(bySlug.dallas.activations[0].date, "2026-11-05");
  assert.equal(/Night School/i.test(bySlug.dallas.activations[0].whatRan), false);
  assert.equal(bySlug.dallas.activations[0].result, undefined);

  for (const item of bySlug.syracuse.activations) {
    assert.equal(item.date, "2026-09-04");
    assert.match(item.whatRan, /Sep 4, 2026/);
    assert.match(item.whatRan, /Night School show in Syracuse/);
    assert.match(item.whatRan, /Syracuse University audience/);
    assert.equal(item.source, "https://laylo.com/nightschooltour/Rx4xAb");
    assert.equal(item.result, undefined);
  }
  for (const item of bySlug["oxford-ole-miss"].activations) {
    assert.equal(item.date, "2026-09-16");
    assert.match(item.whatRan, /Sep 16, 2026/);
    assert.match(item.whatRan, /University of Mississippi audience/);
    assert.equal(/Ole Miss/i.test(item.whatRan), false);
    assert.equal(item.source, "https://laylo.com/nightschooltour/V5wfUn");
    assert.equal(item.result, undefined);
  }

  const nutrlCards = markets.campusMarkets.flatMap((market) =>
    market.activations.filter((item) => item.brand === "NÜTRL").map((item) => ({ city: market.city, item })),
  );
  assert.equal(nutrlCards.length, 3);
  for (const card of nutrlCards) {
    assert.equal(card.item.caseStudySlug, "nutrl-night-school-tour-product-placement");
    assert.equal(/425|5 million|\$175,000|\$50,000|ROAS|views/i.test(card.item.whatRan), false, card.city);
  }

  assert.deepEqual(
    cityPage.generateStaticParams(),
    PUBLISHED.map((slug) => ({ slug })),
  );
  assert.equal(cityPage.dynamicParams, false);
  await assert.rejects(() => cityPage.default({ params: Promise.resolve({ slug: "tampa" }) }));
  await assert.rejects(() => cityPage.generateMetadata({ params: Promise.resolve({ slug: "tampa" }) }));

  const urls = sitemap().map((entry) => entry.url);
  assert.ok(urls.includes("https://collegiateagency.com/campus-marketing"));
  for (const slug of PUBLISHED) {
    assert.ok(urls.includes(`https://collegiateagency.com/campus-marketing/${slug}`), slug);
  }
  assert.equal(urls.includes("https://collegiateagency.com/campus-marketing/tampa"), false);
  const byLoc = new Map(sitemap().map((entry) => [entry.url, entry]));
  for (const url of [
    "https://collegiateagency.com/campus-marketing",
    ...PUBLISHED.map((slug) => `https://collegiateagency.com/campus-marketing/${slug}`),
  ]) {
    assert.equal(byLoc.get(url).lastModified.toISOString(), `${markets.CAMPUS_MARKETING_UPDATED}T00:00:00.000Z`, url);
  }

  const money = getPost("college-marketing-agency");
  const moneyTitle = resolveDocumentTitle(money.metaTitle).text;
  const titles = new Set([moneyTitle]);
  const hubTitle = resolveDocumentTitle(markets.HUB_TITLE_LEAD).text;
  assert.ok(hubTitle.length <= TITLE_LIMIT, hubTitle);
  assert.equal(titles.has(hubTitle), false);
  titles.add(hubTitle);

  for (const market of markets.publishedMarkets()) {
    const doc = markets.marketDocument(market);
    assert.ok(doc.description.length <= 155, `${doc.description.length}: ${doc.description}`);
    const resolved = resolveDocumentTitle(doc.titleLead).text;
    assert.ok(resolved.length <= TITLE_LIMIT, `${resolved} (${resolved.length})`);
    assert.equal(titles.has(resolved), false, resolved);
    assert.notEqual(resolved, moneyTitle);
    titles.add(resolved);
    assert.equal(doc.h1, `College marketing in ${market.city}`);
    assert.equal(doc.titleLead, `College Marketing Agency in ${market.city}`);

    const meta = pageMetadata({ title: doc.titleLead, description: doc.description, path: doc.path });
    assert.equal(meta.alternates.canonical, doc.path);
    assert.equal(meta.title.absolute, resolved);

    const html = renderToStaticMarkup(await cityPage.default({ params: Promise.resolve({ slug: market.slug }) }));
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
    const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);
    for (const href of hrefs) {
      assert.equal(/^https?:/i.test(href), false, `${market.slug} ${href}`);
      assert.equal(/beatbox|bumble|redbull|dazed\.com|bloom\.com/i.test(href), false, href);
    }

    const nodes = jsonLd(html);
    const types = nodes.flatMap((node) => (Array.isArray(node["@type"]) ? node["@type"] : [node["@type"]]));
    assert.ok(types.includes("Service"), types.join(","));
    assert.ok(types.includes("BreadcrumbList"));
    assert.equal(types.includes("FAQPage"), false, market.slug);
    assert.equal(types.includes("LocalBusiness"), false);
    const serialized = JSON.stringify(nodes);
    assert.equal(serialized.includes("LocalBusiness"), false);
    assert.equal(serialized.includes("PostalAddress"), false);
    assert.equal(serialized.includes("CollegeOrUniversity"), false);
    assert.equal(serialized.includes("FAQPage"), false);
    const service = nodes.find((node) => node["@type"] === "Service");
    assert.equal(service["@id"], `https://collegiateagency.com${doc.path}#service`);
    assert.equal(service.name, `Campus marketing in ${market.city}`);
    assert.equal(service.serviceType, "College marketing");
    assert.equal(service.provider["@id"], "https://collegiateagency.com/#organization");
    assert.equal(service.areaServed["@type"], "City");
    assert.equal(service.areaServed.name, market.city);
    assert.equal(service.offers, undefined);
    assert.equal(/\$|return on ad spend|ROAS|171,?902|\bviews\b|\bimpressions\b|\battendance\b|\bsales\b/i.test(serialized), false, market.slug);
    assert.equal(/\$|return on ad spend|ROAS/i.test(doc.description), false, market.slug);

    const visible = visibleText(html);
    assert.equal(/\$|return on ad spend|ROAS/i.test(visible), false, `${market.slug} rendered copy`);
    assert.equal(/\$|return on ad spend|ROAS/i.test(markets.marketBodyText(market)), false, market.slug);
    assert.equal(/Tulane|Loyola|\bUNO\b|Ole Miss|Stripz|Polymarket|STIZZY|Murda|Emo's|Riverside/i.test(visible), false, market.slug);
    assert.equal(/campus network|schools a brief can name/i.test(visible), false, market.slug);
    assert.equal(/\$150|\$1,500|\$500,000/i.test(visible), false, market.slug);
    for (const activation of market.activations) {
      assert.ok(visible.includes(activation.brand), `${market.slug} ${activation.brand}`);
      assert.ok(visible.includes(activation.whatRan), `${market.slug} ${activation.brand}`);
      if (activation.result) assert.ok(visible.includes(activation.result), market.slug);
      if (activation.caseStudySlug === markets.NUTRL_CASE_STUDY) {
        assert.match(html, /href="\/work\/nutrl-night-school-tour-product-placement"/);
        assert.match(html, /Night School tour case study/);
      }
    }
    if (market.slug === "new-orleans") {
      assert.match(html, /href="\/work\/sos-consultants-nola-campus-leasing-ambassadors"/);
      assert.match(html, /SOS Consultants Nola case study/);
    }
    if (market.slug === "austin" || market.slug === "dallas") {
      assert.equal(/Night School/i.test(visible), false, market.slug);
    }

    for (const campus of siteConfig.campuses) {
      const school = campus.school;
      if (school.toLowerCase() === market.city.toLowerCase()) continue;
      const inActivation = market.activations.some((item) =>
        `${item.brand} ${item.whatRan} ${item.result ?? ""}`.includes(school),
      );
      if (visible.includes(school)) {
        assert.equal(inActivation, true, `${market.slug} names ${school} outside an activation`);
      }
    }

    const allowed = plainDigits(
      `${market.intro} ${market.activations.map((item) => `${item.whatRan} ${item.result ?? ""}`).join(" ")}`,
    );
    for (const amount of visible.match(/\d[\d,]*/g) ?? []) {
      assert.ok(allowed.includes(plainDigits(amount)), `${market.slug} number ${amount}`);
    }
  }

  const hubHtml = renderToStaticMarkup(React.createElement(hubPage.default));
  const hubVisible = visibleText(hubHtml);
  assert.match(hubHtml, /Campus marketing by city/);
  for (const market of markets.publishedMarkets()) {
    assert.match(hubHtml, new RegExp(`campus marketing in ${market.city}`));
    assert.match(hubHtml, new RegExp(`href="${markets.cityPath(market.slug)}"`));
    assert.ok(hubVisible.includes(market.intro), market.slug);
  }
  assert.equal(hubHtml.includes("/campus-marketing/tampa"), false);
  assert.equal(/campus network|Tulane|Ole Miss|UT Austin|Ohio State|Murda|Emo's/i.test(hubVisible), false);
  assert.match(hubHtml, /href="\/contact"/);
  const hubNodes = jsonLd(hubHtml);
  const hubTypes = hubNodes.flatMap((node) => (Array.isArray(node["@type"]) ? node["@type"] : [node["@type"]]));
  assert.ok(hubTypes.includes("CollectionPage"));
  assert.ok(hubTypes.includes("BreadcrumbList"));
  assert.equal(hubTypes.includes("FAQPage"), false);
  assert.ok(JSON.stringify(hubNodes).includes("ItemList"));
  const itemList = JSON.stringify(hubNodes);
  for (const slug of PUBLISHED) assert.ok(itemList.includes(`/campus-marketing/${slug}`), slug);
  assert.equal(itemList.includes("/campus-marketing/tampa"), false);

  const llms = await (await llmsGet()).text();
  for (const slug of PUBLISHED) {
    assert.match(llms, new RegExp(`/campus-marketing/${slug}`));
  }
  assert.equal(llms.includes("/campus-marketing/tampa"), false);
  assert.equal(/171,?902|Murda|Emo's/i.test(llms), false);
  const cityLines = llms.split("## Campus marketing by city")[1].split("\n## ")[0];
  assert.equal(/\$|return on ad spend|ROAS/i.test(cityLines), false);
  assert.equal(/\$|return on ad spend|ROAS/i.test(hubVisible), false);
  assert.equal(/\$|return on ad spend|ROAS/i.test(JSON.stringify(hubNodes)), false);

  const org = organizationStructuredData()[0];
  assert.equal(org.address.streetAddress, "66 W Broadway, Suite 201");
  assert.equal(org.address.postalCode, "10007");
  assert.deepEqual(org.numberOfEmployees, { "@type": "QuantitativeValue", value: 6 });
  assert.equal(org.telephone, undefined);
  assert.equal(siteConfig.offices[0].numberOfEmployees, 6);
  assert.equal(siteConfig.offices[0].phone, "");
  assert.equal(siteConfig.contact.email, "shane@zmmevents.com");
});
