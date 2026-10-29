const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const { match } = require("next/dist/compiled/path-to-regexp");
const { prepareDestination } = require("next/dist/shared/lib/router/utils/prepare-destination");

const root = path.join(__dirname, "..");

test("public production aliases 308 to the apex and leave /api on the alias", async () => {
  const redirectModule = await import("../src/lib/production-host-redirect.mjs");
  const nextConfig = (await import("../next.config.mjs")).default;
  const vercel = JSON.parse(fs.readFileSync(path.join(root, "vercel.json"), "utf8"));
  const rules = redirectModule.productionAliasRedirects();

  assert.deepEqual(vercel.redirects, rules);
  const fromNext = await nextConfig.redirects();
  assert.deepEqual(fromNext.slice(0, rules.length), rules);
  assert.deepEqual(
    rules.map((rule) => rule.has[0].value),
    [
      "^college-marketing-agency-site\\.vercel\\.app$",
      "^college-marketing-agency-site-s8tw\\.vercel\\.app$",
    ],
  );

  const kept = fromNext.slice(rules.length).map((rule) => rule.source);
  assert.deepEqual(kept, [
    "/services/influencers",
    "/rss.xml",
    "/insights/sos-consultants-nola-campus-leasing-ambassadors",
    "/insights/nutrl-night-school-tour-product-placement",
  ]);

  for (const rule of rules) {
    assert.equal(rule.permanent, true);
    assert.equal(rule.statusCode, undefined);
    assert.equal(rule.destination, "https://collegiateagency.com/:path*");
    assert.equal(rule.source, "/:path((?!api(?:/|$)).*)");

    const matchPath = match(rule.source, { decode: decodeURIComponent });
    assert.equal(matchPath("/api"), false);
    assert.equal(matchPath("/api/"), false);
    assert.equal(matchPath("/api/cron/mail-sync"), false);
    assert.equal(matchPath("/api/cron/indexnow"), false);
    assert.equal(matchPath("/api/cron/article-art"), false);
    assert.equal(matchPath("/api/crm/health"), false);
    assert.equal(matchPath("/api/gmail/callback"), false);
    assert.equal(matchPath("/").params.path, "");
    assert.equal(matchPath("/insights/gen-z-marketing").params.path, "insights/gen-z-marketing");

    const article = prepareDestination({
      appendParamsToQuery: true,
      destination: rule.destination,
      params: { path: matchPath("/insights/gen-z-marketing").params.path },
      query: { utm: "campus" },
    });
    assert.equal(article.parsedDestination.hostname, "collegiateagency.com");
    assert.equal(article.parsedDestination.pathname, "/insights/gen-z-marketing");
    assert.equal(article.parsedDestination.query.utm, "campus");

    const home = prepareDestination({
      appendParamsToQuery: true,
      destination: rule.destination,
      params: { path: matchPath("/").params.path },
      query: { ref: "alias" },
    });
    assert.equal(home.parsedDestination.pathname, "/");
    assert.equal(home.parsedDestination.query.ref, "alias");
  }
});

test("host match is the exact public alias, not a preview or the apex", async () => {
  const { productionAliasRedirects } = await import("../src/lib/production-host-redirect.mjs");
  const rules = productionAliasRedirects();

  function matches(hostname) {
    const host = String(hostname).split(":", 1)[0].toLowerCase();
    return rules.some((rule) => new RegExp(rule.has[0].value).test(host));
  }

  assert.equal(matches("college-marketing-agency-site.vercel.app"), true);
  assert.equal(matches("College-Marketing-Agency-Site.vercel.app"), true);
  assert.equal(matches("college-marketing-agency-site.vercel.app:443"), true);
  assert.equal(matches("college-marketing-agency-site-s8tw.vercel.app"), true);
  assert.equal(matches("collegiateagency.com"), false);
  assert.equal(matches("www.collegiateagency.com"), false);
  assert.equal(matches("college-marketing-agency-site-jus-college-aponsorship.vercel.app"), false);
  assert.equal(matches("college-marketing-agency-site-s8tw-jus-college-aponsorship.vercel.app"), false);
  assert.equal(matches("college-marketing-agency-site-1y7hf095z-jus-college-aponsorship.vercel.app"), false);
  assert.equal(matches("college-marketing-agency-sit-git-6f16d0-jus-college-aponsorship.vercel.app"), false);
  assert.equal(matches("college-marketing-agency-site-git-cursor-vercel-app-host-redirect-eafd.vercel.app"), false);

  // Next wraps the value in ^$, so an already-anchored pattern must still be exact.
  for (const rule of rules) {
    const wrapped = new RegExp("^" + rule.has[0].value + "$");
    assert.equal(wrapped.test("college-marketing-agency-site.vercel.app") || wrapped.test("college-marketing-agency-site-s8tw.vercel.app"), true);
    assert.equal(wrapped.test("college-marketing-agency-site-1y7hf095z-jus-college-aponsorship.vercel.app"), false);
    assert.equal(wrapped.test("not-college-marketing-agency-site.vercel.app.evil.com"), false);
  }
});
