/**
 * In-house editorial + industry-reference case studies. Articles are original,
 * long-form Collegiate Agency writing. Industry benchmarks (engagement-rate
 * bands, audience-geography thresholds) are phrased as approximate guidance; any
 * Collegiate Agency / Night School figure must already exist in site.config.
 * IMPORTANT: never import a competitor's real clients or numbers here.
 */
import { siteConfig, getStat } from "@/site.config";
import { loadMdxPosts } from "@/lib/blog-files";

export type PostCategory =
  | "Campus Strategy"
  | "Ambassadors"
  | "Brand Ambassadors"
  | "Events"
  | "Product Placement";

type ServiceSlug = "events" | "brand-ambassadors" | "product-placement";

/** A single rendered block of an article body. `html` blocks allow inline tags. */
export type ArticleBlock =
  | { type: "p"; html: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] };

export type Post = {
  slug: string;
  title: string;
  /** Optional SEO title; page title falls back to title. */
  metaTitle?: string;
  /** Optional SEO description; meta description falls back to excerpt. */
  metaDescription?: string;
  /** SEO planning fields used by file-based blog posts. */
  primaryKeyword?: string;
  secondaryKeywords?: string[];
  category: PostCategory;
  /** Which service pages should surface this post under "Related insights". */
  services: ServiceSlug[];
  excerpt: string;
  date: string;
  readingTime: string;
  /** Byline. Defaults to the company name when omitted. */
  author?: string;
  /** Per-article social image; falls back to the site default. */
  ogImage?: string;
  /** The service page the closing CTA points at. */
  ctaService: ServiceSlug;
  /** Full article body. */
  body: ArticleBlock[];
};

const AUTHOR = siteConfig.companyName;

