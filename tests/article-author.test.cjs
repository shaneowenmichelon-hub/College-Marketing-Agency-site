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

function jsonLd(html) {
  const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert.ok(match, "expected a JSON-LD script");
  return JSON.parse(match[1]);
}

function assertFounderPerson(author) {
  assert.equal(author["@type"], "Person");
  assert.equal(author["@id"], PERSON_ID);
  assert.equal(author.name, "Shane Michelon");
  assert.equal(author.jobTitle, "Founder");
  assert.deepEqual(author.worksFor, { "@id": ORG_ID });
  assert.deepEqual(author.sameAs, [LINKEDIN]);
  assert.equal("url" in author, false);
  const encoded = JSON.stringify(author);
  assert.equal(encoded.includes("ZMM"), false);
  assert.equal(encoded.includes("Night School"), false);
  assert.equal(encoded.includes("S.O.S"), false);
  assert.equal(encoded.includes("zmmevents"), false);
}

test("the default article author is Shane Michelon, and a frontmatter name can override it", () => {
  const { resolveArticleAuthor, founderPersonStructuredData, articleAuthorStructuredData } = loadTs("lib/seo.ts");
  for (const raw of [undefined, "", "   ", "Collegiate Agency", "Shane Michelon"]) {
    const resolved = resolveArticleAuthor(raw);
    assert.equal(resolved.name, "Shane Michelon");
    assert.equal(resolved.jobTitle, "Founder");
    assert.equal(resolved.linkedIn, LINKEDIN);
    assert.equal(resolved.isDefault, true);
    assert.deepEqual(articleAuthorStructuredData(raw), founderPersonStructuredData());
  }

  const guest = resolveArticleAuthor("Guest Writer");
  assert.equal(guest.name, "Guest Writer");
  assert.equal(guest.isDefault, false);
  assert.equal(guest.jobTitle, undefined);
  assert.equal(guest.linkedIn, undefined);
  assert.deepEqual(articleAuthorStructuredData("Guest Writer"), { "@type": "Person", name: "Guest Writer" });
});

test("every published insight byline links to Shane and the Article JSON-LD author is that Person", () => {
  const { renderToStaticMarkup } = require("react-dom/server");
  const { createElement } = require("react");
  const { posts } = loadTs("lib/content.ts");
  const { ArticleByline } = loadTs("components/insights/ArticleByline.tsx");
  const { ArticleJsonLd } = loadTs("components/seo/JsonLd.tsx");
  const { founderPersonStructuredData } = loadTs("lib/seo.ts");

  assert.ok(posts.length >= 32, `expected the live article set, got ${posts.length}`);
  const founder = founderPersonStructuredData();

  for (const post of posts) {
    assert.equal(post.author, "Shane Michelon", post.slug);
    const byline = renderToStaticMarkup(createElement(ArticleByline, { author: post.author }));
    assert.match(byline, /By <a\b[^>]*>Shane Michelon<\/a>/);
    assert.match(byline, new RegExp(`href="${LINKEDIN.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`));
    assert.match(byline, /rel="author noopener"/);
    assert.match(byline, /target="_blank"/);
    assert.match(byline, /Founder, Collegiate Agency/);
    assert.equal(byline.includes("By Collegiate Agency"), false);
    assert.equal(byline.includes("ZMM"), false);
    assert.equal(byline.includes("Night School"), false);

    const data = jsonLd(
      renderToStaticMarkup(
        createElement(ArticleJsonLd, {
          title: post.title,
          description: post.excerpt,
          slug: post.slug,
          date: post.date,
          author: post.author,
        }),
      ),
    );
    assert.deepEqual(data["@type"], ["Article", "BlogPosting"]);
    assert.deepEqual(data.author, founder);
    assertFounderPerson(data.author);
    assert.equal(data.publisher["@type"], "Organization");
    assert.equal(data.publisher["@id"], ORG_ID);
    assert.equal(data.publisher.name, "Collegiate Agency");
    assert.notEqual(data.author["@id"], ORG_ID);
  }

  const legacy = renderToStaticMarkup(createElement(ArticleByline, { author: "Collegiate Agency" }));
  assert.match(legacy, /By <a\b[^>]*>Shane Michelon<\/a>/);
  const omitted = renderToStaticMarkup(createElement(ArticleByline, {}));
  assert.match(omitted, /By <a\b[^>]*>Shane Michelon<\/a>/);

  const guestHtml = renderToStaticMarkup(createElement(ArticleByline, { author: "Guest Writer" }));
  assert.match(guestHtml, /By Guest Writer/);
  assert.equal(guestHtml.includes("href="), false);
  assert.equal(guestHtml.includes("Founder"), false);
  const guestLd = jsonLd(
    renderToStaticMarkup(
      createElement(ArticleJsonLd, {
        title: "Guest piece",
        description: "A named override.",
        slug: "guest-piece",
        date: "2026-10-26",
        author: "Guest Writer",
      }),
    ),
  );
  assert.deepEqual(guestLd.author, { "@type": "Person", name: "Guest Writer" });
  assert.equal(guestLd.publisher["@id"], ORG_ID);
});

