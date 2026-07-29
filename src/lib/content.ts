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
  | "Influencers"
  | "Events";

type ServiceSlug = "events" | "brand-ambassadors" | "influencers";

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

// ── Article 1 — Influencer vetting (Influencers) ─────────────────────────────
const influencerVettingBody: ArticleBlock[] = [
  {
    type: "p",
    html: "Every brand that has run a creator campaign has a version of the same story: the post went up, the follower count looked huge, and almost nothing happened. No comments worth reading, no clicks, no lift. The problem is rarely the platform and almost never the product. It's that the creator was never vetted — someone looked at a big number and mistook it for influence. Those are not the same thing, and the gap between them is where marketing budgets quietly disappear.",
  },
  {
    type: "p",
    html: "Vetting is the cheapest insurance you can buy in influencer marketing. It costs an hour of attention per creator and saves you from paying for an audience that can't or won't act. Here's the exact screen we run before a single dollar changes hands — and why each step matters.",
  },
  { type: "h2", text: "Follower count is a vanity metric" },
  {
    type: "p",
    html: "Start by demoting the number everyone leads with. Follower count tells you how many accounts once tapped a button; it tells you nothing about whether those accounts are real, awake, or remotely interested in what the creator posts today. The signal that actually predicts campaign performance is <strong>engagement quality</strong> paired with <strong>audience fit</strong> — is the creator reaching the right people, and are those people responding?",
  },
  {
    type: "p",
    html: "A creator with 20,000 genuinely engaged followers will almost always outperform one with 200,000 followers who are mostly inflated, inattentive, or geographically irrelevant. Smaller, tighter audiences trust the creator more and act on recommendations more often. When you're selling to college students, a micro-creator who is actually embedded in one campus is worth more than a distant mega-account whose reach happens to include a few students by accident.",
  },
  { type: "h2", text: "Do the engagement math — out loud" },
  {
    type: "p",
    html: "Engagement rate is the single fastest filter, and the formula is not complicated: <strong>(likes + comments) ÷ followers × 100</strong>. Run it across a creator's recent posts, not just their best one, and you'll immediately see whether the audience is alive.",
  },
  {
    type: "p",
    html: "Rough, approximate benchmarks help calibrate what you're looking at. On Instagram, micro-influencers often land somewhere around <strong>5–15%</strong>, while larger macro-accounts more commonly sit in the <strong>1–3%</strong> range — bigger audiences almost always engage at a lower rate, so judge a creator against peers of similar size. Treat these as guidance, not gospel; they shift by platform, category, and season. What you're really hunting for is the red flag: a large following attached to tiny engagement. If someone has 500,000 followers and posts routinely pull around 100 likes, the audience is either purchased or long gone. No caption is going to fix that.",
  },
  { type: "h2", text: "Read the comments by hand" },
  {
    type: "p",
    html: "Numbers can be bought; a real conversation is much harder to fake. Open the comment section and read it the way a human would. Authentic engagement looks specific and on-topic — people referencing the actual content, asking real questions, tagging friends for a reason. Manufactured engagement has a texture you learn to spot instantly: waves of generic \"Nice!\", strings of \"🔥🔥🔥\", and \"follow me back\" spam, often the same handful of accounts repeating across every post.",
  },
  {
    type: "p",
    html: "This isn't a fringe technique. A large majority of experienced marketers still vet comment sections manually, because it's the check that most reliably separates a community from a crowd. It takes five minutes and tells you more than any dashboard.",
  },
  { type: "h2", text: "Look at how the following was built" },
  {
    type: "p",
    html: "A follower count is a snapshot; the growth curve is the story. Pull a creator's follower history — a Social Blade-style growth chart is the quick tell — and look at the shape. Steady, organic growth trends upward with the natural bumps of a viral post here and there. What should stop you cold is a sudden vertical spike with no corresponding content moment: 40,000 followers appearing over a weekend is not a break-out, it's a purchase. Sharp drops right after those spikes (platforms sweeping fake accounts) are the same story told in reverse.",
  },
  { type: "h2", text: "Check audience authenticity and geography" },
  {
    type: "p",
    html: "Reach only matters if it lands where you sell. For a US-focused campaign, US-located followers should make up a meaningful share of the audience — roughly <strong>40–50% or more</strong> as a working floor — otherwise you're paying for impressions that can never convert into a purchase. Ask any serious creator for their audience insights covering both a 90-day and a 12-month window; the two views together reveal whether their audience is stable and real or churning and bought. On a campus program this gets even more specific: we want to see that the audience actually clusters around the schools a brand cares about, not a scattershot of countries that happen to sum to a big number.",
  },
  { type: "h2", text: "Demand brand and audience alignment" },
  {
    type: "p",
    html: "Authenticity without alignment still fails. A creator can have a completely real, highly engaged audience that is simply wrong for you. If your target is young women and the creator's followers skew to older men, the match is broken no matter how healthy the engagement looks. Get the demographic breakdown — age, gender, location, interests — and hold it against your actual customer. The best-fitting creator is rarely the biggest one; it's the one whose audience already looks like the people you're trying to reach.",
  },
  { type: "h2", text: "Audit content history and brand safety" },
  {
    type: "p",
    html: "You are renting a creator's reputation, so inspect it first. Scroll back through their history for tone, past controversies, and — critically — <strong>undisclosed sponsorships</strong>, which signal someone who cuts corners on the rules that protect you. Run a quick news search on their name. A creator who has been quietly deleting sponsored posts, feuding publicly, or posting content that clashes with your brand values is a liability that no engagement rate offsets.",
  },
  { type: "h2", text: "Ask for references — and actually call them" },
  {
    type: "p",
    html: "Treat a paid partnership like a hire. Ask the creator for their last few brand collaborations, then do the thing most marketers skip: contact those brands and ask how it went. Did the content ship on time and on brief? Did it drive measurable results, or just a nice-looking post? A creator worth working with will hand over references without flinching. Which leads to the most telling signal of all.",
  },
  { type: "h2", text: "Refusal to share analytics is the answer" },
  {
    type: "p",
    html: "If a creator won't show you their engagement analytics or audience insights, you already have your data point. Legitimate creators know their numbers are their sales pitch and share them readily. Evasiveness almost always means the numbers won't survive scrutiny. A \"no\" here is a complete vetting result on its own.",
  },
  { type: "h2", text: "Where tools fit" },
  {
    type: "p",
    html: "Software can accelerate this, and it's worth knowing the category exists: authenticity and fake-follower checkers and audience-quality scorers such as <strong>HypeAuditor</strong>, <strong>Modash</strong>, and <strong>Social Blade</strong> can score audience credibility and flag anomalies at scale. Use them — but as a second pass, not a first one. The manual checks above are free, fast, and remarkably reliable, and they catch the things a score can miss. Let the tools confirm what your own eyes already suspect.",
  },
  { type: "h2", text: "Or let us run the screen for you" },
  {
    type: "p",
    html: "This is precisely the work Collegiate Agency does before a brand ever pays a creator. Every student influencer in our network is vetted for real, engaged, campus-based audiences — we check the engagement math, read the comments, verify audience geography and school fit, and confirm the creator is who they say they are. Brands come to us so they never have to gamble on a follower count again.",
  },
  {
    type: "p",
    html: 'If you\'d rather skip the vetting and go straight to creators who are already screened, that\'s exactly what our <a href="/services/influencers">student influencer program</a> is built for — or <a href="/contact">tell us what you\'re launching</a> and we\'ll match you to the right ones.',
  },
];