/** Estimate reading time from an article body (~225 wpm). */
export function estimateReadingTime(body: ArticleBlock[]): string {
  const text = body
    .map((b) => {
      if (b.type === "p") return b.html;
      if (b.type === "h2") return b.text;
      return b.items.join(" ");
    })
    .join(" ")
    .replace(/<[^>]+>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 225))} min read`;
}

// -- Article 1 - SOS Consultants Nola campaign (Brand Ambassadors) ----------
const sosInsightBody: ArticleBlock[] = [
  {
    type: "p",
    html: "SOS Consultants Nola had the exact problem most local service businesses face around campus: students needed the service, but the brand had to reach them at the right moment, in the right neighborhood, with enough repetition to turn awareness into actual inquiries. For a New Orleans leasing agency, that meant connecting with students when housing decisions were live, social calendars were full, and attention was split between class, events, friends, and feeds. A standard ad campaign could put a flyer in front of students. The stronger play was to make SOS visible both in person and online, using the same creative system across a real campus moment and targeted Meta ads.",
  },
  {
    type: "p",
    html: "The package was intentionally compact: a $2,500 campaign spanning two shows, an on-site activation at the show, and a round of ambassador posts. The posts used dedicated flyer and video creative, and that same creative was then run as localized paid advertising on Meta. That mattered because the campaign did not ask students to process three different messages. They saw the same leasing offer from campus ambassadors, around a live social event, and again in their feeds afterward. The result was a campaign that behaved less like a one-off promotion and more like a coordinated local demand engine.",
  },
  { type: "h2", text: "The strategy: combine trusted student distribution with localized paid media" },
  {
    type: "p",
    html: "Ambassador posts gave SOS a peer-to-peer entry point. Instead of relying only on brand-owned ads, the campaign started with students who could place the message inside real campus social circles. For a leasing agency, that trust layer is important. Students are not just buying a drink or downloading an app; they are deciding where to live, who to call, and which local operators feel legitimate. A flyer or video posted by a student ambassador helps make the brand familiar before the paid ad ever appears.",
  },
  {
    type: "p",
    html: "The live-event component added physical context. Across the two shows, SOS was attached to moments students were already choosing to attend. The activation gave the campaign a real-world presence: not just a logo in a feed, but a local leasing partner showing up where the student audience was already gathered. That kind of environment makes the ad spend more efficient because students have already seen the name in a social setting. When the Meta ad appears later, it is not the first touch; it is the reminder.",
  },
  { type: "h2", text: "Why the same creative ran across ambassadors and Meta" },
  {
    type: "p",
    html: "The most important execution choice was keeping the flyer and video creative consistent. Too many local campaigns split the message: one version for ambassadors, another for events, and a third for ads. SOS avoided that. The dedicated creative from the ambassador round became the same creative used for paid Meta placement, which let the campaign build frequency without confusing the audience. Students could recognize the same offer and the same brand identity whether they saw it from a friend, at the show, or in an Instagram placement.",
  },
  {
    type: "p",
    html: "The paid media layer was localized to campus, which kept the budget focused. For a New Orleans leasing agency, broad reach would have wasted money on people outside the decision zone. The campaign did not need everyone in the city. It needed students near the relevant schools, in the right age and interest environment, who were likely to be thinking about housing or responding to student-life content. Localized targeting turned the ambassador creative into a performance channel instead of treating social posts as a vanity deliverable.",
  },
  { type: "h2", text: "The result: 11x return on ad spend" },
  {
    type: "p",
    html: "From a total package spend of $2,500, SOS Consultants Nola achieved an 11x return on ad spend. The number is the headline, but the mechanism is the lesson: the return came from stacking channels that reinforced each other. The ambassador posts created familiarity. The shows created real-world context. The activation made the brand tangible. The Meta ads repeated the same flyer and video creative to the same local student market. Each piece made the next one work harder.",
  },
  {
    type: "p",
    html: "For local businesses trying to reach college students, this is the model we want to repeat. You do not need a massive national budget to create real movement on campus. You need the right audience, a student-trusted distribution layer, a reason for the brand to appear in the real world, and paid media targeted tightly enough that every dollar stays close to the students who can act. SOS Consultants Nola proved that a lean, coordinated campus package can produce performance-level returns when ambassadors, events, and ads are treated as one system.",
  },
  {
    type: "p",
    html: 'If your brand needs local student demand, whether that means leasing inquiries, product trial, app downloads, retail visits, or event attendance, the takeaway is simple: do not separate campus ambassadors from paid media. Use ambassadors to create trust, use events to create context, and use localized Meta ads to turn the same creative into measurable conversion. <a href="/contact">Tell us the campus and the goal</a>, and we can build the same kind of integrated package around your market.',
  },
];

// -- Article 2 - NUTRL Night School Tour campaign (Product Placement) ----------
const nutrlInsightBody: ArticleBlock[] = [
  {
    type: "p",
    html: "NÜTRL came into the Night School Tour with a clear product-placement opportunity: do more than place a logo on a flyer. The brand had a chance to become part of the actual college-event economy: the venues stocking the product, the local organizations helping host the nights, the ambassadors pushing the story, and the students seeing the same name repeatedly across the tour. That is the difference between sponsorship as signage and sponsorship as distribution.",
  },
  {
    type: "p",
    html: "The tour gave NÜTRL a high-intent environment. Night School is built around live college markets, nightlife venues, student organizations, and ambassador promotion, which meant the brand could show up where students were already making weekend plans. As presenting sponsor, NÜTRL did not need to interrupt the audience. It could attach itself to the night students were already choosing, then extend that presence through venues, partner organizations, social content, and ambassador posts.",
  },
  { type: "h2", text: "The strategy: turn sponsorship into local product movement" },
  {
    type: "p",
    html: "The strongest part of the campaign was that it connected brand visibility to actual case movement. Across the tour, venues purchased 350 cases connected to the sponsorship. Another 75 cases went to local organizations that partnered on the tour, putting NÜTRL directly into the hands of the groups helping create the event energy. That combination mattered. Venue buys gave the product a retail-style presence inside the nightlife environment; organization cases put the product closer to the student leaders and social circles driving turnout.",
  },
  {
    type: "p",
    html: "This is exactly what product placement should do in college marketing. The product cannot just appear in a recap photo after the fact. It has to be present in the room, attached to the hosts, seen by the crowd, and reinforced by the students who have real distribution power on campus. Night School gave NÜTRL that structure: a live event series with existing attention, local partners with social credibility, and ambassadors capable of pushing the same message before and after each stop.",
  },
  { type: "h2", text: "Why presenting sponsor status mattered" },
  {
    type: "p",
    html: "Presenting sponsor status gave NÜTRL ownership of the tour narrative. Instead of being one of many brands around the edges, the brand sat at the center of the Night School experience. That positioning created a cleaner story for venues, student partners, and ambassadors to repeat: NÜTRL was not simply sampling at a party; NÜTRL was powering the tour. For a beverage brand, that distinction matters because students remember who made the night feel bigger.",
  },
  {
    type: "p",
    html: "The social layer extended that ownership beyond the room. Across tour socials and ambassador posts, the campaign received roughly 5 million social insights. That reach was not isolated from the event footprint; it was built from the same ecosystem. Students saw the brand in content about the shows, through ambassador posts, through partner organizations, and through the venues where the product was actually being moved. The result was a campaign where the online attention and offline product movement supported each other instead of living in separate reports.",
  },
  { type: "h2", text: "The result: product placement with measurable media value" },
  {
    type: "p",
    html: "The campaign produced 425 total cases across venue purchases and local organization partner cases. It also generated about 5 million social insights across owned tour channels, ambassador posts, and partner promotion. Based on that visibility, the campaign created an estimated $175,000 in paid media value, while the presenting sponsorship cost was $50,000. That means NÜTRL received media value well above the sponsorship fee before even counting the on-premise product movement, venue relationships, or student organization distribution.",
  },
  {
    type: "p",
    html: "For brands evaluating college sponsorships, this is the key lesson: the best event partnerships are not only awareness plays. They are distribution systems. A tour like Night School can create demand with students, give venues a reason to buy, give organizations a reason to participate, and give ambassadors a real story to post. NÜTRL's placement worked because the product was tied to every layer of the campaign: the show, the social content, the venue relationship, and the campus partner network.",
  },
  {
    type: "p",
    html: 'If your brand wants college product placement that reaches beyond a logo, the model is clear: own the event moment, put product into the partner network, and let campus ambassadors turn that placement into social proof. <a href="/contact">Tell us the markets you want</a>, and we can build the right Night School or campus-event package around your launch.',
  },
];

// ── Article 3 - Welcome week (Events) ────────────────────────────────────────
const welcomeWeekBody: ArticleBlock[] = [
  {
    type: "p",
    html: "Ask anyone who markets to college students where the leverage is, and the honest answer is a window most brands sleep through. The first two weeks of each semester - welcome week, syllabus week, whatever a given campus calls it - are when the entire social and behavioral map of the year gets drawn. A brand that shows up authentically in that window doesn't just buy attention; it buys a place in habits that hold for months. We build our whole events calendar around this, and it's the single most repeatable edge we hand to brands.",
  },
  { type: "h2", text: "The first two weeks set the whole year" },
  {
    type: "p",
    html: "At the start of a semester, students are deciding almost everything at once: which friend groups they'll run with, which spots they'll frequent, which routines and loyalties will define the next several months. Move-in, the org fair, the first parties, the first trip to the store to stock a dorm or apartment - it all happens in a compressed, high-stakes stretch where nothing is settled yet. Openness is at its absolute peak. New students especially are actively looking for what to adopt, and returning students are resetting their defaults after a summer away.",
  },
  {
    type: "p",
    html: "A brand that lands authentically in that moment buys mindshare that a mid-semester push simply can't reach, because by October those decisions are already made. The energy drink someone grabs during their first week becomes the one they keep in the fridge. The seltzer handed to them at the first big show becomes the one they ask for at the next party. Habits formed under that much social pressure are sticky in a way that a random Tuesday in the middle of the term will never replicate.",
  },
  {
    type: "p",
    html: "And here's the part most brands miss: this isn't a once-a-year event. Both fall and spring open with a welcome-week window, which makes it a <strong>one-to-two-times-per-school-year</strong> opportunity to plant that first impression. Miss the fall, and there's a second front door in January.",
  },
  { type: "h2", text: "The cost of showing up late" },
  {
    type: "p",
    html: "The flip side of all that leverage is what happens when a brand waits. A campaign that launches in week seven is fighting uphill against loyalties that have already hardened - it has to <em>displace</em> a habit instead of forming one, which is far more expensive and far less certain. Mid-semester spend isn't wasted, but it's working against the calendar rather than with it. The brands that win a campus almost always got there first, in the window when students were still deciding who to let in. Timing isn't a detail here; it's most of the strategy.",
  },
  { type: "h2", text: "Why events beat ads in this window" },
  {
    type: "p",
    html: "A feed impression during syllabus week competes with a thousand others and is forgotten in seconds. An in-person moment during the same window does something a screen can't: it attaches a brand to a real memory, in a high-energy, high-openness setting, surrounded by the exact peers whose opinions students are calibrating against. That's presence and authenticity over raw reach - and it's why experiential integration outperforms media spend precisely when students are most impressionable. You're not renting eyeballs; you're becoming part of the story of someone's first week.",
  },
  {
    type: "p",
    html: "Picture the two versions side by side. In one, a student scrolls past a video ad for a drink between classes and forgets it before they've unlocked the next app. In the other, that same student is handed the same drink at a packed welcome-week show, tries it while the headliner is on, sees their friends holding it too, and posts the moment themselves. Only one of those creates an association strong enough to survive to the checkout line. The medium isn't a nice-to-have - it's the entire difference between reach and recall.",
  },
  { type: "h2", text: "Our proof: the Night School Tour" },
  {
    type: "p",
    html: "This isn't theory for us. The <strong>Night School Tour</strong> is our flagship welcome-week and syllabus-week concert series - an owned, ever-growing network of shows that run one to two times per school year across our campus markets. It's infrastructure brands can plug into on day one, not a program we'd have to build from scratch for each campaign. The stages, the talent, the campus relationships, and the crowd are already there.",
  },
  {
    type: "p",
    html: `That network is real and it's sizeable. Across our footprint we work with roughly ${getStat("campuses")} campus markets and a student-facing reach in the range of ${getStat("studentsReached")} - the kind of scale that turns a single welcome-week window into a coordinated, multi-market moment rather than a one-off activation.`,
  },
  { type: "h2", text: "The structural advantage: who's behind us" },
  {
    type: "p",
    html: "There's a reason we can promise owned infrastructure instead of a pitch deck. Collegiate Agency is backed by the national Gen-Z events company behind the Night School Tour - the team at ZMM Events - which means real, tested expertise in amplifying brands through live college events. Production, talent booking, and on-the-ground campus relationships are already in place and already running.",
  },
  {
    type: "p",
    html: "That's the difference between us and a generic marketing agency. A typical agency approaches a campus activation as a project to assemble from scratch: find a venue, pull permits, book talent, hope a crowd materializes, and absorb the risk if it doesn't. We start from the opposite end. The show already exists, the students already come, and the brand is stepping into a moment with its own gravity rather than manufacturing one. When the events are owned, the brand's dollars go into <em>integration</em> - being part of the night - instead of into praying the night happens at all.",
  },
  {
    type: "p",
    html: "It also means the authenticity is built in. Because these are genuine campus events students already care about, a brand's presence reads as part of the experience rather than an interruption of it. That's the hardest thing to fake in college marketing, and it's the thing owned infrastructure gives you for free.",
  },
  {
    type: "p",
    html: "There's a compounding effect worth naming, too. When a brand shows up at the same welcome-week series semester after semester, students start to expect it - the association stops being a campaign and becomes part of how they remember the event itself. That kind of continuity is only possible when the events are a standing network rather than a one-time booking, and it's a large part of why plugging into existing infrastructure beats building a bespoke activation that vanishes the moment the campaign budget does.",
  },
  { type: "h2", text: "How a brand plugs in" },
  {
    type: "p",
    html: "Once you're inside a welcome-week show, the ways to integrate are concrete and stack on top of each other:",
  },
  {
    type: "ul",
    items: [
      "<strong>Product sampling</strong> - put the product in students' hands at the exact moment they're forming semester habits, where trial converts to routine.",
      "<strong>Stage and branding moments</strong> - visible, high-energy association with the show itself, tied to the peak of the night rather than the margins of a feed.",
      "<strong>Ambassador-run activations</strong> - our vetted campus ambassadors work the event, turning a logo into real conversations and hands-on trial.",
      "<strong>Content capture</strong> - with athletes and influencers already in attendance, the night produces authentic, reusable content that keeps working long after the lights come up.",
    ],
  },
  { type: "h2", text: "Claim the window before it fills" },
  {
    type: "p",
    html: "Welcome week is the highest-leverage moment on the campus calendar, it comes around only once or twice a year per school, and the inventory for any given market is finite. The brands that win it are the ones that decide early. If reaching students where their year actually takes shape is on your list, the move is to claim a welcome-week window before the markets you care about are spoken for.",
  },
  {
    type: "p",
    html: 'Explore how brands sponsor our shows on the <a href="/services/events">events page</a> and browse the live sponsorship directory there - or <a href="/contact">tell us which markets you want</a> and we\'ll help you lock a window before it\'s gone.',
  },
];

