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

test("document titles stay within 60 characters and do not double the brand", () => {
  const { resolveDocumentTitle, HOME_TITLE_LEAD, TITLE_LIMIT } = loadTs("lib/seo.ts");
  const home = resolveDocumentTitle(HOME_TITLE_LEAD).text;
  assert.ok(home.length <= TITLE_LIMIT, home);
  assert.match(home, /^College Marketing Agency \| Collegiate Agency$/);

  const pages = [
    "About the agency",
    "Contact - Let's reach students together",
    "Work - Campaigns & case studies",
    "Campus Marketing Services for Brands",
    "Campus event marketing",
    "Brand ambassador programs",
    "Campus marketing insights",
    "Build a campus campaign",
    "Become a campus ambassador",
    "Campus marketing pricing",
    "Greek life product placement",
    "Privacy Policy",
    "Page not found",
    "SOS Consultants Nola case study",
    "Celsius case study",
  ];
  for (const title of pages) {
    const text = resolveDocumentTitle(title).text;
    assert.ok(text.length <= TITLE_LIMIT, `${text} (${text.length})`);
    assert.equal(text.split("Collegiate Agency").length - 1, 1, text);
  }

  const doubled = resolveDocumentTitle(
    "SOS Consultants Nola Campus Ambassador Case Study | Collegiate Agency | Collegiate Agency",
  ).text;
  assert.ok(doubled.split("Collegiate Agency").length - 1 <= 1, doubled);
  assert.ok(!doubled.includes("· Collegiate Agency"), doubled);
});

test("homepage description names the category and stays within the snippet", () => {
  const { siteConfig } = loadTs("site.config.ts");
  assert.ok(siteConfig.description.length <= 160, siteConfig.description);
  assert.match(siteConfig.description, /^A college and campus marketing agency for campus events and brand ambassador programs/);
  assert.match(siteConfig.definition, /^Collegiate Agency is a college and campus marketing agency/);
  assert.equal(siteConfig.contact.email, "shane@zmmevents.com");
  assert.deepEqual(
    siteConfig.socials.map((social) => social.href),
    [
      "https://www.instagram.com/zmmevents",
      "https://www.instagram.com/nightschooltour",
      "https://www.zmm.events",
      "https://www.linkedin.com/company/collegiate-agency",
    ],
  );
});

test("organization JSON-LD is one node with a real address, logo, and website", () => {
  const { organizationStructuredData, serviceStructuredData, serviceBreadcrumbItems } = loadTs("lib/seo.ts");
  const graph = organizationStructuredData();
  assert.equal(graph.length, 2);
  const org = graph[0];
  const website = graph[1];
  assert.deepEqual(org["@type"], ["Organization", "ProfessionalService"]);
  assert.equal(org["@id"], "https://collegiateagency.com/#organization");
  assert.equal(website["@type"], "WebSite");
  assert.equal(website.publisher["@id"], org["@id"]);
  assert.equal(org.address["@type"], "PostalAddress");
  assert.equal(org.address.addressLocality, "New York");
  assert.equal(org.address.addressRegion, "NY");
  assert.equal(org.address.addressCountry, "US");
  assert.equal(org.address.streetAddress, undefined);
  assert.equal(org.email, "shane@zmmevents.com");
  assert.equal(org.logo.url, "https://collegiateagency.com/logo.png");
  assert.equal(org.logo.width, 512);
  assert.equal(org.logo.height, 512);
  assert.deepEqual(org.sameAs, [
    "https://www.instagram.com/zmmevents",
    "https://www.instagram.com/nightschooltour",
    "https://www.zmm.events",
    "https://www.linkedin.com/company/collegiate-agency",
    "https://clutch.co/profile/collegiate-agency",
    "https://www.sortlist.com/agency/collegiate-agency",
  ]);
  const serialized = JSON.stringify(graph);
  assert.equal(serialized.includes("streetAddress"), false);
  assert.equal(serialized.includes("Brand partnerships"), false);

  const events = serviceStructuredData("events");
  const ambassadors = serviceStructuredData("brand-ambassadors");
  assert.equal(events.url, "https://collegiateagency.com/services/events");
  assert.equal(ambassadors.url, "https://collegiateagency.com/services/brand-ambassadors");
  assert.equal(events.provider["@id"], org["@id"]);
  assert.equal(
    serviceStructuredData("product-placement").url,
    "https://collegiateagency.com/services/product-placement",
  );
  assert.equal(serviceStructuredData("product-placement").offers.price, 2500);
  assert.equal(serviceStructuredData("brand-ambassadors").offers.price, 150);
  assert.equal(serviceStructuredData("events").offers.price, undefined);
  assert.equal(serviceStructuredData("events").offers.priceSpecification.minPrice, 500);
  assert.equal(serviceStructuredData("events").offers.priceSpecification.maxPrice, 500000);

  const crumbs = serviceBreadcrumbItems("events", "Events");
  assert.deepEqual(crumbs.map((item) => item.name), ["Home", "Services", "Events"]);
});