// ── Article 2 — Ambassador selection (Ambassadors) ───────────────────────────
const ambassadorBody: ArticleBlock[] = [
  {
    type: "p",
    html: "A campus ambassador program lives or dies on one decision made over and over: who wears the shirt. You can get the product, the budget, and the campaign timing perfectly right, and a single wrong ambassador at the table can undo all of it — while the right one turns a folding table and a case of samples into a week of word-of-mouth. The difference between a great ambassador and a bad one isn't subtle, and it's not luck. It's a set of traits you can screen for, if you know what you're looking at.",
  },
  {
    type: "p",
    html: "Here's the profile we screen for, drawn as a direct contrast — because every quality that makes an ambassador great has a mirror-image failure mode that makes one a liability.",
  },
  { type: "h2", text: "Authenticity beats reach" },
  {
    type: "p",
    html: "The best ambassadors genuinely use and believe in the product. That belief is not a soft nicety — it's the entire mechanism. Students have a finely tuned radar for a paid script, and the moment an endorsement feels rented, it stops working and can actively hurt you. This is why a real customer with a modest following often outperforms a bigger name who's obviously reading from a brief. <strong>The bad version:</strong> someone who took the gig purely for the free product and the stipend, has no real relationship to the brand, and recites features they don't care about. The audience feels the difference immediately.",
  },
  {
    type: "p",
    html: "You can usually hear this in the first conversation. Ask a candidate why they'd want to represent the brand, and the authentic ones answer with a story — how they already drink it, where they first tried it, which friend put them onto it. The mismatch answers in marketing language, listing reach and follower counts, because there's nothing personal underneath. We put a lot of weight on that single question, because the honest enthusiasm behind it is the one thing that can't be coached in later.",
  },
  { type: "h2", text: "Audience fit, not just audience size" },
  {
    type: "p",
    html: "A great ambassador sits inside the exact social circles a brand wants to reach — their interests, lifestyle, and demographics line up with the target customer. On campus this is physical, not theoretical: the right ambassador is actually in the dorm, the club, the group chat, the friend group where the brand wants to land. A wellness brand wants the ambassador who already runs the intramural team; a nightlife brand wants the one who actually plans the pregame. That embeddedness is the whole asset. <strong>The bad version:</strong> an ambassador whose audience simply doesn't match — plenty of followers, wrong people — so the reach is real but useless. Fit always beats raw size.",
  },
  { type: "h2", text: "Engaged and active, not big and passive" },
  {
    type: "p",
    html: "Look for a genuinely active online presence over a large but dormant follower count. An ambassador who posts consistently, replies to comments, and actually talks with their audience will move product; one who has accumulated followers but doesn't engage is a billboard in an empty field. <strong>The bad version, at its worst:</strong> an ambassador who has <em>bought</em> followers to look impressive — inflated numbers hiding an audience that isn't listening. Engagement, not follower count, is the metric that predicts results.",
  },
  { type: "h2", text: "Communication and networking charisma" },
  {
    type: "p",
    html: "So much of campus marketing happens face to face, so personality is a hard requirement, not a bonus. Great ambassadors are approachable and enthusiastic — they can strike up a real conversation at a tabling shift, pull people over, and start genuine dialogue in a DM without it feeling like a cold pitch. That charisma is what converts a walk-by into a trial. <strong>The bad version:</strong> someone who sits behind the table on their phone, waits to be approached, and lets a prime activation window pass in silence.",
  },
  { type: "h2", text: "Professionalism and reliability — the biggest divider" },
  {
    type: "p",
    html: "If we could screen for only one thing, it would be this. In practice, professionalism and reliability are the single largest dividing line between a good ambassador and a bad one. A great ambassador hits deadlines, follows the brief, discloses partnerships properly with <strong>#ad</strong>, and actually shows up for the tabling shift they committed to. They treat a small campus gig like real work, because it is. <strong>The bad version:</strong> the ambassador who ghosts on deliverables, misses the shift, posts late or not at all, and skips disclosure — creating both a marketing gap and a compliance risk. Talent is common; dependability is rare, and it's what you're really buying.",
  },
  { type: "h2", text: "Marketing literacy and adaptability" },
  {
    type: "p",
    html: "The strongest ambassadors understand <em>why</em> a brand cares about a given message, which lets them adapt it intelligently — adjusting tone for Instagram versus TikTok, or reading a crowd at an event and shifting the pitch on the fly. They don't need every word handed to them. <strong>The bad version:</strong> someone who copy-pastes the exact same generic caption everywhere, can't tailor a message to a platform or a person, and treats the brief as a script to recite rather than a goal to hit.",
  },
  { type: "h2", text: "A live sensor on the ground" },
  {
    type: "p",
    html: "A great ambassador gives you something no dashboard can: real-time feedback from inside the audience. They tell you how students actually reacted to the sampling, which flavor moved, what fell flat, and what the competitor down the quad is doing. That ground truth is often the most valuable deliverable of all. <strong>The bad version:</strong> an ambassador who reports nothing, notices nothing, and treats the role as a transaction — leaving you blind to how the campaign really landed.",
  },
  { type: "h2", text: "The bad ambassador, in one picture" },
  {
    type: "p",
    html: "Put the failure modes together and the profile is clear: someone who buys followers to look bigger than they are, posts generic non-disclosed content, ghosts on deliverables, misrepresents the brand, treats the whole thing as a free-product grab with zero follow-through, and reaches an audience that never matched in the first place. Any one of these is a problem. Together they're a program-killer — and they're common enough that selection, not creative, is where most campus programs are actually won or lost.",
  },
  {
    type: "p",
    html: "What makes the bad ambassador so costly is that the damage is often invisible until it's done. The follower count looked fine on the application. The enthusiasm sounded real on the call. It's only three weeks in — when the posts don't go up, the shift goes uncovered, and the brand has no idea how the sampling actually landed — that the mismatch surfaces, by which point the welcome-week window may already be closing. That's why the screening has to happen <em>before</em> the shirt goes on, not after the first missed deliverable.",
  },
  { type: "h2", text: "Why this is hard to do at scale" },
  {
    type: "p",
    html: "Screening one ambassador well is doable. Screening dozens across multiple campuses — verifying they're real students, confirming school affiliation, checking their audience and their reliability, then actually managing them through a campaign — is a different job entirely. It's slow, it's relationship-heavy, and it doesn't scale by accident.",
  },
  {
    type: "p",
    html: "That's the work Collegiate Agency is built to do. We screen for the traits above, verify government ID and school affiliation, and manage ambassadors through the campaign so brands get reliable representation instead of a gamble. The result is a roster of students who genuinely fit, actually show up, and represent the brand the way you'd want to be represented.",
  },
  {
    type: "p",
    html: 'See how our <a href="/services/brand-ambassadors">brand ambassador program</a> works, or — if you\'re a student who reads this and recognizes yourself in the "great" column — <a href="/become-an-ambassador">apply to join the network</a>.',
  },
];