const legacyPosts: Post[] = [
  {
    slug: "sos-consultants-nola-campus-leasing-ambassadors",
    title: "How SOS Consultants Nola used campus ambassadors and localized ads to drive 11x ROAS",
    metaTitle: "SOS Consultants Nola Campus Ambassador Case Study | Collegiate Agency",
    metaDescription:
      "A New Orleans leasing agency case study: two shows, an on-site activation, ambassador posts, localized Meta ads, and 11x return on ad spend from a $2,500 package.",
    category: "Brand Ambassadors",
    services: ["brand-ambassadors", "events"],
    excerpt:
      "A New Orleans leasing agency used two shows, an on-site activation, ambassador posts, and localized Meta ads to turn a $2,500 campus package into 11x ROAS.",
    date: "2026-08-03",
    author: AUTHOR,
    ctaService: "brand-ambassadors",
    body: sosInsightBody,
    readingTime: estimateReadingTime(sosInsightBody),
  },
  {
    slug: "nutrl-night-school-tour-product-placement",
    title: "How NÜTRL turned Night School Tour product placement into 425 cases and 5M social insights",
    metaTitle: "NÜTRL Night School Tour Product Placement Case Study | Collegiate Agency",
    metaDescription:
      "A product-placement case study on NÜTRL as presenting sponsor of the Night School Tour, including 425 total cases, 5M social insights, and $175,000 in estimated paid media value.",
    category: "Product Placement",
    services: ["product-placement", "events", "brand-ambassadors"],
    excerpt:
      "NÜTRL became presenting sponsor of Night School Tour and turned the placement into 350 venue case buys, 75 partner organization cases, and roughly 5M social insights.",
    date: "2026-08-02",
    author: AUTHOR,
    ctaService: "product-placement",
    body: nutrlInsightBody,
    readingTime: estimateReadingTime(nutrlInsightBody),
  },
  {
    slug: "why-welcome-week-is-the-highest-leverage-moment-on-campus",
    title: "Why welcome week is the highest-leverage moment on campus",
    category: "Events",
    services: ["events", "brand-ambassadors"],
    excerpt:
      "The first two weeks of each semester decide the whole year. Why in-person beats ads in that window - and how brands plug into our Night School Tour network.",
    date: "2026-05-20",
    author: AUTHOR,
    ctaService: "events",
    body: welcomeWeekBody,
    readingTime: estimateReadingTime(welcomeWeekBody),
  },
];

