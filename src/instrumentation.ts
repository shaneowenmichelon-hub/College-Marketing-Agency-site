/**
 * After a production deployment is serving, submit sitemap URLs whose lastmod
 * is inside the IndexNow window. The build-time ping can run before this
 * deployment is aliased, so IndexNow may not be able to fetch the key file yet.
 * This runs once per server instance. A cron repeats it so a static-only
 * deploy still gets submitted. See content/seo/changelog.md.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  if (process.env.VERCEL_ENV !== "production" && process.env.INDEXNOW_PING !== "1") return;

  const deployment = process.env.VERCEL_DEPLOYMENT_ID ?? "local";
  const globalState = globalThis as typeof globalThis & { __collegiateIndexNowDeployment?: string };
  if (globalState.__collegiateIndexNowDeployment === deployment) return;
  globalState.__collegiateIndexNowDeployment = deployment;

  try {
    const { default: sitemap } = await import("@/app/sitemap");
    const { pingIndexNow } = await import("@/lib/indexnow");
    const result = await pingIndexNow(sitemap());
    console.log(`indexnow startup status=${result.status} urls=${result.count}`);
  } catch (error) {
    console.error("indexnow startup ping failed", error);
  }
}