test("sitemap uses real dates and omits samples and duplicate insight URLs", () => {
  const { default: sitemap } = loadTs("app/sitemap.ts");
  const { posts, caseStudies, getPost } = loadTs("lib/content.ts");
  const urls = sitemap();
  const byLoc = new Map(urls.map((entry) => [entry.url, entry]));

  assert.equal(urls.some((entry) => entry.lastModified.toISOString().startsWith("2026-01-01")), false);
  assert.equal(byLoc.has("https://collegiateagency.com/work/celsius-campus-sampling"), false);
  assert.equal(byLoc.has("https://collegiateagency.com/insights/sos-consultants-nola-campus-leasing-ambassadors"), false);
  assert.equal(byLoc.has("https://collegiateagency.com/insights/nutrl-night-school-tour-product-placement"), false);
  assert.equal(byLoc.has("https://collegiateagency.com/work/sos-consultants-nola-campus-leasing-ambassadors"), true);
  assert.equal(byLoc.has("https://collegiateagency.com/work/nutrl-night-school-tour-product-placement"), true);

  const article = byLoc.get("https://collegiateagency.com/insights/college-marketing-agency");
  assert.equal(article.lastModified.toISOString(), "2026-10-23T00:00:00.000Z");
  assert.equal(
    byLoc.get("https://collegiateagency.com/work/sos-consultants-nola-campus-leasing-ambassadors").lastModified.toISOString(),
    "2026-08-03T00:00:00.000Z",
  );
  assert.equal(
    byLoc.get("https://collegiateagency.com/work/nutrl-night-school-tour-product-placement").lastModified.toISOString(),
    "2026-08-02T00:00:00.000Z",
  );

  const stamps = new Set(urls.map((entry) => entry.lastModified.toISOString()));
  assert.ok(stamps.size > 1, "lastmod should vary by URL");

  assert.equal(getPost("sos-consultants-nola-campus-leasing-ambassadors"), undefined);
  assert.equal(getPost("nutrl-night-school-tour-product-placement"), undefined);
  assert.equal(posts.some((post) => post.slug === "why-welcome-week-is-the-highest-leverage-moment-on-campus"), true);
  assert.equal(caseStudies.some((study) => study.slug === "celsius-campus-sampling" && study.sample === true), true);
});

test("llms.txt points at real service pages and defines the agency", async () => {
  const { GET } = loadTs("app/llms.txt/route.ts");
  const response = await GET();
  const body = await response.text();
  assert.match(body, /^> Collegiate Agency is a college and campus marketing agency for campus events and brand ambassador programs\./m);
  assert.match(body, /\]\(https:\/\/collegiateagency\.com\/services\/events\)/);
  assert.match(body, /\]\(https:\/\/collegiateagency\.com\/services\/brand-ambassadors\)/);
  assert.equal(body.includes("/services#events"), false);
  assert.equal(body.includes("/services#brand-ambassadors"), false);
  assert.match(body, /shane@zmmevents\.com/);
  assert.equal(body.includes("/insights/sos-consultants-nola-campus-leasing-ambassadors"), false);
  assert.match(body, /\/work\/sos-consultants-nola-campus-leasing-ambassadors/);
});

