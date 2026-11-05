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

test("homepage FAQ is visible, matches FAQPage JSON-LD, and stays on published facts", () => {
  const React = require("react");
  const { renderToStaticMarkup } = require("react-dom/server");
  const { homeFaqs } = loadTs("lib/home-faq.ts");
  const { faqAnswerPlainText } = loadTs("lib/article-faq.ts");
  const { faqPageStructuredData } = loadTs("lib/service-faqs.ts");
  const { publishedRate } = loadTs("lib/pricing-page.ts");
  const { getStat, siteConfig } = loadTs("site.config.ts");
  const { FaqPageJsonLd, ServiceFaq } = loadTs("components/services/ServiceFaq.tsx");

  const faqs = homeFaqs();
  assert.ok(faqs.length >= 5 && faqs.length <= 6, `expected 5 or 6 questions, got ${faqs.length}`);
  assert.equal(new Set(faqs.map((item) => item.question)).size, faqs.length);

  const html = renderToStaticMarkup(
    React.createElement(
      React.Fragment,
      null,
      React.createElement(FaqPageJsonLd, { items: faqs, path: "/" }),
      React.createElement(ServiceFaq, { items: faqs }),
    ),
  );
  const blocks = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || [];
  assert.equal(blocks.length, 1);
  assert.equal((html.match(/"@type":"FAQPage"/g) || []).length, 1);
  const data = JSON.parse(blocks[0].replace(/^<script type="application\/ld\+json">/, "").replace(/<\/script>$/, ""));
  assert.deepEqual(data, faqPageStructuredData(faqs, "/"));
  assert.equal(data["@type"], "FAQPage");
  assert.equal(data["@id"], "https://collegiateagency.com#faq");
  assert.equal(data.url, "https://collegiateagency.com");

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
    assert.doesNotMatch(plain, /intern|zmmevents|zmm\.events|SOS Consultants|Celsius|@|testimonial|guarantee/i);
  });

  const text = answers.join(" ");
  assert.match(text, /college and campus marketing agency/);
  assert.match(text, /Students are the audience of the programs brands hire/);
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
  assert.equal(getStat("campuses"), String(siteConfig.campuses.length));
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
    ["/services", "services"],
    ["/pricing", "pricing"],
    ["/become-an-ambassador", "ambassador application"],
    ["/contact", "contact"],
  ];
  for (const [href, anchor] of expected) {
    assert.ok(
      links.some((link) => link.href === href && link.anchor === anchor),
      `missing ${href} (${anchor})`,
    );
  }

  const page = fs.readFileSync(path.join(__dirname, "../src/app/page.tsx"), "utf8");
  assert.match(page, /title:\s*HOME_TITLE_LEAD/);
  assert.match(page, /description:\s*HOME_DESCRIPTION/);
  assert.match(page, /const faqs = homeFaqs\(\)/);
  assert.match(page, /<FaqPageJsonLd items=\{faqs\} path="\/" \/>/);
  assert.match(page, /<ServiceFaq items=\{faqs\} \/>/);
  assert.ok(page.indexOf("<Hero") < page.indexOf("<ServiceFaq"));
  assert.ok(page.indexOf("<ServiceFaq") < page.indexOf("<CTASection"));
  assert.equal(page.includes('id="faq"'), true);

  const hero = fs.readFileSync(path.join(__dirname, "../src/components/home/Hero.tsx"), "utf8");
  const h1 = hero.slice(hero.indexOf("<h1"), hero.indexOf("</h1>"));
  assert.doesNotMatch(h1, /opacity/);
  assert.doesNotMatch(hero, /motion\.h1/);

  const { default: sitemap } = loadTs("app/sitemap.ts");
  const urls = sitemap();
  const home = urls.find((entry) => entry.url === "https://collegiateagency.com");
  assert.equal(home.lastModified.toISOString(), "2026-11-04T00:00:00.000Z");
  const services = urls.find((entry) => entry.url === "https://collegiateagency.com/services");
  assert.equal(services.lastModified.toISOString(), "2026-11-05T00:00:00.000Z");
  const pricing = urls.find((entry) => entry.url === "https://collegiateagency.com/pricing");
  assert.equal(pricing.lastModified.toISOString(), "2026-10-22T00:00:00.000Z");
});
