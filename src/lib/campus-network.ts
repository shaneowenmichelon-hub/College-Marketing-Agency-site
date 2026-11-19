import { activationGate, cityPath, publishedMarkets, type MarketActivation } from "@/lib/campus-markets";
import { siteConfig } from "@/site.config";

/**
 * Homepage campus grid. Published city pages lead, in the same order
 * `publishedMarkets()` returns. A card links only when that market passes the
 * activation gate the city pages use. Matching schools keep their existing
 * name, city, and colour and move to the front. A published market with no
 * school card is added once. Every other campus stays put, with no link.
 */

export type CampusEntry = {
  school: string;
  city: string;
  color: string;
};

export type CampusNetworkMarket = {
  slug: string;
  city: string;
  region: string;
  activations?: MarketActivation[];
};

export type CampusNetworkCard = CampusEntry & {
  /** Set only when this card's city page is published. */
  href?: string;
};

/** Ink, not a school colour. Used only when a published market has no campus card. */
const ADDED_CAMPUS_COLOR = "#0b0b0f";

function placeName(city: string): string {
  return city.split(",")[0].trim().toLowerCase();
}

function tokens(value: string): string[] {
  return value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 0);
}

function hasTokenSequence(haystack: string[], needle: string[]): boolean {
  if (needle.length < 2 || needle.length > haystack.length) return false;
  for (let start = 0; start <= haystack.length - needle.length; start += 1) {
    let matches = true;
    for (let offset = 0; offset < needle.length; offset += 1) {
      if (haystack[start + offset] !== needle[offset]) {
        matches = false;
        break;
      }
    }
    if (matches) return true;
  }
  return false;
}

/** School name equals the slug, or a multi-word school name sits inside it. */
function schoolMatchesSlug(school: string, slug: string): boolean {
  const schoolTokens = tokens(school);
  const slugTokens = tokens(slug);
  if (schoolTokens.length === 1) {
    return slugTokens.length === 1 && schoolTokens[0] === slugTokens[0];
  }
  return hasTokenSequence(slugTokens, schoolTokens);
}

function findCampusIndex(
  market: CampusNetworkMarket,
  campuses: CampusEntry[],
  used: Set<number>,
): number {
  const city = placeName(market.city);
  const byCity = campuses.findIndex(
    (campus, index) => !used.has(index) && placeName(campus.city) === city,
  );
  if (byCity !== -1) return byCity;
  return campuses.findIndex(
    (campus, index) => !used.has(index) && schoolMatchesSlug(campus.school, market.slug),
  );
}

export function campusLinkLabel(school: string): string {
  return `${school} campus marketing activations`;
}

export function campusNetworkCards(
  campuses: CampusEntry[] = siteConfig.campuses,
  markets: CampusNetworkMarket[] = publishedMarkets(),
): CampusNetworkCard[] {
  const used = new Set<number>();
  const linked: CampusNetworkCard[] = [];

  for (const market of markets) {
    if (!activationGate(market)) continue;
    const href = cityPath(market.slug);
    const index = findCampusIndex(market, campuses, used);
    if (index === -1) {
      const region = market.region.trim();
      linked.push({
        school: market.city,
        city: region ? `${market.city}, ${region}` : market.city,
        color: ADDED_CAMPUS_COLOR,
        href,
      });
      continue;
    }
    used.add(index);
    linked.push({ ...campuses[index], href });
  }

  const rest = campuses.filter((_, index) => !used.has(index)).map((campus) => ({ ...campus }));
  return [...linked, ...rest];
}
