import { siteConfig } from "@/site.config";
import { entriesFromSitemapXml, pingIndexNow } from "@/lib/indexnow";

/**
 * After a production deployment is serving, submit sitemap URLs whose lastmod
 * is inside the IndexNow window.
 *
 * This file is bundled for the edge runtime as well as Node, so it must not
 * import the sitemap module (that module reads the blog from disk). It fetches
 * the public production sitemap instead. The deployment hostname in VERCEL_URL
 * is behind Vercel SSO on these projects, so fetching it hangs until abort or
 * returns a login page and submits nothing. The production origin is public.
 *
 * The build-time ping can run before the deployment is aliased, so IndexNow
 * may answer 202 until the key file is reachable. /api/cron/indexnow repeats
 * the submission from the in-process sitemap. See content/seo/changelog.md.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  if (process.env.VERCEL_ENV !== "production" && process.env.INDEXNOW_PING !== "1") return;

  const deployment = process.env.VERCEL_DEPLOYMENT_ID ?? "local";
  const globalState = globalThis as typeof globalThis & { __collegiateIndexNowDeployment?: string };
  if (globalState.__collegiateIndexNowDeployment === deployment) return;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(`${siteConfig.url}/sitemap.xml`, {
      signal: controller.signal,
      cache: "no-store",
      headers: { accept: "application/xml, text/xml" },
    });
    if (!response.ok) {
      console.error(`indexnow startup sitemap status=${response.status}`);
      return;
    }
    const xml = await response.text();
    if (!xml.includes("<urlset")) {
      console.error("indexnow startup sitemap was not xml");
      return;
    }
    const result = await pingIndexNow(entriesFromSitemapXml(xml));
    console.log(`indexnow startup status=${result.status} urls=${result.count}`);
    // Keep retrying on this instance when the network call did not land.
    if (result.status === 200 || result.status === 202 || result.count === 0) {
      globalState.__collegiateIndexNowDeployment = deployment;
    }
  } catch (error) {
    console.error("indexnow startup ping failed", error);
  } finally {
    clearTimeout(timer);
  }
}
