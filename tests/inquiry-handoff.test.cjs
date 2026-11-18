const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
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
  const localRequire = Module.createRequire(file);
  m.require = (id) => {
    if (id.startsWith("@/")) return load(resolveSrc(path.join(__dirname, "../src", id.slice(2))));
    if (id.startsWith(".")) return load(resolveSrc(path.resolve(path.dirname(file), id)));
    return localRequire(id);
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

const handoff = loadTs("lib/inquiry-handoff.ts");
const { siteConfig } = loadTs("site.config.ts");
const labels = siteConfig.services.map((service) => service.label);
const read = (rel) => fs.readFileSync(path.join(__dirname, "..", rel), "utf8");

test("article inquiry links keep the chosen service and add the article", () => {
  const href = handoff.articleInquiryHref(
    handoff.inquiryHref("/build-a-campaign", { service: "ambassadors" }),
    "college-marketing-agency",
  );
  const url = new URL(href, "https://collegiateagency.com");
  assert.equal(url.pathname, "/build-a-campaign");
  assert.equal(url.searchParams.get("service"), "ambassadors");
  assert.equal(url.searchParams.get("article"), "college-marketing-agency");
});

test("a contact link keeps a real service label and the article", () => {
  const label = siteConfig.services.find((service) => service.slug === "events").label;
  const href = handoff.articleInquiryHref(
    handoff.inquiryHref("/contact", { interest: label }),
    "college-event-sponsorship",
  );
  const url = new URL(href, "https://collegiateagency.com");
  assert.equal(url.searchParams.get("interest"), label);
  assert.equal(url.searchParams.get("article"), "college-event-sponsorship");
  assert.deepEqual(handoff.interestsFromQuery(url.search, labels), [label]);
});

test("a missing interest param leaves the form selection empty", () => {
  assert.deepEqual(handoff.interestsFromQuery("", labels), []);
  assert.deepEqual(handoff.interestsFromQuery("?article=college-marketing-agency", labels), []);
  const href = handoff.articleInquiryHref(
    handoff.inquiryHref("/contact", {}),
    "college-marketing-agency",
  );
  const url = new URL(href, "https://collegiateagency.com");
  assert.equal(url.pathname, "/contact");
  assert.equal(url.searchParams.get("interest"), null);
  assert.equal(url.searchParams.get("article"), "college-marketing-agency");
  assert.deepEqual(handoff.interestsFromQuery(url.search, labels), []);
});

test("unknown interest and service values are dropped", () => {
  assert.deepEqual(handoff.interestsFromQuery("?interest=Interns&interest=Events", labels), ["Events"]);
  assert.deepEqual(handoff.servicesFromQuery("?service=ambassadors,nope&service=events"), [
    "ambassadors",
    "events",
  ]);
  assert.deepEqual(handoff.servicesFromQuery("?service="), []);
});

test("service pages and outside links are not rewritten into the inquiry", () => {
  assert.equal(handoff.articleInquiryHref("/services/events", "college-event-sponsorship"), "/services/events");
  assert.equal(
    handoff.articleInquiryHref("https://example.com/contact", "college-event-sponsorship"),
    "https://example.com/contact",
  );
});

test("the first invalid inquiry field is company, then email", () => {
  assert.equal(
    handoff.firstInvalidInquiryField({
      company: "Company is required.",
      email: "Work email is required.",
    }),
    "company",
  );
  assert.equal(handoff.firstInvalidInquiryField({ email: "Enter a valid email." }), "email");
  assert.equal(handoff.firstInvalidInquiryField({}), null);
});

test("the form's reply line is a sentence already published on the contact page", () => {
  const copy = read("src/lib/indexable-pages.ts");
  assert.ok(copy.includes(handoff.INQUIRY_REPLY_LINE));
  assert.ok(copy.includes(handoff.INQUIRY_REQUIRED_LINE));
});

test("the contact form keeps typed values when a check fails", () => {
  const form = read("src/components/forms/ContactForm.tsx");
  assert.equal(form.split("form.reset()").length - 1, 1);
  assert.ok(form.indexOf("form.reset()") > form.indexOf('setStatus("success")'));
  assert.match(form, /firstInvalidInquiryField/);
  assert.match(form, /interestsFromQuery/);
  assert.match(form, /scrollIntoView/);
});

test("service, article, and sponsorship paths pass the choice into the inquiry", () => {
  const service = read("src/components/services/ServicePage.tsx");
  const article = read("src/app/insights/[slug]/page.tsx");
  const sponsorships = read("src/components/EventSponsorships.tsx");
  const builder = read("src/components/campaign/CampaignBuilder.tsx");

  assert.match(service, /inquiryHref\("\/contact", \{ interest \}\)/);
  assert.match(article, /service: "ambassadors"/);
  assert.match(article, /service: "product-placement"/);
  assert.match(article, /inquiryHref\("\/contact", \{ interest: serviceInterest\("events"\) \}\)/);
  assert.match(sponsorships, /p\.set\("interest", interest\)/);
  assert.match(builder, /servicesFromQuery/);
  assert.match(builder, /id="campaign-email"/);
  assert.match(builder, /autoComplete="email"/);
  assert.match(builder, /isValidEmail\(contact\.email\)/);
  assert.match(builder, /h-11 w-11/);
  assert.equal(builder.includes("setContact({ firstName: \"\","), false);
});

test("brand Get Started labels name the next step and keep their destinations", () => {
  const files = [
    "src/app/page.tsx",
    "src/app/services/page.tsx",
    "src/components/services/ServicePage.tsx",
    "src/app/work/page.tsx",
    "src/app/work/[slug]/page.tsx",
    "src/app/insights/page.tsx",
    "src/app/insights/topics/[slug]/page.tsx",
    "src/app/not-found.tsx",
    "src/components/home/StickyMobileCTA.tsx",
    "src/components/insights/ArticleCta.tsx",
    "src/site.config.ts",
    "src/app/about/page.tsx",
    "src/app/pricing/page.tsx",
    "src/components/Navbar.tsx",
  ];
  for (const file of files) {
    assert.equal(/Get [Ss]tarted/.test(read(file)), false, file);
  }

  const home = read("src/app/page.tsx");
  assert.match(home, /label: "Tell us what you're launching", href: "\/contact"/);
  assert.match(home, /label: "Explore services", href: "\/services" \}/);
  assert.equal(home.includes('href: "/services/events"'), false);

  const services = read("src/site.config.ts");
  assert.match(services, /cta: \{ label: "Get a plan and pricing", href: "\/contact" \}/);
  assert.match(services, /label: "Apply now"/);
  assert.match(services, /label: "Become an ambassador"/);

  const servicePage = read("src/components/services/ServicePage.tsx");
  assert.match(servicePage, /events: "Get a plan for your campus event"/);
  assert.match(servicePage, /"brand-ambassadors": "Get a plan for an ambassador program"/);
  assert.match(servicePage, /"product-placement": "Get a plan for product placement"/);
  assert.match(servicePage, /Get a custom quote/);
  assert.match(servicePage, /inquiryHref\("\/contact", \{ interest \}\)/);

  assert.match(read("src/app/work/page.tsx"), /label: "Get a plan and pricing", href: "\/contact"/);
  assert.match(read("src/app/work/[slug]/page.tsx"), /label: "Get a plan and pricing", href: "\/contact"/);
  assert.match(read("src/app/insights/page.tsx"), /label: "Tell us what you're launching", href: "\/contact"/);
  assert.match(
    read("src/app/insights/topics/[slug]/page.tsx"),
    /label: "Tell us what you're launching", href: "\/contact"/,
  );
  assert.match(read("src/components/home/StickyMobileCTA.tsx"), /Tell us what you&apos;re launching/);
  assert.match(read("src/components/home/StickyMobileCTA.tsx"), /href="\/contact"/);
  assert.match(read("src/app/not-found.tsx"), /Tell us what you&apos;re launching/);
  assert.match(read("src/app/pricing/page.tsx"), /label: "Contact Collegiate Agency", href: "\/contact"/);
  assert.match(read("src/components/Navbar.tsx"), /Book a Call/);

  const article = read("src/app/insights/[slug]/page.tsx");
  assert.match(article, /label: "Book a call"/);
  assert.match(article, /inquiryHref\("\/contact", \{ interest: serviceInterest\("events"\) \}\)/);
  assert.match(article, /post\.slug === "college-marketing-agency" \? undefined : cta\.interest/);
  const footer = read("src/components/insights/ArticleCta.tsx");
  assert.match(footer, /label: "Tell us what you're launching"/);
  assert.match(footer, /articleCtaHref\(inquiryHref\("\/contact", \{ interest \}\), slug\)/);
});

test("the hero and about closer repeat the published one-business-day reply", () => {
  assert.equal(
    handoff.INQUIRY_BRIEF_LINE,
    "Send a short brief. Collegiate Agency replies within one business day with a tailored plan and firm pricing.",
  );
  assert.match(read("src/components/home/Hero.tsx"), /INQUIRY_BRIEF_LINE/);
  assert.match(read("src/app/about/page.tsx"), /note=\{INQUIRY_BRIEF_LINE\}/);
  assert.match(read("src/components/CTASection.tsx"), /\{note \?/);
});