test("llms-full.txt is generated from the article bodies", async () => {
  const { GET } = loadTs("app/llms-full.txt/route.ts");
  const response = await GET();
  assert.equal(response.headers.get("content-type"), "text/plain; charset=utf-8");
  const body = await response.text();
  assert.match(body, /^# Collegiate Agency — full insight library/m);
  assert.match(body, /URL: https:\/\/collegiateagency\.com\/insights\/college-experiential-marketing-agency/);
  assert.match(body, /A college experiential marketing agency is the partner you hire/);
  assert.match(body, /Q: /);
  assert.ok(body.length > 40000, `llms-full.txt is too short: ${body.length}`);
  assert.equal(body.includes("/insights/sos-consultants-nola-campus-leasing-ambassadors"), false);
});

test("service FAQs are quotable, sourced, and match FAQPage JSON-LD", () => {
  const { servicePageSeo, faqPageStructuredData } = loadTs("lib/service-faqs.ts");
  const { getCaseStudy, getPost } = loadTs("lib/content.ts");
  const { pricing, getStat } = loadTs("site.config.ts");
  const React = require("react");
  const { renderToStaticMarkup } = require("react-dom/server");
  const { ServiceFaq, FaqPageJsonLd } = loadTs("components/services/ServiceFaq.tsx");

  const pages = {
    "brand-ambassadors": servicePageSeo("brand-ambassadors"),
    events: servicePageSeo("events"),
    "product-placement": servicePageSeo("product-placement"),
  };

  for (const [slug, seo] of Object.entries(pages)) {
    assert.ok(seo.faqs.length >= 5 && seo.faqs.length <= 7, slug);
    const data = faqPageStructuredData(seo.faqs, `/services/${slug}`);
    const parsed = JSON.parse(JSON.stringify(data));
    assert.equal(parsed["@context"], "https://schema.org");
    assert.equal(parsed["@type"], "FAQPage");
    assert.equal(parsed.url, `https://collegiateagency.com/services/${slug}`);
    assert.equal(parsed.mainEntity.length, seo.faqs.length);
    seo.faqs.forEach((item, index) => {
      assert.match(item.answer, /Collegiate Agency/);
      const count = item.answer.split(/(?<=[.!?])\s+/).filter(Boolean).length;
      assert.ok(count >= 1 && count <= 3, `${item.question} (${count})`);
      assert.equal(parsed.mainEntity[index].name, item.question);
      assert.equal(parsed.mainEntity[index].acceptedAnswer.text, item.answer);
      assert.equal(parsed.mainEntity[index]["@type"], "Question");
      assert.doesNotMatch(item.answer, /Celsius|11x|ROAS|guarantee|testimonial|\$175|5M|100K|1,200/i);
    });

    const html = renderToStaticMarkup(
      React.createElement(
        React.Fragment,
        null,
        React.createElement(FaqPageJsonLd, { items: seo.faqs, path: `/services/${slug}` }),
        React.createElement(ServiceFaq, { items: seo.faqs }),
      ),
    );
    assert.match(html, /"@type":"FAQPage"/);
    assert.match(html, /<h3[^>]*>/);
    for (const item of seo.faqs) {
      assert.ok(html.includes(item.question), item.question);
      assert.ok(html.includes(item.answer), item.answer.slice(0, 48));
    }
  }

  const ambassadors = pages["brand-ambassadors"];
  const events = pages.events;
  const ambassadorText = ambassadors.faqs.map((item) => item.answer).join(" ");
  const eventText = events.faqs.map((item) => item.answer).join(" ");
  const rate = `${pricing["brand-ambassadors"].range} ${pricing["brand-ambassadors"].unit}`
    .replace(/\s+/g, " ")
    .trim();
  assert.ok(ambassadorText.includes(rate), rate);
  assert.ok(ambassadorText.includes("2 dedicated social posts"));
  assert.ok(ambassadorText.includes(getStat("campuses")));
  assert.ok(ambassadorText.includes("within one business day"));
  const money = (text) => text.match(/\$\d{1,3}(?:,\d{3})*/g);
  assert.deepEqual(money(ambassadorText), [pricing["brand-ambassadors"].range]);

  const eventAmounts = pricing.events.range.match(/\$\d{1,3}(?:,\d{3})*/g);
  assert.deepEqual(money(eventText), eventAmounts);
  assert.ok(eventText.includes("results recap"));
  assert.ok(eventText.includes("Welcome Week"));
  assert.ok(eventText.includes(getStat("campuses")));
  assert.ok(eventText.includes("within one business day"));
  assert.ok(eventText.includes("does not publish a fixed number of weeks"));

  function hrefs(reading) {
    return reading.blocks.flatMap((block) => block.parts.filter((part) => part.href).map((part) => part.href));
  }
  function plain(reading) {
    return reading.blocks.map((block) => block.parts.map((part) => part.text).join("")).join("\n");
  }

  const ambassadorHrefs = hrefs(ambassadors.reading);
  assert.deepEqual(ambassadorHrefs, [
    "/work/sos-consultants-nola-campus-leasing-ambassadors",
    "/insights/college-brand-ambassador-program",
    "/insights/college-brand-ambassadors",
    "/pricing",
    "/build-a-campaign",
    "/contact",
    "/services/product-placement",
  ]);
  const eventHrefs = hrefs(events.reading);
  assert.deepEqual(eventHrefs, [
    "/work/nutrl-night-school-tour-product-placement",
    "/insights/university-activations",
    "/insights/college-event-sponsorship",
    "/insights/campus-brand-activation-agency",
    "/pricing",
    "/build-a-campaign",
    "/contact",
    "/services/product-placement",
  ]);

  for (const href of [...ambassadorHrefs, ...eventHrefs]) {
    if (href.startsWith("/insights/")) {
      assert.ok(getPost(href.slice("/insights/".length)), href);
    }
    if (href.startsWith("/work/")) {
      const study = getCaseStudy(href.slice("/work/".length));
      assert.ok(study && study.sample !== true, href);
      assert.ok(plain(href.includes("sos") ? ambassadors.reading : events.reading).includes(study.approach));
    }
  }

  const servicePage = fs.readFileSync(path.join(__dirname, "../src/components/services/ServicePage.tsx"), "utf8");
  assert.match(servicePage, /<ServiceJsonLd slug=\{slug\} \/>/);
  assert.match(servicePage, /<BreadcrumbJsonLd /);
  assert.match(servicePage, /<FaqPageJsonLd items=\{pageSeo\.faqs\}/);
  assert.match(servicePage, /<ServiceFaq items=\{pageSeo\.faqs\} \/>/);

  const { default: sitemap } = loadTs("app/sitemap.ts");
  const byLoc = new Map(sitemap().map((entry) => [entry.url, entry]));
  assert.equal(
    byLoc.get("https://collegiateagency.com/services/events").lastModified.toISOString(),
    "2026-10-21T00:00:00.000Z",
  );
  assert.equal(
    byLoc.get("https://collegiateagency.com/services/brand-ambassadors").lastModified.toISOString(),
    "2026-10-21T00:00:00.000Z",
  );
  assert.equal(
    byLoc.get("https://collegiateagency.com/contact").lastModified.toISOString(),
    "2026-10-20T00:00:00.000Z",
  );
});

test("services metadata is brand-only and unsourced sampling stats are absent", async () => {
  const { servicesHub } = loadTs("site.config.ts");
  const { pageMetadata, TITLE_LIMIT } = loadTs("lib/seo.ts");
  const { caseStudies } = loadTs("lib/content.ts");
  const { GET } = loadTs("app/llms.txt/route.ts");
  const meta = pageMetadata({
    title: servicesHub.documentTitle,
    description: servicesHub.description,
    path: "/services",
  });
  const title = meta.title.absolute;
  assert.equal(title, "Campus Marketing Services for Brands | Collegiate Agency");
  assert.ok(title.length <= TITLE_LIMIT, `${title} (${title.length})`);
  assert.equal(title.split("Collegiate Agency").length - 1, 1);
  assert.equal(meta.description, servicesHub.description);
  assert.equal(meta.openGraph.title.absolute, title);
  assert.equal(meta.openGraph.description, servicesHub.description);
  assert.equal(meta.twitter.title.absolute, title);
  assert.equal(meta.twitter.description, servicesHub.description);
  assert.equal(/student/i.test(servicesHub.description), false);
  assert.equal(/student/i.test(servicesHub.heroTitle), false);
  assert.equal(/for students|pick your side|two sides/i.test(servicesHub.intro), false);

  const page = fs.readFileSync(path.join(__dirname, "../src/app/services/page.tsx"), "utf8");
  assert.match(page, /servicesHub\.documentTitle/);
  assert.match(page, /servicesHub\.description/);
  assert.match(page, /servicesHub\.heroTitle/);
  assert.match(page, /<WebPageJsonLd /);
  assert.match(page, /id="for-students"/);
  assert.equal(page.includes("For brands and for students"), false);
  assert.equal(page.includes("One team. Two sides"), false);
  assert.equal(page.includes("AudienceTabs"), false);

  const celsius = caseStudies.find((study) => study.slug === "celsius-campus-sampling");
  assert.equal(celsius.sample, true);
  assert.equal(celsius.stat, undefined);
  assert.equal(celsius.statLabel, undefined);
  assert.deepEqual(celsius.metrics, []);
  const serialized = JSON.stringify(caseStudies);
  assert.equal(serialized.includes("45K"), false);
  assert.equal(serialized.includes("cans sampled"), false);
  assert.equal(serialized.includes("120+"), false);
  assert.equal(serialized.includes("opt-in rate"), false);
  assert.equal(serialized.includes("trial-to-repeat"), false);

  const llms = await (await GET()).text();
  assert.equal(llms.includes("45K"), false);
  assert.equal(llms.includes("cans sampled"), false);

  const { default: sitemap } = loadTs("app/sitemap.ts");
  const services = sitemap().find((entry) => entry.url === "https://collegiateagency.com/services");
  assert.equal(services.lastModified.toISOString(), "2026-10-26T00:00:00.000Z");
});

test("case-study insight URLs permanently redirect to /work", () => {
  const config = fs.readFileSync(path.join(__dirname, "../next.config.mjs"), "utf8");
  assert.match(config, /\/insights\/sos-consultants-nola-campus-leasing-ambassadors/);
  assert.match(config, /\/work\/sos-consultants-nola-campus-leasing-ambassadors/);
  assert.match(config, /\/insights\/nutrl-night-school-tour-product-placement/);
  assert.match(config, /statusCode: 301/);
});
