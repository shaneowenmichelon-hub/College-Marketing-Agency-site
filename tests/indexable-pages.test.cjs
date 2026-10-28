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

function readPage(rel) {
  return fs.readFileSync(path.join(__dirname, "../src/app", rel), "utf8");
}

const PAGES = [
  ["work", "WORK_TITLE", "WORK_DESCRIPTION", "workIndexableText", "/work"],
  ["contact", "CONTACT_TITLE", "CONTACT_DESCRIPTION", "contactIndexableText", "/contact"],
  ["build", "BUILD_TITLE", "BUILD_DESCRIPTION", "buildIndexableText", "/build-a-campaign"],
];

test("thin pages have unique titles, descriptions, and 150 to 350 words", () => {
  const pages = loadTs("lib/indexable-pages.ts");
  const { pageMetadata, resolveDocumentTitle, TITLE_LIMIT } = loadTs("lib/seo.ts");
  const titles = new Set();
  const descriptions = new Set();

  for (const [, titleKey, descriptionKey, textKey, route] of PAGES) {
    const lead = pages[titleKey];
    const description = pages[descriptionKey];
    const resolved = resolveDocumentTitle(lead).text;
    assert.ok(resolved.length <= TITLE_LIMIT, `${resolved} (${resolved.length})`);
    assert.equal(resolved.split("Collegiate Agency").length - 1, 1, resolved);
    assert.equal(titles.has(resolved), false, resolved);
    assert.equal(descriptions.has(description), false, description);
    titles.add(resolved);
    descriptions.add(description);

    const meta = pageMetadata({ title: lead, description, path: route });
    assert.equal(meta.title.absolute, resolved);
    assert.equal(meta.description, description);
    assert.equal(meta.openGraph.title.absolute, resolved);
    assert.equal(meta.openGraph.description, description);
    assert.equal(meta.openGraph.url, `https://collegiateagency.com${route === "/" ? "" : route}`);
    assert.equal(meta.twitter.title.absolute, resolved);
    assert.equal(meta.twitter.description, description);

    const words = pages.countWords(pages[textKey]());
    assert.ok(words >= 150 && words <= 350, `${textKey} has ${words} words`);
  }
});

test("thin-page copy stays inside published facts and brand framing", () => {
  const pages = loadTs("lib/indexable-pages.ts");
  const { pricing, siteConfig } = loadTs("site.config.ts");
  const { caseStudies } = loadTs("lib/content.ts");
  const text = `${pages.workIndexableText()}\n${pages.contactIndexableText()}\n${pages.buildIndexableText()}`;

  assert.equal(text.includes("\u2014"), false);
  assert.equal(/intern/i.test(text), false);
  assert.equal(/student-run|staffed by students|agency for students|our students/i.test(text), false);
  assert.equal(text.includes("@"), false);
  assert.equal(/\b(?:street|avenue|suite|blvd|boulevard)\b/i.test(text), false);
  assert.equal(/\(\d{3}\)|\d{3}-\d{3}-\d{4}/.test(text), false);
  assert.match(text, /college and campus marketing agency/);
  assert.match(text, /Brands hire it to reach college students/);

  const allowedMoney = `${JSON.stringify(pricing)} ${siteConfig.budgetRanges.join(" ")}`;
  for (const amount of text.match(/\$[\d,]+/g) ?? []) {
    assert.ok(allowedMoney.includes(amount), amount);
  }

  for (const study of caseStudies) {
    assert.ok(pages.workIndexableText().includes(study.challenge.trim()), study.slug);
    if (study.sample) {
      assert.match(pages.caseStudyBlurb(study), /^Industry example, not a verified client result\./);
    } else {
      assert.equal(pages.caseStudyBlurb(study), study.challenge.trim());
    }
  }

  const hrefs = [
    ...pages.hrefsIn(pages.workIntro()),
    ...pages.hrefsIn([pages.contactLead()]),
    ...pages.hrefsIn(pages.contactBody()),
    ...pages.hrefsIn(pages.buildLead()),
    ...pages.hrefsIn(pages.buildGets()),
  ];
  for (const path of pages.CONTEXTUAL_PATHS) {
    assert.ok(hrefs.includes(path), path);
  }
  assert.equal(siteConfig.contact.email, "shane@zmmevents.com");
  assert.equal(siteConfig.contact.location, "New York, NY");
  assert.equal(siteConfig.contact.phone, "");
});