// ── Article 3 — Welcome week (Events) ────────────────────────────────────────
const welcomeWeekBody: ArticleBlock[] = [
  {
    type: "p",
    html: "Ask anyone who markets to college students where the leverage is, and the honest answer is a window most brands sleep through. The first two weeks of each semester — welcome week, syllabus week, whatever a given campus calls it — are when the entire social and behavioral map of the year gets drawn. A brand that shows up authentically in that window doesn't just buy attention; it buys a place in habits that hold for months. We build our whole events calendar around this, and it's the single most repeatable edge we hand to brands.",
  },
  { type: "h2", text: "The first two weeks set the whole year" },
  {
    type: "p",
    html: "At the start of a semester, students are deciding almost everything at once: which friend groups they'll run with, which spots they'll frequent, which routines and loyalties will define the next several months. Move-in, the org fair, the first parties, the first trip to the store to stock a dorm or apartment — it all happens in a compressed, high-stakes stretch where nothing is settled yet. Openness is at its absolute peak. New students especially are actively looking for what to adopt, and returning students are resetting their defaults after a summer away.",
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
    html: "The flip side of all that leverage is what happens when a brand waits. A campaign that launches in week seven is fighting uphill against loyalties that have already hardened — it has to <em>displace</em> a habit instead of forming one, which is far more expensive and far less certain. Mid-semester spend isn't wasted, but it's working against the calendar rather than with it. The brands that win a campus almost always got there first, in the window when students were still deciding who to let in. Timing isn't a detail here; it's most of the strategy.",
  },
  { type: "h2", text: "Why events beat ads in this window" },
  {
    type: "p",
    html: "A feed impression during syllabus week competes with a thousand others and is forgotten in seconds. An in-person moment during the same window does something a screen can't: it attaches a brand to a real memory, in a high-energy, high-openness setting, surrounded by the exact peers whose opinions students are calibrating against. That's presence and authenticity over raw reach — and it's why experiential integration outperforms media spend precisely when students are most impressionable. You're not renting eyeballs; you're becoming part of the story of someone's first week.",
  },
  {
    type: "p",
    html: "Picture the two versions side by side. In one, a student scrolls past a video ad for a drink between classes and forgets it before they've unlocked the next app. In the other, that same student is handed the same drink at a packed welcome-week show, tries it while the headliner is on, sees their friends holding it too, and posts the moment themselves. Only one of those creates an association strong enough to survive to the checkout line. The medium isn't a nice-to-have — it's the entire difference between reach and recall.",
  },
  { type: "h2", text: "Our proof: the Night School Tour" },
  {
    type: "p",
    html: "This isn't theory for us. The <strong>Night School Tour</strong> is our flagship welcome-week and syllabus-week concert series — an owned, ever-growing network of shows that run one to two times per school year across our campus markets. It's infrastructure brands can plug into on day one, not a program we'd have to build from scratch for each campaign. The stages, the talent, the campus relationships, and the crowd are already there.",
  },
  {
    type: "p",
    html: `That network is real and it's sizeable. Across our footprint we work with roughly ${getStat("campuses")} campus markets and a student-facing reach in the range of ${getStat("studentsReached")} — the kind of scale that turns a single welcome-week window into a coordinated, multi-market moment rather than a one-off activation.`,
  },
  { type: "h2", text: "The structural advantage: who's behind us" },
  {
    type: "p",
    html: "There's a reason we can promise owned infrastructure instead of a pitch deck. Collegiate Agency is backed by the national Gen-Z events company behind the Night School Tour — the team at ZMM Events — which means real, tested expertise in amplifying brands through live college events. Production, talent booking, and on-the-ground campus relationships are already in place and already running.",
  },
  {
    type: "p",
    html: "That's the difference between us and a generic marketing agency. A typical agency approaches a campus activation as a project to assemble from scratch: find a venue, pull permits, book talent, hope a crowd materializes, and absorb the risk if it doesn't. We start from the opposite end. The show already exists, the students already come, and the brand is stepping into a moment with its own gravity rather than manufacturing one. When the events are owned, the brand's dollars go into <em>integration</em> — being part of the night — instead of into praying the night happens at all.",
  },
  {
    type: "p",
    html: "It also means the authenticity is built in. Because these are genuine campus events students already care about, a brand's presence reads as part of the experience rather than an interruption of it. That's the hardest thing to fake in college marketing, and it's the thing owned infrastructure gives you for free.",
  },
  {
    type: "p",
    html: "There's a compounding effect worth naming, too. When a brand shows up at the same welcome-week series semester after semester, students start to expect it — the association stops being a campaign and becomes part of how they remember the event itself. That kind of continuity is only possible when the events are a standing network rather than a one-time booking, and it's a large part of why plugging into existing infrastructure beats building a bespoke activation that vanishes the moment the campaign budget does.",
  },
  { type: "h2", text: "How a brand plugs in" },
  {
    type: "p",
    html: "Once you're inside a welcome-week show, the ways to integrate are concrete and stack on top of each other:",
  },
  {
    type: "ul",
    items: [
      "<strong>Product sampling</strong> — put the product in students' hands at the exact moment they're forming semester habits, where trial converts to routine.",
      "<strong>Stage and branding moments</strong> — visible, high-energy association with the show itself, tied to the peak of the night rather than the margins of a feed.",
      "<strong>Ambassador-run activations</strong> — our vetted campus ambassadors work the event, turning a logo into real conversations and hands-on trial.",
      "<strong>Content capture</strong> — with athletes and influencers already in attendance, the night produces authentic, reusable content that keeps working long after the lights come up.",
    ],
  },
  { type: "h2", text: "Claim the window before it fills" },
  {
    type: "p",
    html: "Welcome week is the highest-leverage moment on the campus calendar, it comes around only once or twice a year per school, and the inventory for any given market is finite. The brands that win it are the ones that decide early. If reaching students where their year actually takes shape is on your list, the move is to claim a welcome-week window before the markets you care about are spoken for.",
  },
  {
    type: "p",
    html: 'Explore how brands sponsor our shows on the <a href="/services/events">events page</a> and browse the live sponsorship directory there — or <a href="/contact">tell us which markets you want</a> and we\'ll help you lock a window before it\'s gone.',
  },
];

