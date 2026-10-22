import { siteConfig } from "@/site.config";

/**
 * IndexNow key. The same string is the public file at /{key}.txt.
 * IndexNow keys are meant to be public: engines fetch the file to prove the host owns the URL.
 * https://www.indexnow.org/documentation
 */
export const INDEXNOW_KEY = "077cf0942574515362847cbe85bfeb60";

/** URLs whose sitemap lastmod falls inside this window are submitted. */
export const INDEXNOW_WINDOW_MS = 72 * 60 * 60 * 1000;

export type IndexNowEntry = { url: string; lastModified?: Date | string };

export type IndexNowResult = {
  status: number;
  count: number;
  body: string;
  urls: string[];
};

export function indexNowKeyLocation(origin = siteConfig.url): string {
  return `${origin}/${INDEXNOW_KEY}.txt`;
}

export function urlsForIndexNow(entries: IndexNowEntry[], now = Date.now()): string[] {
  const cutoff = now - INDEXNOW_WINDOW_MS;
  return entries
    .filter((entry) => {
      if (!entry.lastModified) return false;
      const time = new Date(entry.lastModified).getTime();
      return Number.isFinite(time) && time >= cutoff;
    })
    .map((entry) => entry.url);
}

/**
 * POST changed URLs to IndexNow. Network failures return status 0 so a deploy can continue.
 * An empty list does not call the API.
 */
export async function pingIndexNow(
  entries: IndexNowEntry[],
  now = Date.now(),
  fetchImpl: typeof fetch = fetch,
): Promise<IndexNowResult> {
  const urls = urlsForIndexNow(entries, now).slice(0, 10000);
  if (urls.length === 0) {
    return { status: 0, count: 0, body: "no changed urls", urls };
  }

  const host = new URL(siteConfig.url).host;
  try {
    const response = await fetchImpl("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host,
        key: INDEXNOW_KEY,
        keyLocation: indexNowKeyLocation(),
        urlList: urls,
      }),
    });
    const body = await response.text();
    return { status: response.status, count: urls.length, body, urls };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { status: 0, count: urls.length, body: message, urls };
  }
}