test("the insight template, feed, and llms files use the shared author", async () => {
  const page = fs.readFileSync(path.join(__dirname, "../src/app/insights/[slug]/page.tsx"), "utf8");
  assert.match(page, /<ArticleByline author=\{post\.author\}/);
  assert.match(page, /resolveArticleAuthor\(post\.author\)\.name/);
  assert.equal(page.includes("By {author}"), false);
  assert.equal(page.includes("siteConfig.companyName"), false);

  const { GET: feedGet } = loadTs("app/feed.xml/route.ts");
  const xml = await (await feedGet()).text();
  const creators = xml.match(/<dc:creator>[^<]*<\/dc:creator>/g) || [];
  assert.ok(creators.length >= 32);
  assert.ok(creators.every((item) => item === "<dc:creator>Shane Michelon</dc:creator>"));
  assert.equal(xml.includes("<dc:creator>Collegiate Agency</dc:creator>"), false);
  assert.match(xml, new RegExp(`<atom:uri>${LINKEDIN.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}</atom:uri>`));
  assert.equal(xml.includes("zmmevents"), false);

  const { GET: llmsGet } = loadTs("app/llms.txt/route.ts");
  const llms = await (await llmsGet()).text();
  assert.match(llms, new RegExp(`Author of these articles: Shane Michelon, Founder, Collegiate Agency\\. Profile: ${LINKEDIN.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`));
  assert.match(llms, /Author: Shane Michelon, Founder, Collegiate Agency\./);
  assert.equal(llms.includes("Author: Collegiate Agency"), false);

  const { GET: fullGet } = loadTs("app/llms-full.txt/route.ts");
  const full = await (await fullGet()).text();
  const authorLines = full.match(/Author: Shane Michelon, Founder, Collegiate Agency\. Profile: https:\/\/www\.linkedin\.com\/in\/shane-michelon-189549227/g) || [];
  assert.equal(authorLines.length, creators.length);
  assert.equal(full.includes("Author: Collegiate Agency"), false);
});

test("publisher-facing docs name Shane Michelon as the byline and article files were not rewritten", () => {
  const rules = fs.readFileSync(path.join(__dirname, "../content/seo/writing-rules.md"), "utf8");
  const brief = fs.readFileSync(path.join(__dirname, "../content/seo/briefs/_template.md"), "utf8");
  const ops = fs.readFileSync(path.join(__dirname, "../content/seo/publisher-operations.md"), "utf8");
  for (const doc of [rules, brief, ops]) {
    assert.match(doc, /Shane Michelon/);
    assert.match(doc, /Founder/);
  }

  const { loadMdxPosts } = loadTs("lib/blog-files.ts");
  const raw = loadMdxPosts();
  assert.ok(raw.length >= 32);
  assert.ok(raw.every((post) => post.author === "Collegiate Agency"));
});
