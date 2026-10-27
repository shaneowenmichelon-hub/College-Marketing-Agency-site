const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

const LINKEDIN = "https://www.linkedin.com/in/shane-michelon-189549227";
const PERSON_ID = "https://collegiateagency.com/#shane-michelon";
const ORG_ID = "https://collegiateagency.com/#organization";

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

test("about metadata is brand-framed and the title stays within 60 characters", () => {
  const { ABOUT_TITLE_LEAD, ABOUT_DESCRIPTION, pageMetadata, resolveDocumentTitle, TITLE_LIMIT } = loadTs("lib/seo.ts");
  const meta = pageMetadata({
    title: ABOUT_TITLE_LEAD,
    description: ABOUT_DESCRIPTION,
    path: "/about",
  });
  const title = meta.title.absolute;
  assert.equal(title, resolveDocumentTitle(ABOUT_TITLE_LEAD).text);
  assert.equal(title, "About the college marketing agency | Collegiate Agency");
  assert.ok(title.length <= TITLE_LIMIT, `${title} (${title.length})`);
  assert.equal(title.split("Collegiate Agency").length - 1, 1);
  assert.ok(ABOUT_DESCRIPTION.length <= 160, ABOUT_DESCRIPTION);
  assert.match(ABOUT_DESCRIPTION, /brands hire/i);
  assert.match(ABOUT_DESCRIPTION, /Shane Michelon/);
  assert.match(ABOUT_DESCRIPTION, /college marketing agency/);
  assert.equal(/^students?\b/i.test(ABOUT_DESCRIPTION), false);
  assert.equal(meta.description, ABOUT_DESCRIPTION);
  assert.equal(meta.openGraph.title.absolute, title);
  assert.equal(meta.openGraph.description, ABOUT_DESCRIPTION);
  assert.equal(meta.openGraph.url, "https://collegiateagency.com/about");
  assert.equal(meta.twitter.title.absolute, title);
  assert.equal(meta.twitter.description, ABOUT_DESCRIPTION);
  assert.equal(meta.alternates.canonical, "/about");

  const page = fs.readFileSync(path.join(__dirname, "../src/app/about/page.tsx"), "utf8");
  assert.match(page, /title: ABOUT_TITLE_LEAD/);
  assert.match(page, /description: ABOUT_DESCRIPTION/);
});