const filePosts = loadMdxPosts().map((post) => ({
  ...post,
  readingTime: post.readingTime || estimateReadingTime(post.body),
}));

export const posts: Post[] = [...filePosts, ...legacyPosts];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

/** Posts relevant to a given service, for the "Related insights" section. */
export function postsForService(service: ServiceSlug, limit = 3): Post[] {
  return posts.filter((p) => p.services.includes(service)).slice(0, limit);
}

export type CaseStudy = {
  slug: string;
  brand: string;
  type: "Events" | "Brand Ambassadors" | "Product Placement";
  headline: string;
  /** Big metric-forward stat. */
  stat: string;
  statLabel: string;
  /** Secondary metric callouts. */
  metrics: { value: string; label: string }[];
  /** Optional tiny-print explanation for metric methodology. */
  metricFootnote?: string;
  challenge: string;
  approach: string;
  results: string;
  /** True when the numbers are an illustrative example, not a verified client result. */
  sample?: boolean;
  /** Public sources for the factual program description (industry references). */
  sources?: { label: string; url: string }[];
  /** Optional long-form case-study article rendered on the work detail page. */
  article?: ArticleBlock[];
};

/**
 * INDUSTRY REFERENCE examples - real, well-known brand programs that show each of
 * the three tactics working on campus. These are NOT Collegiate Agency
 * campaigns; they're public industry references. The `sample` flag renders an
 * "Industry example" label, and the headline/metric figures are illustrative
 * (kept modest on purpose) - the program descriptions are factual. Replace with
 * CH's own client-approved case studies as they land.
 */
