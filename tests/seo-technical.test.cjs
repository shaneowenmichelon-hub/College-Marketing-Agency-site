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
    "Services - For brands and for students",
    "Campus event marketing",
    "Brand ambassador programs",
    "Campus marketing insights",
    "Build a campus campaign",
    "Become a campus ambassador",
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
  assert.equal(org.logo.url, "https://collegiateagency.com/logo.svg");
  const serialized = JSON.stringify(graph);
  assert.equal(serialized.includes("streetAddress"), false);
  assert.equal(serialized.includes("Brand partnerships"), false);

  const events = serviceStructuredData("events");
  const ambassadors = serviceStructuredData("brand-ambassadors");
  assert.equal(events.url, "https://collegiateagency.com/services/events");
  assert.equal(ambassadors.url, "https://collegiateagency.com/services/brand-ambassadors");
  assert.equal(events.provider["@id"], org["@id"]);
  assert.equal(serviceStructuredData("product-placement").url, "https://collegiateagency.com/services#product-placement");

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
  assert.equal(article.lastModified.toISOString(), "2026-07-29T00:00:00.000Z");
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

test("case-study insight URLs permanently redirect to /work", () => {
  const config = fs.readFileSync(path.join(__dirname, "../next.config.mjs"), "utf8");
  assert.match(config, /\/insights\/sos-consultants-nola-campus-leasing-ambassadors/);
  assert.match(config, /\/work\/sos-consultants-nola-campus-leasing-ambassadors/);
  assert.match(config, /\/insights\/nutrl-night-school-tour-product-placement/);
  assert.match(config, /statusCode: 301/);
});
