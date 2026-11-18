const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

const root = path.join(__dirname, "..");
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");

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

const TROY_QUOTE =
  "Shane runs a tight ship when it comes to in-person campaigns for brands. I always offer his services to my clients since I know I can trust him to deliver.";

test("the inquiry quote is Troy's published homepage line, with no rating", () => {
  const { testimonials } = loadTs("site.config.ts");
  const { inquiryTestimonial, InquiryTestimonial } = loadTs("components/InquiryTestimonial.tsx");
  const troy = testimonials.find((item) => item.name === "Troy Osinoff");
  assert.ok(troy);
  assert.equal(troy.title, "Founder, Zagged");
  assert.equal(troy.quote, TROY_QUOTE);
  const picked = inquiryTestimonial();
  assert.ok(picked);
  assert.equal(picked.name, troy.name);
  assert.equal(picked.title, troy.title);
  assert.equal(picked.quote, troy.quote);

  const { renderToStaticMarkup } = require("react-dom/server");
  const { createElement } = require("react");
  const html = renderToStaticMarkup(createElement(InquiryTestimonial));
  assert.equal((html.match(/<blockquote/g) || []).length, 1);
  assert.match(html, new RegExp(TROY_QUOTE.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(html, /Troy Osinoff/);
  assert.match(html, /Founder, Zagged/);
  assert.equal(html.includes("<svg"), false);
  assert.equal(/AggregateRating|Review|itemProp|itemtype|5 out of 5|application\/ld\+json/i.test(html), false);
  for (const other of testimonials.filter((item) => item.name !== "Troy Osinoff")) {
    assert.equal(html.includes(other.quote), false);
    assert.equal(html.includes(other.name), false);
  }

  const source = read("src/components/InquiryTestimonial.tsx");
  assert.match(source, /from "@\/site\.config"/);
  assert.equal(source.includes(TROY_QUOTE), false);
  assert.equal(source.includes("AggregateRating"), false);
});

test("contact shows that quote directly under the form, before the photo", () => {
  const src = read("src/app/contact/page.tsx");
  const form = src.indexOf("<ContactForm");
  const quote = src.indexOf("<InquiryTestimonial");
  const photo = src.indexOf("<figure");
  const offices = src.indexOf("Offices");
  assert.ok(form > 0 && quote > form && photo > quote && offices > form);
  assert.match(src, /<ContactForm \/>\s*<InquiryTestimonial/);
  assert.match(src, /lg:col-start-2/);
  assert.equal(src.includes("order-first"), false);
  assert.equal((src.match(/<InquiryTestimonial/g) || []).length, 1);
  assert.equal(src.includes("AggregateRating"), false);
  assert.equal(src.includes("RotatingReview"), false);
  assert.match(src, /<ContactForm \/>/);
});

test("the campaign review step shows the same quote under Send my campaign", () => {
  const src = read("src/components/campaign/CampaignBuilder.tsx");
  const review = src.indexOf('step === "review"');
  const send = src.indexOf("Send my campaign");
  const quote = src.indexOf("<InquiryTestimonial");
  assert.ok(review > 0 && send > review && quote > send);
  assert.equal((src.match(/<InquiryTestimonial/g) || []).length, 1);
  assert.equal(src.includes("AggregateRating"), false);
  const quoteBlock = src.slice(review, quote);
  assert.match(quoteBlock, /Send my campaign/);
});
