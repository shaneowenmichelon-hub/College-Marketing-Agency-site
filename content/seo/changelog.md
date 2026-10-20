# SEO changelog

## 2026-10-20 — Technical SEO fixes

Metadata, structured data, canonicals, and the sitemap. No article bodies were edited, and the contact email and `sameAs` list were left as published.

- Homepage title is `College Marketing Agency | Collegiate Agency`. The meta description now leads with college and campus marketing for campus events and brand ambassador programs.
- Root title template is `%s | Collegiate Agency`. Page titles are absolute, so a title that already names Collegiate Agency is not suffixed again. The brand is omitted when adding it would push the title past 60 characters. `/404` uses `Page not found | Collegiate Agency` instead of the homepage title.
- Organization and ProfessionalService are one node at `https://collegiateagency.com/#organization`, with the existing mark at `/logo.svg` and a PostalAddress of New York, NY, US. The contact-page line "Brand partnerships and campus activations" is no longer emitted as `streetAddress`. A WebSite node points at that organization. `/services/events` and `/services/brand-ambassadors` emit Service JSON-LD (prices still come from `pricing` in `site.config.ts`) and their breadcrumbs are Home → Services → the service.
- Each public page sets `og:url`, `og:title`, `og:description`, and the matching Twitter tags from its own title, description, and canonical path. The root layout no longer forces the homepage values onto child routes.
- `/insights/sos-consultants-nola-campus-leasing-ambassadors` and `/insights/nutrl-night-school-tour-product-placement` 301 to the matching `/work/` URLs. They are removed from article listings, `llms.txt` articles, and the sitemap. `/work/` remains the canonical home.
- Case studies with `sample: true` (Celsius) are `noindex, follow` and are omitted from the sitemap. They stay on `/work` with the existing industry-example label.
- Sitemap `lastmod` uses post `dateModified` when frontmatter has it, otherwise `date`. The two real case studies use the publish dates already stored with those write-ups (2026-08-03 and 2026-08-02). Static routes updated here use 2026-10-20.
- `llms.txt` links Events and Brand Ambassadors to `/services/events` and `/services/brand-ambassadors`. Product placement links to `/services` because that channel has no standalone page. The file opens with a one-line definition of Collegiate Agency. The contact email is unchanged.