const sosConsultantsArticle: ArticleBlock[] = [
  {
    type: "p",
    html: "SOS Consultants Nola had the exact problem most local service businesses face around campus: students needed the service, but the brand had to reach them at the right moment, in the right neighborhood, with enough repetition to turn awareness into actual inquiries. For a New Orleans leasing agency, that meant connecting with students when housing decisions were live, social calendars were full, and attention was split between class, events, friends, and feeds. A standard ad campaign could put a flyer in front of students. The stronger play was to make SOS visible both in person and online, using the same creative system across a real campus moment and targeted Meta ads.",
  },
  {
    type: "p",
    html: "The package was intentionally compact: a $2,500 campaign spanning two shows, an on-site activation at the show, and a round of ambassador posts. The posts used dedicated flyer and video creative, and that same creative was then run as localized paid advertising on Meta. That mattered because the campaign did not ask students to process three different messages. They saw the same leasing offer from campus ambassadors, around a live social event, and again in their feeds afterward. The result was a campaign that behaved less like a one-off promotion and more like a coordinated local demand engine.",
  },
  { type: "h2", text: "The strategy: combine trusted student distribution with localized paid media" },
  {
    type: "p",
    html: "Ambassador posts gave SOS a peer-to-peer entry point. Instead of relying only on brand-owned ads, the campaign started with students who could place the message inside real campus social circles. For a leasing agency, that trust layer is important. Students are not just buying a drink or downloading an app; they are deciding where to live, who to call, and which local operators feel legitimate. A flyer or video posted by a student ambassador helps make the brand familiar before the paid ad ever appears.",
  },
  {
    type: "p",
    html: "The live-event component added physical context. Across the two shows, SOS was attached to moments students were already choosing to attend. The activation gave the campaign a real-world presence: not just a logo in a feed, but a local leasing partner showing up where the student audience was already gathered. That kind of environment makes the ad spend more efficient because students have already seen the name in a social setting. When the Meta ad appears later, it is not the first touch; it is the reminder.",
  },
  { type: "h2", text: "Why the same creative ran across ambassadors and Meta" },
  {
    type: "p",
    html: "The most important execution choice was keeping the flyer and video creative consistent. Too many local campaigns split the message: one version for ambassadors, another for events, and a third for ads. SOS avoided that. The dedicated creative from the ambassador round became the same creative used for paid Meta placement, which let the campaign build frequency without confusing the audience. Students could recognize the same offer and the same brand identity whether they saw it from a friend, at the show, or in an Instagram placement.",
  },
  {
    type: "p",
    html: "The paid media layer was localized to campus, which kept the budget focused. For a New Orleans leasing agency, broad reach would have wasted money on people outside the decision zone. The campaign did not need everyone in the city. It needed students near the relevant schools, in the right age and interest environment, who were likely to be thinking about housing or responding to student-life content. Localized targeting turned the ambassador creative into a performance channel instead of treating social posts as a vanity deliverable.",
  },
  { type: "h2", text: "The result: 11x return on ad spend" },
  {
    type: "p",
    html: "From a total package spend of $2,500, SOS Consultants Nola achieved an 11x return on ad spend. The number is the headline, but the mechanism is the lesson: the return came from stacking channels that reinforced each other. The ambassador posts created familiarity. The shows created real-world context. The activation made the brand tangible. The Meta ads repeated the same flyer and video creative to the same local student market. Each piece made the next one work harder.",
  },
  {
    type: "p",
    html: "For local businesses trying to reach college students, this is the model we want to repeat. You do not need a massive national budget to create real movement on campus. You need the right audience, a student-trusted distribution layer, a reason for the brand to appear in the real world, and paid media targeted tightly enough that every dollar stays close to the students who can act. SOS Consultants Nola proved that a lean, coordinated campus package can produce performance-level returns when ambassadors, events, and ads are treated as one system.",
  },
  {
    type: "p",
    html: 'If your brand needs local student demand - whether that means leasing inquiries, product trial, app downloads, retail visits, or event attendance - the takeaway is simple: do not separate campus ambassadors from paid media. Use ambassadors to create trust, use events to create context, and use localized Meta ads to turn the same creative into measurable conversion. <a href="/contact">Tell us the campus and the goal</a>, and we can build the same kind of integrated package around your market.',
  },
];


