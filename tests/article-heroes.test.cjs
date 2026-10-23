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
    id.startsWith("@/") ? load(resolveSrc(path.join(__dirname, "../src", id.slice(2)))) : require(id);
  const compiled = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
  }).outputText;
  m._compile(compiled, file);
  return m.exports;
}

const STOCK = "/images/blog/campus-library-michael-marsh.jpg";
/** Hardcoded case-study copy, not one of the MDX insight articles. */
const LEGACY_WITHOUT_HERO = "why-welcome-week-is-the-highest-leverage-moment-on-campus";
const FORMERLY_MISSING = [
  "student-ambassador-marketing",
  "student-influencer-marketing",
  "college-brand-ambassador-program",
  "college-brand-ambassadors",
  "student-brand-reps",
];

test("every insight has an owned hero with the file's real dimensions", () => {
  const { posts } = load(path.join(__dirname, "../src/lib/content.ts"));
  const { readIntrinsicSize } = load(path.join(__dirname, "../src/lib/image-intrinsic.ts"));
  const { articleSocialImage, DEFAULT_SOCIAL_IMAGE } = load(path.join(__dirname, "../src/lib/seo.ts"));
  const library = fs.readFileSync(path.join(__dirname, "../content/seo/public-photo-library.md"), "utf8");
  assert.match(library, /campus-library-michael-marsh\.jpg[\s\S]*?- Status: disallowed/);
  const articles = posts.filter((post) => post.slug !== LEGACY_WITHOUT_HERO);
  assert.ok(articles.length >= 32);
  for (const post of articles) {
    assert.ok(post.image, `${post.slug} is missing a hero`);
    assert.notEqual(post.image, STOCK, `${post.slug} still uses the Unsplash photo`);
    assert.equal(post.imageRights, "owned", `${post.slug} hero is not owned`);
    const size = readIntrinsicSize(path.join(__dirname, "../public", post.image));
    assert.equal(post.imageWidth, size.width, post.slug);
    assert.equal(post.imageHeight, size.height, post.slug);
    const social = articleSocialImage(post);
    assert.equal(social.url, post.image);
    assert.equal(social.width, size.width);
    assert.equal(social.height, size.height);
    assert.notEqual(social.width, 1200);
    assert.ok(social.alt);
  }
  for (const slug of FORMERLY_MISSING) {
    assert.ok(posts.some((post) => post.slug === slug && post.image), slug);
  }
  const legacy = posts.find((post) => post.slug === LEGACY_WITHOUT_HERO);
  assert.equal(legacy.image, undefined);
  const fallback = articleSocialImage(legacy);
  assert.equal(fallback.url, DEFAULT_SOCIAL_IMAGE.url);
  assert.equal(fallback.width, 1200);
  assert.equal(fallback.height, 630);
});

test("the hero image uses intrinsic dimensions and the sitemap lists it", () => {
  const { renderToStaticMarkup } = require("react-dom/server");
  const { createElement } = require("react");
  const { ArticleArt } = load(path.join(__dirname, "../src/components/insights/ArticleArt.tsx"));
  const html = renderToStaticMarkup(
    createElement(ArticleArt, {
      slug: "test",
      category: "Events",
      image: "/images/blog/beatbox-attendees-venue-pair.jpg",
      imageAlt: "Two attendees holding BEATBOX cartons at a sponsored venue event",
      imageWidth: 1333,
      imageHeight: 750,
    }),
  );
  assert.match(html, /width="1333"/);
  assert.match(html, /height="750"/);
  assert.doesNotMatch(html, /width="1600"/);

  const { default: sitemap } = load(path.join(__dirname, "../src/app/sitemap.ts"));
  const articles = sitemap().filter(
    (entry) =>
      entry.url.includes("/insights/") &&
      entry.url.split("/").length > 4 &&
      !entry.url.endsWith(`/${LEGACY_WITHOUT_HERO}`),
  );
  assert.ok(articles.length >= 32);
  for (const entry of articles) {
    assert.ok(entry.images && entry.images.length >= 1, entry.url);
    assert.ok(entry.images.every((url) => url.startsWith("https://collegiateagency.com/images/")));
    assert.equal(entry.images.some((url) => url.endsWith("campus-library-michael-marsh.jpg")), false);
  }
});
