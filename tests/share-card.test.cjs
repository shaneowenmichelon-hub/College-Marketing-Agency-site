const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");

/**
 * The share card is what a link to this site looks like in iMessage, WhatsApp,
 * Slack and LinkedIn. It is the most-seen image the site has and the easiest
 * to break silently: nothing on the site renders it, so a bad path or a
 * missing file shows up only when someone sends the link.
 */

test("the committed share card exists and is a 1200x630 PNG", () => {
  const file = path.join(root, "public/share-card.png");
  assert.ok(fs.existsSync(file), "public/share-card.png is missing");

  const buf = fs.readFileSync(file);
  assert.ok(buf.length > 20000, `share card is only ${buf.length} bytes`);
  // PNG signature, then IHDR carries width/height as big-endian uint32s.
  assert.equal(buf.subarray(0, 8).toString("hex"), "89504e470d0a1a0a", "not a PNG");
  assert.equal(buf.readUInt32BE(16), 1200, "width must be 1200");
  assert.equal(buf.readUInt32BE(20), 630, "height must be 630");
});

test("the homepage points at the static card, not the generated route", () => {
  const page = read("src/app/page.tsx");
  assert.match(page, /images:\s*\[SHARE_CARD_IMAGE\]/);

  const seo = read("src/lib/seo.ts");
  assert.match(seo, /SHARE_CARD_URL\s*=\s*`\/share-card\.png\?v=\$\{SHARE_CARD_VERSION\}`/);
  assert.match(seo, /SHARE_CARD_VERSION\s*=\s*\d+/);
});

test("pageMetadata does not force the card onto pages with their own", () => {
  // metadata.openGraph.images beats a segment's opengraph-image file, so a
  // blanket default here silently replaces every bespoke card on the site.
  const seo = read("src/lib/seo.ts");
  assert.ok(
    !/images:\s*opts\.images\?\.length\s*\?\s*opts\.images\s*:/.test(seo),
    "pageMetadata is defaulting openGraph.images, which overrides per-page cards",
  );
});

test("every page that ships a bespoke card still has one", () => {
  for (const seg of ["work", "pricing", "about", "contact", "insights", "services", "build-a-campaign"]) {
    assert.ok(
      fs.existsSync(path.join(root, "src/app", seg, "opengraph-image.tsx")),
      `${seg} lost its opengraph-image.tsx`,
    );
  }
  // Root fallback, for segments with none of their own.
  assert.ok(fs.existsSync(path.join(root, "src/app/opengraph-image.tsx")));
  assert.ok(fs.existsSync(path.join(root, "src/app/twitter-image.tsx")));
});

test("the card renderer draws its marks instead of typing them", () => {
  // Satori's default font has no U+2605; a typed star renders as tofu. Same
  // trap for any other decorative glyph.
  const card = read("src/lib/og-share-card.tsx");
  assert.ok(!/[☀-➿←-⇿️]/.test(card), "card uses a glyph Satori may not have");
});
