const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

const SAFE_HREF = /^(?:\/|#|https?:|mailto:|tel:)/i;

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

function hrefsIn(html) {
  return [...html.matchAll(/\shref="([^"]*)"/g)].map((match) => match[1]);
}

function blockHtml(block) {
  if (!block || typeof block !== "object") return "";
  if (typeof block.html === "string") return block.html;
  if (Array.isArray(block.items)) return block.items.join("\n");
  if (block.type === "table") return [...(block.columns || []), ...(block.rows || []).flat()].join(" ");
  return "";
}

test("rendered articles only link to site paths, hashes, http, mailto, or tel", () => {
  const { renderToStaticMarkup } = require("react-dom/server");
  const { createElement } = require("react");
  const { posts, caseStudies } = loadTs("lib/content.ts");
  const { ArticlePhotoCredit } = loadTs("components/insights/ArticlePhotoCredit.tsx");

  const activation = posts.find((post) => post.slug === "campus-brand-activation-agency");
  assert.equal(activation.imageSource, "Owned Collegiate Agency activation photography");
  const credit = renderToStaticMarkup(
    createElement(ArticlePhotoCredit, {
      credit: activation.imageCredit,
      source: activation.imageSource,
      license: activation.imageLicense,
      owned: activation.imageRights === "owned",
    }),
  );
  assert.equal(credit.includes('href="Owned'), false);
  assert.equal(hrefsIn(credit).length, 0);

  for (const post of posts) {
    const html = [
      post.body.map(blockHtml).join("\n"),
      renderToStaticMarkup(
        createElement(ArticlePhotoCredit, {
          credit: post.imageCredit || "Collegiate Agency",
          source: post.imageSource,
          license: post.imageLicense,
          owned: post.imageRights === "owned",
        }),
      ),
    ].join("\n");
    for (const href of hrefsIn(html)) {
      assert.match(href, SAFE_HREF, `${post.slug} href ${href}`);
    }
  }

  for (const study of caseStudies) {
    const html = (study.article || []).map(blockHtml).join("\n");
    for (const href of hrefsIn(html)) {
      assert.match(href, SAFE_HREF, `${study.slug} href ${href}`);
    }
  }
});

test("service cards name the service, and the money page links the two real case studies", () => {
  const { renderToStaticMarkup } = require("react-dom/server");
  const { createElement } = require("react");
  const { exploreServiceLink } = loadTs("lib/explore-service-link.ts");
  const { ServiceCard } = loadTs("components/ServiceCard.tsx");
  const { servicesHub } = loadTs("site.config.ts");
  const { CapabilityBlock } = loadTs("components/services/CapabilityBlock.tsx");
  const { posts } = loadTs("lib/content.ts");

  assert.deepEqual(exploreServiceLink("Events"), { visible: "Explore Events" });
  assert.deepEqual(exploreServiceLink("Brand Ambassadors"), {
    visible: "Learn more",
    srOnly: "about campus Brand Ambassadors",
  });
  assert.equal(exploreServiceLink("Product Placement", 40).visible, "Explore Product Placement");

  function Icon() {
    return null;
  }
  const card = renderToStaticMarkup(
    createElement(ServiceCard, {
      icon: Icon,
      title: "Events",
      blurb: "Campus activations.",
      href: "/services/events",
      index: 0,
    }),
  );
  assert.match(card, /Explore Events/);
  assert.equal(card.includes(">Learn more<"), false);

  const longCard = renderToStaticMarkup(
    createElement(ServiceCard, {
      icon: Icon,
      title: "Brand Ambassadors",
      blurb: "A vetted network.",
      href: "/services/brand-ambassadors",
      index: 1,
    }),
  );
  assert.match(longCard, /Learn more/);
  assert.match(longCard, /about campus Brand Ambassadors/);

  for (const block of servicesHub.brands.blocks) {
    const html = renderToStaticMarkup(createElement(CapabilityBlock, { block, imageSide: "left" }));
    assert.match(html, new RegExp(`Explore ${block.heading}`));
    assert.equal(html.includes(">Learn more<"), false, block.heading);
  }

  const money = posts.find((post) => post.slug === "college-marketing-agency");
  const html = money.body.map(blockHtml).join("\n");
  assert.match(html, /SOS Consultants Nola case study/);
  assert.match(html, /href="\/work\/sos-consultants-nola-campus-leasing-ambassadors"/);
  assert.match(html, /NÜTRL Night School tour case study/);
  assert.match(html, /href="\/work\/nutrl-night-school-tour-product-placement"/);
  assert.equal(html.includes("celsius-campus-sampling"), false);
  assert.equal(money.title, "College Marketing Agency: How to Choose One");
  assert.equal(money.dateModified, "2026-11-18");

  const beauty = posts.find((post) => post.slug === "college-marketing-for-beauty-brands");
  assert.ok(beauty.metaDescription.length >= 140 && beauty.metaDescription.length <= 155, beauty.metaDescription.length);
  assert.match(beauty.metaDescription, /college marketing for beauty brands/i);
  assert.equal(beauty.date, "2026-11-16");

  const ambassadors = fs.readFileSync(path.join(__dirname, "../src/app/services/brand-ambassadors/page.tsx"), "utf8");
  const description = ambassadors.match(/description:\s*\n\s*"([^"]+)"/);
  assert.ok(description, "brand ambassador meta description");
  assert.ok(description[1].length <= 158, description[1].length);
  assert.match(description[1], /^A vetted student rep network/);

  const cta = fs.readFileSync(path.join(__dirname, "../src/components/insights/ArticleCta.tsx"), "utf8");
  assert.match(cta, /text-white\/95/);
  assert.equal(cta.includes("text-white/70"), false);
});
