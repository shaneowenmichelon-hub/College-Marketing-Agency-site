/**
 * Permanent redirect from the public production *.vercel.app aliases to the apex.
 *
 * Scope is an exact host match, not VERCEL_ENV. A production deployment's unique
 * URL and the team git alias also run with VERCEL_ENV=production. Those hosts
 * are behind Vercel SSO (x-robots-tag: noindex) and are how preview checks and
 * the SSO login return. Matching only the stable public aliases leaves them
 * alone.
 *
 * /api is excluded. Vercel Cron GETs the production deployment URL, documented
 * as https://*.vercel.app/api/cron, and does not follow redirects. All three
 * crons live under /api/cron. Gmail OAuth and the other route handlers do too.
 * IndexNow does not call this host: the postbuild ping runs in the build, the
 * startup hook fetches https://collegiateagency.com/sitemap.xml, and the cron
 * route builds the sitemap in-process.
 *
 * The same rules are copied into vercel.json so the platform applies them at
 * the edge, before the cached HTML for these aliases. next.config imports this
 * module so `next start` and the Next.js routing manifest do the same thing.
 */

export const CANONICAL_ORIGIN = "https://collegiateagency.com";

/**
 * Public production aliases that answer HTTP 200 with index,follow.
 * college-marketing-agency-site-s8tw is a second Vercel project that deploys
 * this same repo. Team-scoped aliases (*.vercel.app behind SSO) are omitted.
 */
export const PRODUCTION_VERCEL_ALIAS_HOSTS = [
  "college-marketing-agency-site.vercel.app",
  "college-marketing-agency-site-s8tw.vercel.app",
];

/** Matches every path except /api and /api/*. */
export const PRODUCTION_ALIAS_REDIRECT_SOURCE = "/:path((?!api(?:/|$)).*)";

export function productionAliasRedirects() {
  return PRODUCTION_VERCEL_ALIAS_HOSTS.map((host) => ({
    source: PRODUCTION_ALIAS_REDIRECT_SOURCE,
    has: [
      {
        type: "host",
        value: `^${host.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
      },
    ],
    destination: `${CANONICAL_ORIGIN}/:path*`,
    permanent: true,
  }));
}
