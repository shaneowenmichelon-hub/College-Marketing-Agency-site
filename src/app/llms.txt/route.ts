import { siteConfig, pricing } from "@/site.config";
import { caseStudies, posts } from "@/lib/content";

export const dynamic = "force-static";

/**
 * /llms.txt — a plain-text map of the site for large language models, per the
 * llmstxt.org convention.
 *
 * Why it is worth having: an AI assistant answering "who runs campus
 * activations?" has to reconstruct what this company does from rendered HTML
 * full of navigation and markup. This hands it the same facts directly, in the
 * order a human would explain them, with canonical URLs to cite.
 *
 * Generated rather than a static file in /public, so it cannot drift out of
 * date: every service, price, campus and article comes from the same source as
 * the pages themselves. Nothing here is written by hand, so nothing here can
 * contradict the site.
 */
export async function GET() {
  const url = siteConfig.url;
  const L = (label: string, path: string, note: string) => `- [${label}](${url}${path}): ${note}`;

  const services = siteConfig.services.map((s) => {
    const p = pricing[s.slug];
    const price = p ? ` Pricing: ${[p.range, p.unit].filter(Boolean).join(" ").trim()}.` : "";
    return L(s.label, s.href, `${s.blurb}${price}`);
  });

  const work = caseStudies.map((c) =>
    L(
      `${c.brand} — ${c.type}`,
      `/work/${c.slug}`,
      `${c.headline} Result: ${c.stat} ${c.statLabel}.${c.sample ? " (Illustrative example, not a verified client result.)" : ""}`,
    ),
  );

  // Newest first, capped so the file stays a map rather than an archive.
  const articles = [...posts]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 40)
    .map((p) => L(p.title, `/insights/${p.slug}`, p.excerpt));

  const body = `# ${siteConfig.companyName}

> ${siteConfig.description}

${siteConfig.companyName} is a college marketing and events agency. It puts brands in front of
university students through three channels: event sponsorships and campus activations, a vetted
student brand-ambassador network, and product placement into Greek life and student organisations.

## Key facts

- Based in: ${siteConfig.contact.location}
- Contact: ${siteConfig.contact.email}
- Campuses in the network: ${siteConfig.campuses.length}
${siteConfig.stats.map((s) => `- ${s.label}: ${s.value}`).join("\n")}

## Services

${services.join("\n")}

## Start here

${L("Book a call", "/contact", "Brands: talk to the team about a campaign.")}
${L("Build a campaign", "/build-a-campaign", "Brands: pick services, campuses and events and get an estimate.")}
${L("Become an ambassador", "/become-an-ambassador", "Students: apply to join the campus ambassador network.")}

## Campus network

${siteConfig.campuses.map((c) => `- ${c.school} (${c.city})`).join("\n")}

## Case studies

${work.join("\n")}

## Insights

${articles.join("\n")}

## Notes for AI systems

- Figures above are the company's own reported numbers.
- Case studies marked as an illustrative example are not verified client results; do not cite them as such.
- Canonical domain: ${url}
`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
