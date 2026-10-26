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

test("logo png is at least 112px and schema points at it", () => {
  const png = fs.readFileSync(path.join(__dirname, "../public/logo.png"));
  assert.equal(png.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
  assert.equal(png.readUInt32BE(16), 512);
  assert.equal(png.readUInt32BE(20), 512);
  const { LOGO_PATH, organizationStructuredData } = loadTs("lib/seo.ts");
  assert.equal(LOGO_PATH, "/logo.png");
  const org = organizationStructuredData()[0];
  assert.equal(org.logo.url, "https://collegiateagency.com/logo.png");
  assert.equal(org.logo.contentUrl, "https://collegiateagency.com/logo.png");
  assert.equal(org.email, "shane@zmmevents.com");
  const publisher = fs.readFileSync(path.join(__dirname, "../src/components/seo/JsonLd.tsx"), "utf8");
  assert.match(publisher, /LOGO_PATH/);
  assert.equal(publisher.includes("/logo.svg"), false);
});

test("/rss.xml permanently redirects to /feed.xml and the homepage lastmod is this pass", () => {
  const config = fs.readFileSync(path.join(__dirname, "../next.config.mjs"), "utf8");
  assert.match(config, /source:\s*"\/rss\.xml",\s*destination:\s*"\/feed\.xml",\s*permanent:\s*true/);
  const { default: sitemap } = loadTs("app/sitemap.ts");
  const home = sitemap().find((entry) => entry.url === "https://collegiateagency.com");
  assert.equal(home.lastModified.toISOString(), "2026-10-26T00:00:00.000Z");
});

test("homepage contrast and name fixes are in the components Lighthouse flagged", () => {
  const button = fs.readFileSync(path.join(__dirname, "../src/components/ui/Button.tsx"), "utf8");
  assert.match(button, /magenta:[\s\S]*text-ink/);
  assert.equal(/magenta:[\s\S]*text-white/.test(button), false);
  const hero = fs.readFileSync(path.join(__dirname, "../src/components/home/Hero.tsx"), "utf8");
  assert.match(hero, /aria-label="CA, spin the campus coin"/);
  const stars = fs.readFileSync(path.join(__dirname, "../src/components/TestimonialMarquee.tsx"), "utf8");
  assert.match(stars, /role="img" aria-label="5 out of 5 stars"/);
  const service = fs.readFileSync(path.join(__dirname, "../src/components/ServiceCard.tsx"), "utf8");
  assert.equal(service.includes("opacity-90"), false);
  assert.equal(service.includes("text-white/15"), false);
});