const nutrlNightSchoolArticle: ArticleBlock[] = [
  {
    type: "p",
    html: "NÜTRL came into the Night School Tour with a clear product-placement opportunity: do more than place a logo on a flyer. The brand had a chance to become part of the actual college-event economy - the venues stocking the product, the local organizations helping host the nights, the ambassadors pushing the story, and the students seeing the same name repeatedly across the tour. That is the difference between sponsorship as signage and sponsorship as distribution.",
  },
  {
    type: "p",
    html: "The tour gave NÜTRL a high-intent environment. Night School is built around live college markets, nightlife venues, student organizations, and ambassador promotion, which meant the brand could show up where students were already making weekend plans. As presenting sponsor, NÜTRL did not need to interrupt the audience. It could attach itself to the night students were already choosing, then extend that presence through venues, partner organizations, social content, and ambassador posts.",
  },
  { type: "h2", text: "The strategy: turn sponsorship into local product movement" },
  {
    type: "p",
    html: "The strongest part of the campaign was that it connected brand visibility to actual case movement. Across the tour, venues purchased 350 cases connected to the sponsorship. Another 75 cases went to local organizations that partnered on the tour, putting NÜTRL directly into the hands of the groups helping create the event energy. That combination mattered. Venue buys gave the product a retail-style presence inside the nightlife environment; organization cases put the product closer to the student leaders and social circles driving turnout.",
  },
  {
    type: "p",
    html: "This is exactly what product placement should do in college marketing. The product cannot just appear in a recap photo after the fact. It has to be present in the room, attached to the hosts, seen by the crowd, and reinforced by the students who have real distribution power on campus. Night School gave NÜTRL that structure: a live event series with existing attention, local partners with social credibility, and ambassadors capable of pushing the same message before and after each stop.",
  },
  { type: "h2", text: "Why presenting sponsor status mattered" },
  {
    type: "p",
    html: "Presenting sponsor status gave NÜTRL ownership of the tour narrative. Instead of being one of many brands around the edges, the brand sat at the center of the Night School experience. That positioning created a cleaner story for venues, student partners, and ambassadors to repeat: NÜTRL was not simply sampling at a party; NÜTRL was powering the tour. For a beverage brand, that distinction matters because students remember who made the night feel bigger.",
  },
  {
    type: "p",
    html: "The social layer extended that ownership beyond the room. Across tour socials and ambassador posts, the campaign received roughly 5 million social insights. That reach was not isolated from the event footprint; it was built from the same ecosystem. Students saw the brand in content about the shows, through ambassador posts, through partner organizations, and through the venues where the product was actually being moved. The result was a campaign where the online attention and offline product movement supported each other instead of living in separate reports.",
  },
  { type: "h2", text: "The result: product placement with measurable media value" },
  {
    type: "p",
    html: "The campaign produced 425 total cases across venue purchases and local organization partner cases. It also generated about 5 million social insights across owned tour channels, ambassador posts, and partner promotion. Based on that visibility, the campaign created an estimated $175,000 in paid media value, while the presenting sponsorship cost was $50,000. That means NÜTRL received media value well above the sponsorship fee before even counting the on-premise product movement, venue relationships, or student organization distribution.",
  },
  {
    type: "p",
    html: "For brands evaluating college sponsorships, this is the key lesson: the best event partnerships are not only awareness plays. They are distribution systems. A tour like Night School can create demand with students, give venues a reason to buy, give organizations a reason to participate, and give ambassadors a real story to post. NÜTRL’s placement worked because the product was tied to every layer of the campaign: the show, the social content, the venue relationship, and the campus partner network.",
  },
  {
    type: "p",
    html: 'If your brand wants college product placement that reaches beyond a logo, the model is clear: own the event moment, put product into the partner network, and let campus ambassadors turn that placement into social proof. <a href="/contact">Tell us the markets you want</a>, and we can build the right Night School or campus-event package around your launch.',
  },
];

