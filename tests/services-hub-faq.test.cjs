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

test("services hub FAQ is visible, matches FAQPage JSON-LD, and stays on published facts", () => {
  const React = require("react");
  const { renderToStaticMarkup } = require("react-dom/server");
  const { servicesHubFaqs, servicesHubReading } = loadTs("lib/services-hub-faq.ts");
  const { faqAnswerPlainText } = loadTs("lib/article-faq.ts");
  const { faqPageStructuredData } = loadTs("lib/service-faqs.ts");
  const { publishedRate } = loadTs("lib/pricing-page.ts");
  const { getStat, servicesHub, siteConfig } = loadTs("site.config.ts");
  const { getPost } = loadTs("lib/content.ts");
  const { FaqPageJsonLd, ServiceFaq, ServiceReading } = loadTs("components/services/ServiceFaq.tsx");
  const { pageMetadata, resolveDocumentTitle, TITLE_LIMIT } = loadTs("lib/seo.ts");

  const faqs = servicesHubFaqs();
  assert.ok(faqs.length >= 5 && faqs.length <= 7, `expected 5 to 7 questions, got ${faqs.length}`);
  assert.equal(new Set(faqs.map((item) => item.question)).size, faqs.length);
  assert.match(faqs.map((item) => item.question).join(" "), /campus marketing agency/i);

  const reading = servicesHubReading();
  const html = renderToStaticMarkup(
    React.createElement(
      React.Fragment,
      null,
      React.createElement(FaqPageJsonLd, { items: faqs, path: "/services" }),
      React.createElement(ServiceReading, { reading }),
      React.createElement(ServiceFaq, { items: faqs }),
    ),
  );
  const blocks = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || [];
  assert.equal(blocks.length, 1);
  assert.equal((html.match(/"@type":"FAQPage"/g) || []).length, 1);
  const data = JSON.parse(blocks[0].replace(/^<script type="application\/ld\+json">/, "").replace(/<\/script>$/, ""));
  assert.deepEqual(data, faqPageStructuredData(faqs, "/services"));
  assert.equal(data["@type"], "FAQPage");
  assert.equal(data["@id"], "https://collegiateagency.com/services#faq");
  assert.equal(data.url, "https://collegiateagency.com/services");

  const questions = [...html.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/g)].map((match) => decode(match[1]));
  const answers = [...html.matchAll(/<dd[^>]*>([\s\S]*?)<\/dd>/g)].map((match) => decode(match[1]));
  assert.deepEqual(questions, faqs.map((item) => item.question));
  data.mainEntity.forEach((entity, index) => {
    const plain = faqAnswerPlainText(faqs[index].answer);
    assert.equal(entity.name, questions[index]);
    assert.equal(entity.acceptedAnswer["@type"], "Answer");
    assert.equal(entity.acceptedAnswer.text, answers[index]);
    assert.equal(entity.acceptedAnswer.text, plain);
    assert.match(plain, /Collegiate Agency/);
    const count = plain.split(/(?<=[.!?])\s+/).filter(Boolean).length;
    assert.ok(count >= 1 && count <= 3, `${entity.name} (${count})`);
    assert.doesNotMatch(plain, /intern|zmmevents|zmm\.events|SOS Consultants|Celsius|@|testimonial|guarantee|become-an-ambassador|agency for students/i);
  });

  const text = answers.join(" ");
  assert.match(text, /campus marketing agency/);
  assert.match(text, /College students are the audience of the programs brands hire/);
  assert.match(text, /ambassador roster is the network a brand hires the agency to field/);
  assert.ok(text.includes(`${getStat("ambassadors")} student ambassadors`));
  assert.ok(text.includes(publishedRate("brand-ambassadors")));
  assert.ok(text.includes(publishedRate("product-placement")));
  assert.match(text, /event packages from \$500 to \$500,000/);
  assert.match(text, /quoted per campaign/);
  assert.ok(text.includes(`${getStat("speedToActivation")} from a signed SOW to boots on the ground`));
  assert.match(text, /within one business day/);
  assert.ok(text.includes(siteConfig.contact.location));
  assert.ok(text.includes(`${getStat("campuses")} campuses`));
  assert.match(text, /Brands, in-house marketing teams, and agencies/);
  assert.doesNotMatch(text, /20M\+|100K\+|20\+ brands|\$175|\$10,000/);

  const links = [...html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)].map((match) => ({
    href: match[1],
    anchor: decode(match[2]),
  }));
  const expected = [
    ["/services/events", "campus events and activations"],
    ["/services/brand-ambassadors", "brand ambassador"],
    ["/services/product-placement", "Greek-life product placement"],
    ["/pricing", "pricing"],
    ["/build-a-campaign", "build a campaign"],
    ["/build-a-campaign", "builds a campaign"],
    ["/contact", "gets in touch"],
    ["/contact", "contact"],
    ["/insights/college-marketing-agency", "college marketing agency guide"],
    ["/insights/campus-marketing-agency-rfp", "campus marketing agency RFP"],
    ["/insights/campus-brand-activation-agency", "campus brand activation agency checklist"],
    ["/insights/college-brand-ambassador-program", "college brand ambassador program guide"],
    ["/services/events", "campus events"],
    ["/services/brand-ambassadors", "brand ambassadors"],
    ["/services/product-placement", "product placement"],
    ["/contact", "contact Collegiate Agency"],
  ];
  for (const [href, anchor] of expected) {
    assert.ok(
      links.some((link) => link.href === href && link.anchor === anchor),
      `missing ${href} (${anchor})`,
    );
  }
  for (const link of links.filter((item) => item.href.startsWith("/insights/"))) {
    assert.ok(getPost(link.href.slice("/insights/".length)), link.href);
  }

  const title = resolveDocumentTitle(servicesHub.documentTitle).text;
  assert.equal(title, "Campus Marketing Agency for Brands | Collegiate Agency");
  assert.ok(title.length <= TITLE_LIMIT, `${title} (${title.length})`);
  assert.equal(title.split("Collegiate Agency").length - 1, 1);
  assert.match(servicesHub.description, /campus marketing agency/i);
  assert.match(servicesHub.description, /brands hire/i);
  assert.match(servicesHub.description, /campus events/i);
  assert.match(servicesHub.description, /brand ambassadors/i);
  assert.match(servicesHub.description, /product placement/i);
  assert.match(servicesHub.description, /Collegiate Agency/);
  assert.ok(servicesHub.description.length <= 160, `${servicesHub.description.length}: ${servicesHub.description}`);
  assert.doesNotMatch(servicesHub.description, /student/i);
  assert.match(servicesHub.heroTitle, /campus marketing agency/i);
  assert.doesNotMatch(servicesHub.heroTitle, /student/i);
  assert.match(servicesHub.intro, /campus marketing agency/i);
  assert.match(servicesHub.intro, /Brands hire/i);
  assert.doesNotMatch(servicesHub.intro, /for students|pick your side|two sides/i);
  const meta = pageMetadata({
    title: servicesHub.documentTitle,
    description: servicesHub.description,
    path: "/services",
  });
  assert.equal(meta.title.absolute, title);
  assert.equal(meta.description, servicesHub.description);
  assert.equal(meta.openGraph.title.absolute, title);
  assert.equal(meta.openGraph.description, servicesHub.description);
  assert.equal(meta.twitter.title.absolute, title);
  assert.equal(meta.twitter.description, servicesHub.description);

  const page = fs.readFileSync(path.join(__dirname, "../src/app/services/page.tsx"), "utf8");
  const brandsStart = page.indexOf("function BrandsPanel");
  const brandsEnd = page.indexOf("function StudentsPanel");
  const brands = page.slice(brandsStart, brandsEnd);
  assert.ok(brands.indexOf("<ServiceReading") < brands.indexOf('id="faq"'));
  assert.ok(brands.indexOf('id="faq"') < brands.indexOf("Ready to reach students?"));
  assert.match(brands, /<ServiceFaq items=\{faqs\} \/>/);
  assert.equal(brands.includes("for-students"), false);

  const students = page.slice(brandsEnd, page.indexOf("export default function ServicesPage"));
  assert.equal(students.includes("ServiceFaq"), false);
  assert.equal(students.includes("FaqPageJsonLd"), false);

  const main = page.slice(page.indexOf("export default function ServicesPage"));
  assert.equal((main.match(/<FaqPageJsonLd /g) || []).length, 1);
  assert.match(main, /<FaqPageJsonLd items=\{faqs\} path="\/services" \/>/);
  assert.ok(main.indexOf("<FaqPageJsonLd") < main.indexOf('id="for-brands"'));
  assert.ok(main.indexOf('as="h1"') < main.indexOf("<BrandsPanel"));
  assert.ok(main.indexOf('id="for-brands"') < main.indexOf("<BrandsPanel"));
  assert.ok(main.indexOf("<BrandsPanel") < main.indexOf('id="for-students"'));
  assert.equal(main.includes("<ServiceFaq"), false);

  const { default: sitemap } = loadTs("app/sitemap.ts");
  const urls = sitemap();
  const services = urls.find((entry) => entry.url === "https://collegiateagency.com/services");
  assert.equal(services.lastModified.toISOString(), "2026-11-05T00:00:00.000Z");
  const home = urls.find((entry) => entry.url === "https://collegiateagency.com");
  assert.equal(home.lastModified.toISOString(), "2026-11-04T00:00:00.000Z");
  const pricing = urls.find((entry) => entry.url === "https://collegiateagency.com/pricing");
  assert.equal(pricing.lastModified.toISOString(), "2026-10-22T00:00:00.000Z");
  const events = urls.find((entry) => entry.url === "https://collegiateagency.com/services/events");
  assert.equal(events.lastModified.toISOString(), "2026-10-21T00:00:00.000Z");
  const about = urls.find((entry) => entry.url === "https://collegiateagency.com/about");
  assert.equal(about.lastModified.toISOString(), "2026-10-27T00:00:00.000Z");
});
