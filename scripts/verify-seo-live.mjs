import { createRequire } from 'node:module';
import path from 'node:path';
// Installed profile-local copy resolves the pinned browser from the publication worktree.
const { chromium, request } = createRequire(path.join(process.cwd(), 'package.json'))('playwright');
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
import assert from 'node:assert/strict';

/** HTTP target checks are separate from editorial relevance review. */
export async function verifyTargets(request, links, base = 'https://collegiateagency.com') {
  assert.ok(Array.isArray(links) && links.length >= 3, 'missing contextual link artifact');
  const evidence = [];
  for (const link of links) {
    const url = new URL(link.href, base);
    const response = await request.get(url.href, {timeout: 30000});
    assert.equal(response.status(), 200, 'contextual destination status');
    const final = new URL(response.url());
    assert.ok(!/\/(login|signin|sign-in|auth)(?:\/|$)/i.test(final.pathname), 'login-only destination');
    const type = response.headers()['content-type'] ?? '';
    assert.match(type, /text\/html|application\/pdf/, 'reference document type');
    if (type.includes('text/html')) {
      const html = await response.text();
      const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '';
      assert.ok(!/access denied|just a moment|sign in|log in|page not found|robot check/i.test(title), 'inaccessible reference');
      assert.ok(html.replace(/<[^>]*>/g, ' ').trim().length > 200, 'empty reference');
      if (url.hash && link.kind === 'internal') {
        assert.ok(html.includes(`id="${url.hash.slice(1)}"`) || html.includes(`id='${url.hash.slice(1)}'`), 'missing internal fragment');
      }
      evidence.push({href: link.href, status: 200, final_url: response.url(), title});
    } else evidence.push({href: link.href, status: 200, final_url: response.url(), type});
  }
  return evidence;
}

export async function verifyBodyLinks(page, links, base) {
  assert.ok(Array.isArray(links) && links.length >= 3, 'missing contextual link artifact');
  const actual = await page.locator('article .prose-custom a[href]').evaluateAll(anchors => anchors.map(a => ({href: a.getAttribute('href'), anchor: a.textContent.trim()})));
  assert.equal(actual.length, links.length, 'rendered contextual link count');
  assert.equal(new Set(actual.map(a => a.href)).size, actual.length, 'duplicate rendered links');
  for (const link of links) {
    assert.ok(actual.some(a => a.href === link.href && a.anchor === link.anchor), 'contextual anchor missing from body');
  }
  return verifyTargets(page.request, links, base);
}

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
    // Historical receipts predate body_links; every newly validated artifact carries it.
    const body_links = artifact.body_links ? await verifyBodyLinks(page, artifact.body_links, base) : undefined;
    return {url, sitemap: `${base}/sitemap.xml`, ...dimensions, image_sha256: artifact.image_sha256, body_links};
  } finally { await browser.close(); }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const artifact = JSON.parse(fs.readFileSync(0, 'utf8'));
    if (process.argv.includes('--targets')) {
      const client = await request.newContext();
      try { console.log(JSON.stringify(await verifyTargets(client, artifact.body_links, process.argv[2]))); }
      finally { await client.dispose(); }
    } else console.log(JSON.stringify(await verify(artifact, process.argv[2])));
  } catch {
    // Assertion errors can contain arbitrary page/response text. Never forward it to alerts.
    console.error('SEO live verification failed (article, metadata, sitemap or photograph).');
    process.exitCode = 1;
  }
}
