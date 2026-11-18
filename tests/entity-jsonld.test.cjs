const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

const ORG_ID = "https://collegiateagency.com/#organization";
const PERSON_ID = "https://collegiateagency.com/#shane-michelon";
const LINKEDIN = "https://www.linkedin.com/in/shane-michelon-189549227";
const NEW_ORG_PROFILES = [
  "https://issuu.com/collegiateagency",
  "https://campusmarketingnotes.substack.com",
  "https://campusmarketingplaybook.wordpress.com",
  "https://campusmarketingnotesforbrands.blogspot.com",
  "https://www.tumblr.com/campusnotesforbrands",
];
const KEPT_ORG_PROFILES = [
  "https://www.instagram.com/zmmevents",
  "https://www.instagram.com/nightschooltour",
  "https://www.zmm.events",
  "https://www.linkedin.com/company/collegiate-agency",
  "https://clutch.co/profile/collegiate-agency",
  "https://www.sortlist.com/agency/collegiate-agency",
];

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
    id.startsWith("@/") ? load(resolveSrc(path.join(__dirname, "../src", id.slice(2)))) : require(id);
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

function jsonLdBlocks(html) {
  const out = [];
  const re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  let match;
  while ((match = re.exec(html))) out.push(JSON.parse(match[1]));
  return out;
}

function organizationIds(nodes) {
  const ids = [];
  const walk = (value) => {
    if (!value || typeof value !== "object") return;
    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }
    const type = value["@type"];
    const types = Array.isArray(type) ? type : type ? [type] : [];
    if (types.includes("Organization") && typeof value["@id"] === "string") ids.push(value["@id"]);
    for (const child of Object.values(value)) walk(child);
  };
  nodes.forEach(walk);
  return ids;
}

test("homepage, about, and the money page keep one organization id and the new profiles", () => {
  const { renderToStaticMarkup } = require("react-dom/server");
  const { createElement } = require("react");
  const { organizationStructuredData, aboutStructuredData, FOUNDER_DESCRIPTION } = loadTs("lib/seo.ts");
  const { OrganizationJsonLd, AboutPageJsonLd, ArticleJsonLd } = loadTs("components/seo/JsonLd.tsx");
  const { getPost } = loadTs("lib/content.ts");
  const post = getPost("college-marketing-agency");
  assert.ok(post);

  const org = organizationStructuredData()[0];
  assert.equal(org.foundingDate, "2026");
  assert.deepEqual(org.numberOfEmployees, { "@type": "QuantitativeValue", minValue: 6, maxValue: 10 });
  for (const url of [...KEPT_ORG_PROFILES, ...NEW_ORG_PROFILES]) assert.ok(org.sameAs.includes(url), url);
  assert.equal(org.sameAs.includes("https://www.crunchbase.com/organization/collegiate-agency"), false);

  const home = jsonLdBlocks(renderToStaticMarkup(createElement(OrganizationJsonLd)));
  assert.deepEqual([...new Set(organizationIds(home))], [ORG_ID]);
  assert.equal(home.filter((node) => Array.isArray(node["@type"]) && node["@type"].includes("Organization")).length, 1);

  const aboutHtml = renderToStaticMarkup(createElement(AboutPageJsonLd));
  const about = jsonLdBlocks(aboutHtml);
  assert.equal(about.length, 1);
  assert.deepEqual([...new Set(organizationIds([...home, ...about]))], [ORG_ID]);
  const aboutPeople = about[0]["@graph"].filter((node) => node["@type"] === "Person");
  assert.equal(aboutPeople[0]["@id"], PERSON_ID);
  assert.equal(aboutPeople[0].url, LINKEDIN);
  assert.equal(aboutPeople[0].description, FOUNDER_DESCRIPTION);
  assert.equal(aboutPeople[0].image, "https://collegiateagency.com/team/shane-michelon.png");
  for (const url of [
    LINKEDIN,
    "https://about.me/shanemichelon",
    "https://medium.com/@shanemichelon",
    "https://www.quora.com/profile/Shane-Michelon-2",
  ]) {
    assert.ok(aboutPeople[0].sameAs.includes(url), url);
  }
  assert.equal(fs.existsSync(path.join(__dirname, "../public/team/shane-michelon.png")), true);

  const article = jsonLdBlocks(
    renderToStaticMarkup(
      createElement(ArticleJsonLd, {
        title: post.title,
        description: post.excerpt,
        slug: post.slug,
        date: post.date,
        dateModified: post.dateModified,
        author: post.author,
        image: post.image,
      }),
    ),
  );
  assert.equal(article.length, 1);
  assert.deepEqual(article[0]["@type"], ["Article", "BlogPosting"]);
  assert.equal(article[0].author["@id"], PERSON_ID);
  assert.equal(article[0].author.url, LINKEDIN);
  assert.deepEqual([...new Set(organizationIds([...home, ...article]))], [ORG_ID]);
  assert.equal(JSON.stringify(aboutStructuredData()).split(ORG_ID).length > 1, true);
});

test("real case studies emit Article JSON-LD and the sample study does not", () => {
  const { renderToStaticMarkup } = require("react-dom/server");
  const { createElement } = require("react");
  const { caseStudies } = loadTs("lib/content.ts");
  const { CaseStudyArticleJsonLd } = loadTs("components/seo/CaseStudyJsonLd.tsx");
  const real = caseStudies.filter((study) => !study.sample);
  assert.deepEqual(
    real.map((study) => study.slug).sort(),
    ["nutrl-night-school-tour-product-placement", "sos-consultants-nola-campus-leasing-ambassadors"],
  );

  for (const study of real) {
    const blocks = jsonLdBlocks(renderToStaticMarkup(createElement(CaseStudyArticleJsonLd, { study })));
    assert.equal(blocks.length, 1, study.slug);
    const data = blocks[0];
    assert.equal(data["@type"], "Article");
    assert.equal(data.headline, study.headline);
    assert.equal(data.datePublished, study.date);
    assert.equal(data.dateModified, study.dateModified ?? study.date);
    assert.equal(data.author["@id"], PERSON_ID);
    assert.equal(data.author.url, LINKEDIN);
    assert.deepEqual(data.publisher, { "@id": ORG_ID });
    assert.deepEqual(data.about, { "@type": "Organization", name: study.brand });
    assert.equal("sameAs" in data.about, false);
    if (study.image) {
      assert.equal(data.image, `https://collegiateagency.com${study.image}`);
    } else {
      assert.equal("image" in data, false, study.slug);
    }
  }

  const sample = caseStudies.find((study) => study.sample);
  assert.equal(sample.slug, "celsius-campus-sampling");
  assert.equal(renderToStaticMarkup(createElement(CaseStudyArticleJsonLd, { study: sample })), "");

  const page = fs.readFileSync(path.join(__dirname, "../src/app/work/[slug]/page.tsx"), "utf8");
  assert.match(page, /<CaseStudyArticleJsonLd study=\{c\} \/>/);
});