test("contact FAQ JSON-LD matches the visible questions", () => {
  const React = require("react");
  const { renderToStaticMarkup } = require("react-dom/server");
  const pages = loadTs("lib/indexable-pages.ts");
  const { faqPageStructuredData } = loadTs("lib/service-faqs.ts");
  const { FaqPageJsonLd, ServiceFaq } = loadTs("components/services/ServiceFaq.tsx");
  const faqs = pages.contactFaqs();
  assert.ok(faqs.length >= 3 && faqs.length <= 5);

  for (const item of faqs) {
    assert.match(item.answer, /Collegiate Agency/);
    const sentences = item.answer.split(/(?<=[.!?])\s+/).filter(Boolean);
    assert.ok(sentences.length >= 1 && sentences.length <= 3, item.question);
  }

  const html = renderToStaticMarkup(
    React.createElement(
      React.Fragment,
      null,
      React.createElement(FaqPageJsonLd, { items: faqs, path: "/contact" }),
      React.createElement(ServiceFaq, { items: faqs }),
    ),
  );
  const data = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.equal(data["@type"], "FAQPage");
  assert.equal(data["@id"], "https://collegiateagency.com/contact#faq");
  assert.deepEqual(data, faqPageStructuredData(faqs, "/contact"));
  const questions = [...html.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/g)].map((match) => match[1]);
  const answers = [...html.matchAll(/<dd[^>]*>([\s\S]*?)<\/dd>/g)].map((match) => match[1]);
  data.mainEntity.forEach((entity, index) => {
    assert.equal(entity.name, questions[index]);
    assert.equal(entity.acceptedAnswer.text, answers[index]);
    assert.equal(entity.acceptedAnswer.text, faqs[index].answer);
  });
});

test("the three pages render the copy in server components and keep the forms", () => {
  const work = readPage("work/page.tsx");
  const contact = readPage("contact/page.tsx");
  const build = readPage("build-a-campaign/page.tsx");
  const detail = readPage("work/[slug]/page.tsx");
  const builder = fs.readFileSync(
    path.join(__dirname, "../src/components/campaign/CampaignBuilder.tsx"),
    "utf8",
  );
  const form = fs.readFileSync(path.join(__dirname, "../src/components/forms/ContactForm.tsx"), "utf8");

  assert.match(work, /title: WORK_TITLE/);
  assert.match(work, /description: WORK_DESCRIPTION/);
  assert.match(work, /<CopyBlocks blocks=\{workIntro\(\)\}/);
  assert.match(work, /caseStudyBlurb\(c\)/);
  assert.match(work, /<BreadcrumbJsonLd/);
  assert.match(work, /<h3 /);

  assert.match(contact, /title: CONTACT_TITLE/);
  assert.match(contact, /description: CONTACT_DESCRIPTION/);
  assert.match(contact, /<CopyBlocks blocks=\{\[contactLead\(\)\]\}/);
  assert.match(contact, /<CopyBlocks blocks=\{contactBody\(\)\}/);
  assert.match(contact, /<FaqPageJsonLd items=\{faqs\} path="\/contact" \/>/);
  assert.match(contact, /<ServiceFaq items=\{faqs\} \/>/);
  assert.match(contact, /<BreadcrumbJsonLd/);
  assert.match(contact, /siteConfig\.contact\.email/);
  assert.match(contact, /office\.address/);
  assert.match(contact, /<ContactForm \/>/);

  assert.match(build, /title: BUILD_TITLE/);
  assert.match(build, /description: BUILD_DESCRIPTION/);
  assert.match(build, /<CopyBlocks blocks=\{buildLead\(\)\}/);
  assert.match(build, /<ArticleTable block=\{buildTable\(\)\}/);
  assert.match(build, /<CampaignBuilder \/>/);
  assert.match(build, /<BreadcrumbJsonLd/);

  assert.match(detail, /index: !c\.sample/);
  assert.match(builder, /trackEvent\("generate_lead", \{ form: "campaign_builder"/);
  assert.equal(/<h1 /.test(builder), false);
  assert.match(form, /trackEvent\("generate_lead", \{ form: "contact"/);

  const { default: sitemap } = loadTs("app/sitemap.ts");
  const byLoc = new Map(sitemap().map((entry) => [entry.url, entry]));
  for (const route of ["/work", "/contact", "/build-a-campaign"]) {
    assert.equal(
      byLoc.get(`https://collegiateagency.com${route}`).lastModified.toISOString(),
      "2026-10-28T00:00:00.000Z",
      route,
    );
  }
  assert.equal(byLoc.has("https://collegiateagency.com/work/celsius-campus-sampling"), false);
});