export const caseStudies: CaseStudy[] = [
  {
    slug: "sos-consultants-nola-campus-leasing-ambassadors",
    brand: "SOS Consultants Nola",
    type: "Brand Ambassadors",
    headline: "How a New Orleans leasing agency turned campus ambassadors and Meta ads into 11x ROAS",
    stat: "11x",
    statLabel: "return on ad spend",
    metrics: [
      { value: "$2.5K", label: "total package" },
      { value: "2", label: "shows" },
      { value: "1", label: "ambassador post round" },
    ],
    challenge:
      "SOS Consultants Nola needed to reach New Orleans students with a leasing message that felt local, trusted, and timely - not like a generic housing ad competing blindly in the feed.",
    approach:
      "Collegiate Agency packaged two shows, an on-site activation, ambassador flyer/video posts, and localized Meta ads using the same creative so students saw one consistent message across campus, events, and social.",
    results:
      "The integrated campaign turned a $2,500 package into an 11x return on ad spend by combining trusted student distribution, real-world event presence, and campus-local paid media.",
    article: sosConsultantsArticle,
  },
  {
    slug: "celsius-campus-sampling",
    brand: "Celsius",
    type: "Events",
    headline: "Campus sampling that built an energy-drink challenger",
    stat: "45K",
    statLabel: "cans sampled / month",
    sample: true,
    metrics: [
      { value: "120+", label: "campuses" },
      { value: "18%", label: "opt-in rate" },
      { value: "32%", label: "trial-to-repeat" },
    ],
    challenge:
      "Celsius was outspent many times over by the energy-drink giants. It couldn't win on ad budget - so it had to win on the ground, in front of students.",
    approach:
      "Through its CELSIUS University program the brand ran relentless campus sampling - gym takeovers, game-day activations, and dorm drops - putting cold cans in students' hands and converting first trial into habit at nearby retail.",
    results:
      "On-campus sampling turned free trials into repeat buyers and helped power Celsius into the top tier of US energy drinks - a textbook case that experiential activation beats impressions with a student audience.",
    sources: [
      { label: "Celsius Marketing Strategy - Latterly", url: "https://www.latterly.org/celsius-marketing-strategy/" },
      { label: "CELSIUS campus roster - Learfield", url: "https://www.learfield.com/2023/08/celsius-adds-5-new-colleges-to-its-roster-fueling-students-and-athletes-with-essential-energy/" },
    ],
  },
  {
    slug: "nutrl-night-school-tour-product-placement",
    brand: "NÜTRL",
    type: "Product Placement",
    headline: "How NÜTRL turned Night School Tour sponsorship into 425 cases and 5M social insights",
    stat: "425",
    statLabel: "total cases moved",
    metrics: [
      { value: "350", label: "venue case buys" },
      { value: "5M", label: "social insights" },
      { value: "$175K", label: "paid media value" },
    ],
    metricFootnote:
      "Paid media value estimated from ~5M social and ambassador impressions at a $35 CPM. Sponsorship cost: $50,000.",
    challenge:
      "NÜTRL needed a college event platform that could create real product movement, not just logo visibility - with venues, student partners, ambassadors, and social content all reinforcing the same placement.",
    approach:
      "Collegiate Agency positioned NÜTRL as presenting sponsor of the Night School Tour, connecting venue case buys, local organization partner cases, tour content, and ambassador posts into one product-placement campaign.",
    results:
      "The sponsorship drove 350 venue case buys, 75 additional cases through local organization partners, roughly 5M social insights, and an estimated $175,000 in paid media value on a $50,000 sponsorship.",
    article: nutrlNightSchoolArticle,
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}

/** Human-readable date without pulling in a date library. */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${months[m - 1]} ${d}, ${y}`;
}
