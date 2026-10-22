import { entriesFromSitemapXml, pingIndexNow } from "@/lib/indexnow";

/**
 * After a production deployment is serving, submit sitemap URLs whose lastmod
 * is inside the IndexNow window.
 *
 * This file is bundled for the edge runtime as well as Node, so it must not
 * import the sitemap module (that module reads the blog from disk). It fetches
 * the sitemap from this deployment instead. The build-time ping can run before
 * the deployment is aliased, so IndexNow may not be able to fetch the key file
 * yet. /api/cron/indexnow repeats the submission. See content/seo/changelog.md.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  if (process.env.VERCEL_ENV !== "production" && process.env.INDEXNOW_PING !== "1") return;

  const deployment = process.env.VERCEL_DEPLOYMENT_ID ?? "local";
  const globalState = globalThis as typeof globalThis & { __collegiateIndexNowDeployment?: string };
  if (globalState.__collegiateIndexNowDeployment === deployment) return;
  globalState.__collegiateIndexNowDeployment = deployment;

  const host = process.env.VERCEL_URL;
  if (!host) return;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(`https://${host}/sitemap.xml`, { signal: controller.signal });
    if (!response.ok) {
      console.error(`indexnow startup sitemap status=${response.status}`);
      return;
    }
    const result = await pingIndexNow(entriesFromSitemapXml(await response.text()));
    console.log(`indexnow startup status=${result.status} urls=${result.count}`);
  } catch (error) {
    console.error("indexnow startup ping failed", error);
  } finally {
    clearTimeout(timer);
  }
}
