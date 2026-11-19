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

function listItems(html) {
  return [...html.matchAll(/<li>([\s\S]*?)<\/li>/g)].map((match) => match[1]);
}

function schoolName(item) {
  const match = item.match(/font-bold text-ink">([^<]+)</);
  assert.ok(match, item);
  return match[1];
}

function anchor(item) {
  const match = item.match(/<a\b([^>]*)>/);
  if (!match) return null;
  const tag = match[1];
  const href = tag.match(/href="([^"]+)"/);
  const label = tag.match(/aria-label="([^"]+)"/);
  assert.ok(href, tag);
  assert.ok(label, tag);
  return { href: href[1], label: label[1] };
}

const LINKED = [
  { slug: "new-orleans", school: "Tulane", city: "New Orleans, LA" },
  { slug: "syracuse", school: "Syracuse", city: "Syracuse, NY" },
  { slug: "oxford-ole-miss", school: "Ole Miss", city: "Oxford, MS" },
  { slug: "austin", school: "UT Austin", city: "Austin, TX" },
  { slug: "dallas", school: "SMU", city: "Dallas, TX" },
];

test("published city markets lead the campus grid and are the only links", () => {
  const React = require("react");
  const { renderToStaticMarkup } = require("react-dom/server");
  const { siteConfig } = loadTs("site.config.ts");
  const markets = loadTs("lib/campus-markets.ts");
  const network = loadTs("lib/campus-network.ts");
  const { CampusGrid } = loadTs("components/CampusGrid.tsx");

  const published = markets.publishedMarkets();
  assert.deepEqual(
    published.map((market) => market.slug),
    LINKED.map((item) => item.slug),
  );

  const cards = network.campusNetworkCards();
  const linkedSchools = LINKED.map((item) => item.school);
  const rest = siteConfig.campuses
    .filter((campus) => !linkedSchools.includes(campus.school))
    .map((campus) => campus.school);

  assert.deepEqual(
    cards.map((card) => card.school),
    [...linkedSchools, ...rest],
  );
  assert.deepEqual(
    cards.slice(0, LINKED.length).map((card) => [card.school, card.city, card.href, card.color]),
    LINKED.map((item) => {
      const campus = siteConfig.campuses.find((entry) => entry.school === item.school);
      return [item.school, item.city, markets.cityPath(item.slug), campus.color];
    }),
  );
  for (const card of cards.slice(LINKED.length)) {
    assert.equal(card.href, undefined, card.school);
  }
  assert.equal(new Set(cards.map((card) => card.school)).size, cards.length);

  const html = renderToStaticMarkup(React.createElement(CampusGrid));
  const items = listItems(html);
  assert.equal(items.length, cards.length);
  assert.deepEqual(items.map(schoolName), cards.map((card) => card.school));

  items.forEach((item, index) => {
    const link = anchor(item);
    const card = cards[index];
    if (index < LINKED.length) {
      assert.ok(link, card.school);
      assert.equal(link.href, card.href);
      assert.equal(link.label, `${card.school} campus marketing activations`);
      assert.equal((item.match(/<a\b/g) || []).length, 1);
      assert.match(item, /See activations →/);
      assert.equal(item.includes(card.city), true);
    } else {
      assert.equal(link, null, card.school);
      assert.equal(item.includes("<a"), false, card.school);
      assert.equal(item.includes("See activations"), false, card.school);
      assert.equal(item.includes(card.school), true);
      assert.equal(item.includes(card.city), true);
    }
  });

  assert.equal((html.match(/See activations →/g) || []).length, LINKED.length);
  assert.equal(/\$|return on ad spend|\bROAS\b|\bviews\b|\bimpressions\b/i.test(html), false);
});

test("a market that fails the activation gate is not linked and stays in place", () => {
  const { siteConfig } = loadTs("site.config.ts");
  const { campusMarkets } = loadTs("lib/campus-markets.ts");
  const { campusNetworkCards } = loadTs("lib/campus-network.ts");

  const markets = campusMarkets.map((market) =>
    market.slug === "dallas" ? { ...market, activations: [] } : market,
  );
  const cards = campusNetworkCards(siteConfig.campuses, markets);
  const schools = cards.map((card) => card.school);

  assert.equal(
    cards.some((card) => card.href === "/campus-marketing/dallas"),
    false,
  );
  assert.deepEqual(schools.slice(0, 4), ["Tulane", "Syracuse", "Ole Miss", "UT Austin"]);
  const smu = cards.find((card) => card.school === "SMU");
  assert.ok(smu);
  assert.equal(smu.href, undefined);
  assert.equal(smu.city, "Dallas, TX");
  assert.ok(schools.indexOf("Maryland") < schools.indexOf("SMU"));
  assert.ok(schools.indexOf("SMU") < schools.indexOf("Arizona State"));
  assert.equal(
    schools.filter((school) => school === "SMU").length,
    1,
  );
});

test("a published market with no school card is added once and linked", () => {
  const { siteConfig } = loadTs("site.config.ts");
  const { campusMarkets } = loadTs("lib/campus-markets.ts");
  const { campusNetworkCards } = loadTs("lib/campus-network.ts");

  const boulder = {
    slug: "boulder",
    city: "Boulder",
    region: "CO",
    activations: [
      {
        brand: "BeatBox",
        whatRan: "BeatBox activated with Collegiate Agency in Boulder.",
        source: "https://example.com/boulder",
      },
    ],
  };
  const cards = campusNetworkCards(siteConfig.campuses, [...campusMarkets, boulder]);
  const added = cards.filter((card) => card.school === "Boulder");
  assert.equal(added.length, 1);
  assert.equal(added[0].city, "Boulder, CO");
  assert.equal(added[0].href, "/campus-marketing/boulder");
  assert.equal(cards[5], added[0]);
  assert.equal(
    cards.filter((card) => card.href === "/campus-marketing/boulder").length,
    1,
  );
  assert.equal(cards.length, siteConfig.campuses.length + 1);
});

test("two campuses in one published city do not both become that city link", () => {
  const { campusMarkets } = loadTs("lib/campus-markets.ts");
  const { campusNetworkCards } = loadTs("lib/campus-network.ts");
  const newOrleans = campusMarkets.find((market) => market.slug === "new-orleans");
  const campuses = [
    { school: "Loyola", city: "New Orleans, LA", color: "#00573d" },
    { school: "Tulane", city: "New Orleans, LA", color: "#418FDE" },
    { school: "Ohio State", city: "Columbus, OH", color: "#BB0000" },
  ];
  const cards = campusNetworkCards(campuses, [newOrleans]);
  assert.deepEqual(
    cards.map((card) => [card.school, card.href ?? ""]),
    [
      ["Loyola", "/campus-marketing/new-orleans"],
      ["Tulane", ""],
      ["Ohio State", ""],
    ],
  );
  assert.equal(cards[0].color, "#00573d");
  assert.equal(cards[1].city, "New Orleans, LA");
});