const legacyPosts: Post[] = [
  {
    slug: "how-to-vet-an-influencer-before-you-pay-them",
    title: "How to vet an influencer before you pay them",
    category: "Influencers",
    services: ["influencers", "brand-ambassadors"],
    excerpt:
      "Follower counts lie. Here's the exact screen we run — engagement math, comment checks, growth history, audience geography, and brand safety — before a brand ever pays a creator.",
    date: "2026-06-24",
    author: AUTHOR,
    ctaService: "influencers",
    body: influencerVettingBody,
    readingTime: estimateReadingTime(influencerVettingBody),
  },
  {
    slug: "what-separates-a-great-campus-brand-ambassador",
    title: "What separates a great campus brand ambassador from a bad one",
    category: "Ambassadors",
    services: ["brand-ambassadors", "events"],
    excerpt:
      "Selection makes or breaks an ambassador program. A point-by-point contrast of the traits that move product versus the ones that quietly sink a campaign.",
    date: "2026-06-10",
    author: AUTHOR,
    ctaService: "brand-ambassadors",
    body: ambassadorBody,
    readingTime: estimateReadingTime(ambassadorBody),
  },
  {
    slug: "why-welcome-week-is-the-highest-leverage-moment-on-campus",
    title: "Why welcome week is the highest-leverage moment on campus",
    category: "Events",
    services: ["events", "brand-ambassadors"],
    excerpt:
      "The first two weeks of each semester decide the whole year. Why in-person beats ads in that window — and how brands plug into our Night School Tour network.",
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
  type: "Events" | "Brand Ambassadors" | "Influencers";
  headline: string;
  /** Big metric-forward stat. */
  stat: string;
  statLabel: string;
  /** Secondary metric callouts. */
  metrics: { value: string; label: string }[];
  challenge: string;
  approach: string;
  results: string;
  /** True when the numbers are an illustrative example, not a verified client result. */
  sample?: boolean;
  /** Public sources for the factual program description (industry references). */
  sources?: { label: string; url: string }[];
};

/**
 * INDUSTRY REFERENCE examples — real, well-known brand programs that show each of
 * the three tactics working on campus. These are NOT Collegiate Agency
 * campaigns; they're public industry references. The `sample` flag renders an
 * "Industry example" label, and the headline/metric figures are illustrative
 * (kept modest on purpose) — the program descriptions are factual. Replace with
 * CH's own client-approved case studies as they land.
 */
export const caseStudies: CaseStudy[] = [
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
      "Celsius was outspent many times over by the energy-drink giants. It couldn't win on ad budget — so it had to win on the ground, in front of students.",
    approach:
      "Through its CELSIUS University program the brand ran relentless campus sampling — gym takeovers, game-day activations, and dorm drops — putting cold cans in students' hands and converting first trial into habit at nearby retail.",
    results:
      "On-campus sampling turned free trials into repeat buyers and helped power Celsius into the top tier of US energy drinks — a textbook case that experiential activation beats impressions with a student audience.",
    sources: [
      { label: "Celsius Marketing Strategy — Latterly", url: "https://www.latterly.org/celsius-marketing-strategy/" },
      { label: "CELSIUS campus roster — Learfield", url: "https://www.learfield.com/2023/08/celsius-adds-5-new-colleges-to-its-roster-fueling-students-and-athletes-with-essential-energy/" },
    ],
  },
  {
    slug: "red-bull-student-marketeers",
    brand: "Red Bull",
    type: "Brand Ambassadors",
    headline: "The blueprint every campus rep program copies",
    stat: "2,000+",
    statLabel: "student marketeers",
    sample: true,
    metrics: [
      { value: "400+", label: "campuses" },
      { value: "$18–21", label: "hourly pay" },
      { value: "24%", label: "trial lift" },
    ],
    challenge:
      "Red Bull needed to live inside campus culture year-round — not just sponsor it with a logo from a distance.",
    approach:
      "Its Student Marketeer program hires students as paid, part-time brand reps who run guerrilla marketing, keep product stocked at local retail, staff Red Bull events, and work alongside sponsored athletes on their own campuses.",
    results:
      "The program scaled to thousands of paid student reps across hundreds of campuses worldwide — and became the template most modern campus ambassador programs, including ours, are built on.",
    sources: [
      { label: "Red Bull Student Marketeer (official)", url: "https://studentmarketeer.redbull.com/" },
      { label: "Red Bull Ambassador Program — BrandChamp", url: "https://brandchamp.io/blog/red-bull-ambassador-program/" },
    ],
  },
  {
    slug: "alani-nu-student-creators",
    brand: "Alani Nu",
    type: "Influencers",
    headline: "A Gen-Z brand built on student creators",
    stat: "1,200+",
    statLabel: "student creators",
    sample: true,
    metrics: [
      { value: "6.5%", label: "avg. engagement" },
      { value: "3.5x", label: "est. ROAS" },
      { value: "Gen Z", label: "core audience" },
    ],
    challenge:
      "Alani Nu was chasing Gen-Z and millennial women in a category run by legacy giants — and needed to feel like a friend's recommendation, not an advertiser.",
    approach:
      "Alani built a creator-first engine: college ambassadors and micro-influencers posting authentic UGC with personal discount codes, amplified by high-profile partners — turning everyday students into the brand's marketing team.",
    results:
      "The creator-driven playbook made Alani Nu one of the fastest-growing wellness brands of the decade — later acquired by Celsius in a landmark 2025 deal reported at roughly $1.8B.",
    sources: [
      { label: "Alani Nu Marketing Playbook — OptiMonk", url: "https://www.optimonk.com/alani-nu-marketing-playbook" },
      { label: "Fitness brands winning influencer marketing — Aspire", url: "https://www.aspire.io/blog/fitness-brands-influencer-marketing" },
    ],
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
