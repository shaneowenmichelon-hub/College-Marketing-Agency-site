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
  // Match preflight: target checks use a fresh HTTP context, not browser cookies
  // or its UA. Some public institutional sites reject the Chromium UA even
  // while serving the same URL normally to the HTTP client.
  const client = await request.newContext();
  try { return await verifyTargets(client, links, base); }
  finally { await client.dispose(); }
}

export async function verifyTables(page, expected) {
  const evidence = [];
  for (const width of [1280, 390, 320]) {
    await page.setViewportSize({width, height: 900});
    // The mid-article CTA sits between two prose regions so its links stay out of
    // the body-link count. Tables in either region belong to the same article.
    const regions = await page.locator('article .prose-custom').evaluateAll((bodies) => bodies.map((body) => {
      const tables = [...body.querySelectorAll('table')].map(table => {
        const wrapper = table.parentElement;
        const cells = [...table.querySelectorAll('tbody td, tbody th')];
        const overflow = wrapper.scrollWidth > wrapper.clientWidth;
        wrapper.scrollLeft = wrapper.scrollWidth;
        const scrolls = wrapper.scrollLeft > 0;
        wrapper.scrollLeft = 0;
        return {
          columns: table.querySelectorAll('thead th[scope="col"]').length,
          rows: table.querySelectorAll('tbody tr').length,
          rowHeaders: table.querySelectorAll('tbody th[scope="row"]').length,
          dataCells: table.querySelectorAll('tbody td').length,
          fontSize: Math.min(...cells.map(c => parseFloat(getComputedStyle(c).fontSize))),
          lineHeight: Math.min(...cells.map(c => parseFloat(getComputedStyle(c).lineHeight))),
          overflowX: getComputedStyle(wrapper).overflowX,
          focusable: wrapper.tabIndex === 0, overflow, scrolls,
          wrapperWidth: wrapper.clientWidth, tableWidth: table.getBoundingClientRect().width,
        };
      });
      return {tables, rawPipes: [...body.querySelectorAll('p')].some(p => /^\s*\|/m.test(p.textContent)),
        pageWidth: document.documentElement.scrollWidth, viewport: innerWidth};
    }));
    const result = {
      tables: regions.flatMap((region) => region.tables),
      rawPipes: regions.some((region) => region.rawPipes),
      pageWidth: regions[0]?.pageWidth ?? 0,
      viewport: regions[0]?.viewport ?? 0,
    };
    assert.equal(result.tables.length, expected, 'semantic table count');
    assert.equal(result.rawPipes, false, 'raw markdown pipes');
    assert.ok(result.pageWidth <= width + 1, 'horizontal page overflow');
    for (const t of result.tables) {
      assert.ok(t.columns >= 2 && t.rows > 0 && t.dataCells > 0 && t.rowHeaders === t.rows, 'table semantics');
      assert.ok(t.fontSize >= 14 && t.lineHeight >= 18, 'readable table typography');
      assert.ok(['auto','scroll'].includes(t.overflowX) && t.focusable, 'accessible table scroller');
      if (t.overflow) assert.ok(t.scrolls, 'table scroll interaction');
    }
    evidence.push({width, ...result});
  }
  return evidence;
}

/**
 * Inline photos have to be owned library assets, with alt text, and they
 * cannot repeat the hero or each other. The live request check is separate.
 */
export function assertOwnedInlinePhotos(photos, libraryText, heroSrc = '') {
  assert.ok(Array.isArray(photos), 'inline photo list');
  const seen = new Set();
  if (heroSrc) seen.add(heroSrc);
  const sections = libraryText.split(/^#{1,6} /m);
  for (const photo of photos) {
    assert.equal(typeof photo.alt, 'string', 'inline photo alt');
    assert.ok(photo.alt.trim(), 'inline photo alt');
    assert.ok(!seen.has(photo.src), 'inline photo repeat');
    seen.add(photo.src);
    const entry = sections.find((section) => section.includes(`- Local asset: \`${photo.src}\``));
    assert.ok(entry, 'inline photo owned');
    assert.match(entry, /^- Rights: owned\./m, 'inline photo owned');
    assert.doesNotMatch(entry, /^- Status: disallowed/m, 'inline photo disallowed');
  }
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
      return {width: img.naturalWidth, height: img.naturalHeight, alt: img.alt, src: img.getAttribute('src'), currentSrc: img.currentSrc};
    });
    assert.ok(dimensions.width > 0 && dimensions.height > 0, 'photo decoding');
    assert.equal(dimensions.alt, artifact.imageAlt, 'image alt');
    // Verify the canonical source asset, not a Next/Image optimized derivative.
    // Optimized derivatives can differ in dimensions and bytes while the source
    // file at `src` remains the publication receipt the autopublisher hashed.
    const photo = await page.request.get(new URL(dimensions.src, base).href);
    assert.equal(photo.status(), 200, 'photo status');
    assert.match(photo.headers()['content-type'], /^image\/(jpeg|png|webp)/);
    assert.equal(createHash('sha256').update(await photo.body()).digest('hex'), artifact.image_sha256, 'photo bytes');
    const sitemap = await page.request.get(`${base}/sitemap.xml`);
    assert.equal(sitemap.status(), 200, 'sitemap status');
    const locations = [...(await sitemap.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
    assert.ok(locations.includes(artifact.canonical ?? url), 'exact sitemap URL');
    // Historical receipts predate body_links; every newly validated artifact carries it.
    const body_links = artifact.body_links ? await verifyBodyLinks(page, artifact.body_links, base) : undefined;
    const tables = artifact.tables !== undefined ? await verifyTables(page, artifact.tables) : undefined;
    let inline_photos;
    if (Array.isArray(artifact.inline_photos) && artifact.inline_photos.length) {
      const libraryPath = path.join(process.cwd(), 'content/seo/public-photo-library.md');
      assertOwnedInlinePhotos(artifact.inline_photos, fs.readFileSync(libraryPath, 'utf8'), artifact.image);
      const figures = await page.locator('article figure img').evaluateAll(async (imgs) => {
        const out = [];
        for (const img of imgs) {
          try { await img.decode(); } catch { /* status check below still runs on the file URL */ }
          out.push({
            alt: img.alt,
            width: Number(img.getAttribute('width')),
            height: Number(img.getAttribute('height')),
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
          });
        }
        return out;
      });
      inline_photos = [];
      for (const photo of artifact.inline_photos) {
        const rendered = figures.find((figure) => figure.alt === photo.alt);
        assert.ok(rendered, 'inline photo alt missing');
        assert.ok(rendered.width > 0 && rendered.height > 0, 'inline photo dimensions');
        const response = await page.request.get(new URL(photo.src, base).href);
        assert.equal(response.status(), 200, 'inline photo status');
        assert.match(response.headers()['content-type'] ?? '', /^image\/(jpeg|png|webp)/);
        inline_photos.push({src: photo.src, alt: photo.alt, status: 200, width: rendered.width, height: rendered.height});
      }
    }
    return {url, sitemap: `${base}/sitemap.xml`, ...dimensions, image_sha256: artifact.image_sha256, body_links, tables, inline_photos};
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
