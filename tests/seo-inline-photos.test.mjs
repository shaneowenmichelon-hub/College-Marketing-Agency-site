import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { assertOwnedInlinePhotos, verify } from "../scripts/verify-seo-live.mjs";

const library = fs.readFileSync(new URL("../content/seo/public-photo-library.md", import.meta.url), "utf8");

test("inline photos must be owned, captioned with alt text, and unique", () => {
  const owned = "/images/blog/bloom-sampling-campus-nightlife.jpg";
  assert.doesNotThrow(() =>
    assertOwnedInlinePhotos([{ src: owned, alt: "Attendee holding a can" }], library, "/images/blog/nutrl-bar-takeover.jpg"),
  );
  assert.throws(
    () => assertOwnedInlinePhotos([{ src: owned, alt: "   " }], library),
    /alt/,
  );
  assert.throws(
    () => assertOwnedInlinePhotos([{ src: owned, alt: "Attendee holding a can" }], library, owned),
    /repeat/,
  );
  assert.throws(
    () =>
      assertOwnedInlinePhotos(
        [{ src: "/images/blog/campus-library-michael-marsh.jpg", alt: "A campus lawn" }],
        library,
      ),
    /owned/,
  );
});

test("live verification requires inline photo files to return 200", async () => {
  const photo = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a9XkAAAAASUVORK5CYII=",
    "base64",
  );
  const src = "/images/blog/bloom-sampling-campus-nightlife.jpg";
  let mode = "ok";
  const server = http.createServer((req, res) => {
    if (req.url === src || req.url === "/images/blog/test.png") {
      if (mode === "inline-missing") {
        res.statusCode = 404;
        res.end("missing");
        return;
      }
      res.setHeader("content-type", "image/png");
      res.end(photo);
      return;
    }
    if (req.url === "/sitemap.xml") {
      res.end(`<urlset><url><loc>${base}/insights/test</loc></url></urlset>`);
      return;
    }
    res.setHeader("content-type", "text/html");
    res.end(
      `<html><head><link rel="canonical" href="${base}/insights/test"><meta name="description" content="Exact description"></head><body><article><h1>Exact title</h1><img src="/images/blog/test.png" alt="Test photo"><figure><img src="${src}" alt="Attendee holding a Bloom can" width="1333" height="750"></figure><p>Exact body sentinel</p></article></body></html>`,
    );
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const artifact = {
    slug: "test",
    title: "Exact title",
    metaDescription: "Exact description",
    image: "/images/blog/test.png",
    imageAlt: "Test photo",
    image_sha256: createHash("sha256").update(photo).digest("hex"),
    body_sentinel: "Exact body sentinel",
    inline_photos: [{ src, alt: "Attendee holding a Bloom can" }],
  };
  try {
    const ok = await verify(artifact, base);
    assert.equal(ok.inline_photos[0].status, 200);
    assert.equal(ok.inline_photos[0].width, 1333);
    mode = "inline-missing";
    await assert.rejects(() => verify(artifact, base));
  } finally {
    server.close();
  }
});
