import { chromium } from 'playwright';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
import assert from 'node:assert/strict';

/** Independent verification: never parse the publishing agent's claims. */
export async function verify(artifact, base = 'https://collegiateagency.com') {
  assert.match(artifact.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  assert.match(artifact.image, /^\/images\/blog\/[a-zA-Z0-9/_-]+\.(?:jpg|jpeg|png|webp)$/);
  const url = `${base}/insights/${artifact.slug}`;
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    page.setDefaultTimeout(5000);
    const response = await page.goto(url, { waitUntil: 'load', timeout: 30000 });
    assert.equal(response?.status(), 200, 'article status');
    assert.equal(page.url(), url, 'article redirected');
    assert.equal((await page.locator('article h1').innerText()).trim(), artifact.title, 'exact title');
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), artifact.canonical ?? url, 'canonical');
    assert.equal(await page.locator('meta[name="description"]').getAttribute('content'), artifact.metaDescription, 'description');
    assert.ok((await page.locator('article').innerText()).includes(artifact.body_sentinel), 'body content');
    assert.ok(!/noindex/i.test(await page.locator('meta[name="robots"]').getAttribute('content').catch(() => '') ?? ''), 'noindex');
    const image = page.locator(`article img[src="${artifact.image}"]`);
    assert.equal(await image.count(), 1, 'article photograph missing');
    await image.scrollIntoViewIfNeeded();
    const dimensions = await image.evaluate(async img => {
      await img.decode();
      return {width: img.naturalWidth, height: img.naturalHeight, alt: img.alt, src: img.currentSrc};
    });
    assert.ok(dimensions.width > 0 && dimensions.height > 0, 'photo decoding');
    assert.equal(dimensions.alt, artifact.imageAlt, 'image alt');
    const photo = await page.request.get(dimensions.src);
    assert.equal(photo.status(), 200, 'photo status');
    assert.match(photo.headers()['content-type'], /^image\/(jpeg|png|webp)/);
    assert.equal(createHash('sha256').update(await photo.body()).digest('hex'), artifact.image_sha256, 'photo bytes');
    const sitemap = await page.request.get(`${base}/sitemap.xml`);
    assert.equal(sitemap.status(), 200, 'sitemap status');
    const locations = [...(await sitemap.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
    assert.ok(locations.includes(artifact.canonical ?? url), 'exact sitemap URL');
    return {url, sitemap: `${base}/sitemap.xml`, ...dimensions, image_sha256: artifact.image_sha256};
  } finally { await browser.close(); }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const artifact = JSON.parse(fs.readFileSync(0, 'utf8'));
    console.log(JSON.stringify(await verify(artifact, process.argv[2])));
  } catch {
    // Assertion errors can contain arbitrary page/response text. Never forward it to alerts.
    console.error('SEO live verification failed (article, metadata, sitemap or photograph).');
    process.exitCode = 1;
  }
}