test("about JSON-LD reuses the founder Person and describes only on-page people", () => {
  const { renderToStaticMarkup } = require("react-dom/server");
  const { createElement } = require("react");
  const {
    aboutStructuredData,
    aboutTeamPersonStructuredData,
    founderPersonStructuredData,
    organizationStructuredData,
    personSlug,
    FOUNDER_PERSON_ID,
    ORGANIZATION_ID,
  } = loadTs("lib/seo.ts");
  const { team, siteConfig } = loadTs("site.config.ts");
  const { AboutPageJsonLd } = loadTs("components/seo/JsonLd.tsx");

  assert.equal(personSlug("Shane Michelon"), "shane-michelon");
  assert.equal(FOUNDER_PERSON_ID, `https://collegiateagency.com/#${personSlug(siteConfig.articleAuthor.name)}`);

  const poisoned = aboutTeamPersonStructuredData({
    name: "Shane Michelon",
    title: "Partner, ZMM Events · Founder, SOS Consultants",
    photo: "/team/shane-michelon.png",
    linkedin: "https://example.com/not-the-profile",
  });
  assert.deepEqual(poisoned, founderPersonStructuredData());
  const founderJson = JSON.stringify(poisoned);
  assert.equal(founderJson.includes("ZMM"), false);
  assert.equal(founderJson.includes("SOS"), false);
  assert.equal(founderJson.includes("S.O.S"), false);
  assert.equal(founderJson.includes("Night School"), false);
  assert.equal("url" in poisoned, false);
  assert.equal("image" in poisoned, false);
  assert.deepEqual(poisoned.sameAs, [LINKEDIN]);
  assert.equal(poisoned.jobTitle, "Founder");
  assert.deepEqual(poisoned.worksFor, { "@id": ORG_ID });

  const data = aboutStructuredData();
  assert.equal(JSON.parse(JSON.stringify(data))["@context"], "https://schema.org");
  const graph = data["@graph"];
  const page = graph.find((node) => Array.isArray(node["@type"]) && node["@type"].includes("AboutPage"));
  assert.ok(page);
  assert.ok(page["@type"].includes("WebPage"));
  assert.equal(page["@id"], "https://collegiateagency.com/about#webpage");
  assert.equal(page.name, "About the college marketing agency | Collegiate Agency");
  assert.equal(page.about["@id"], ORG_ID);
  assert.equal(page.publisher["@id"], ORG_ID);
  assert.equal(page.isPartOf["@id"], "https://collegiateagency.com/#website");

  const people = graph.filter((node) => node["@type"] === "Person");
  assert.deepEqual(
    people.map((person) => person.name),
    team.map((member) => member.name),
  );
  assert.deepEqual(people[0], founderPersonStructuredData());
  assert.deepEqual(
    page.mainEntity.map((entity) => entity["@id"]),
    [ORG_ID, ...people.map((person) => person["@id"])],
  );
  const ids = people.map((person) => person["@id"]);
  assert.equal(new Set(ids).size, ids.length);

  for (const member of team.slice(1)) {
    const person = people.find((node) => node.name === member.name);
    assert.equal(person.jobTitle, member.title);
    assert.equal(person.image, `https://collegiateagency.com${member.photo}`);
    assert.deepEqual(person.worksFor, { "@id": ORGANIZATION_ID });
    assert.equal("sameAs" in person, false);
    assert.equal("url" in person, false);
    assert.equal("description" in person, false);
    const allowed = new Set(["@type", "@id", "name", "jobTitle", "worksFor", "image"]);
    for (const key of Object.keys(person)) assert.ok(allowed.has(key), `${member.name} has ${key}`);
  }

  const org = organizationStructuredData()[0];
  assert.deepEqual(org.founder, { "@id": PERSON_ID });
  assert.equal(org.founder["@id"], people[0]["@id"]);

  const rendered = jsonLdBlocks(renderToStaticMarkup(createElement(AboutPageJsonLd)));
  assert.equal(rendered.length, 1);
  assert.deepEqual(rendered[0], data);
});

test("the about page links the brand routes and keeps Shane's bio free of other affiliations", () => {
  const page = fs.readFileSync(path.join(__dirname, "../src/app/about/page.tsx"), "utf8");
  for (const href of [
    "/services",
    "/services/brand-ambassadors",
    "/services/events",
    "/services/product-placement",
    "/pricing",
    "/work",
    "/contact",
  ]) {
    assert.match(page, new RegExp(`href="${href}"`));
  }
  assert.match(page, /siteConfig\.articleAuthor\.name/);
  assert.match(page, /siteConfig\.articleAuthor\.jobTitle/);
  assert.match(page, /siteConfig\.articleAuthor\.linkedIn/);
  assert.match(page, /rel="author noopener"/);
  assert.match(page, /siteConfig\.stats\.map/);
  assert.match(page, /<AboutPageJsonLd \/>/);
  assert.match(page, /href: "\/become-an-ambassador"/);
  assert.match(page, /href: "\/contact"/);

  const founder = page.slice(page.indexOf('id="founder"'), page.indexOf('id="team"'));
  assert.ok(founder.length > 0);
  assert.equal(founder.includes("ZMM"), false);
  assert.equal(founder.includes("SOS"), false);
  assert.equal(founder.includes("S.O.S"), false);
  assert.equal(founder.includes("Night School"), false);

  const { team } = loadTs("site.config.ts");
  const shane = team.find((member) => member.name === "Shane Michelon");
  assert.equal(shane.title, "Founder");
  assert.equal(JSON.stringify(shane).includes("ZMM"), false);
  assert.equal(JSON.stringify(shane).includes("SOS"), false);

  const { default: sitemap } = loadTs("app/sitemap.ts");
  const about = sitemap().find((entry) => entry.url === "https://collegiateagency.com/about");
  assert.equal(about.lastModified.toISOString(), "2026-10-27T00:00:00.000Z");
});
