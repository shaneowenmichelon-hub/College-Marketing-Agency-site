import Link from "next/link";
import { Compass, Flame, HeartHandshake, Zap } from "lucide-react";
import { siteConfig, team, type TeamMember } from "@/site.config";
import { ABOUT_DESCRIPTION, ABOUT_TITLE_LEAD, pageMetadata } from "@/lib/seo";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { EventImage } from "@/components/EventImage";
import { TeamAvatar } from "@/components/TeamAvatar";
import { CTASection } from "@/components/CTASection";
import { ArticleTable } from "@/components/article/ArticleTable";
import { AboutPageJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata = pageMetadata({
  title: ABOUT_TITLE_LEAD,
  description: ABOUT_DESCRIPTION,
  path: "/about",
});

const values = [
  {
    icon: Flame,
    title: "Culture first",
    body: "We build from what students actually care about, not what a media kit says they should.",
  },
  {
    icon: Zap,
    title: "Bias to action",
    body: "We move at the speed of a semester - plan fast, execute faster, learn in real time.",
  },
  {
    icon: HeartHandshake,
    title: "Real relationships",
    body: "Our network is built on trust with students and schools, and we protect it.",
  },
  {
    icon: Compass,
    title: "Honest measurement",
    body: "We report what actually happened. No vanity metrics, no fabricated proof.",
  },
];

const linkClass = "font-semibold text-accent";

function serviceBlurb(slug: string): string {
  const service = siteConfig.services.find((item) => item.slug === slug);
  if (!service) throw new Error(`Unknown service: ${slug}`);
  return service.blurb;
}

/** Shane's visible role and profile come from articleAuthor, not the team card. */
function memberOnPage(member: TeamMember): TeamMember {
  if (member.name !== siteConfig.articleAuthor.name) return member;
  return {
    name: siteConfig.articleAuthor.name,
    title: siteConfig.articleAuthor.jobTitle,
    photo: member.photo,
    linkedin: siteConfig.articleAuthor.linkedIn,
  };
}

export default function AboutPage() {
  const people = team.map(memberOnPage);
  return (
    <>
      <AboutPageJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ]}
      />

      <Section tone="light">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <SectionHeading
            as="h1"
            eyebrow="About"
            title="A college marketing agency for brands."
            intro={
              <>
                Collegiate Agency is a college and campus marketing agency based in {siteConfig.contact.location}.
                Brands hire it to reach university students through{" "}
                <Link href="/services/brand-ambassadors" className={linkClass}>
                  campus ambassador programs
                </Link>
                ,{" "}
                <Link href="/services/events" className={linkClass}>
                  campus events
                </Link>
                , and{" "}
                <Link href="/services/product-placement" className={linkClass}>
                  product placement
                </Link>
                .
              </>
            }
          />
          <Reveal delay={0.1}>
            <EventImage index={13} aspect="aspect-[5/4]" />
          </Reveal>
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="For brands"
          title="What brands hire Collegiate Agency to run."
        />
        <div className="mt-8 max-w-3xl space-y-4 text-base leading-relaxed text-[color:var(--muted-on-light)]">
          <p>
            <Link href="/services/events" className={linkClass}>
              Events
            </Link>
            : {serviceBlurb("events")}{" "}
            <Link href="/services/brand-ambassadors" className={linkClass}>
              Brand ambassadors
            </Link>
            : {serviceBlurb("brand-ambassadors")}{" "}
            <Link href="/services/product-placement" className={linkClass}>
              Product placement
            </Link>
            : {serviceBlurb("product-placement")}
          </p>
          <p>
            The three channels sit together on the{" "}
            <Link href="/services" className={linkClass}>
              services
            </Link>{" "}
            page. Published rates for ambassadors, product placement, and events are on the{" "}
            <Link href="/pricing" className={linkClass}>
              pricing
            </Link>{" "}
            page. Campaign write-ups are on the{" "}
            <Link href="/work" className={linkClass}>
              work
            </Link>{" "}
            page. A brand that wants a program starts at{" "}
            <Link href="/contact" className={linkClass}>
              contact
            </Link>
            .
          </p>
          <p>
            The homepage publishes the figures below. This page repeats those figures and does not add new ones.
          </p>
        </div>
        <div className="mt-8 max-w-3xl">
          <ArticleTable
            block={{
              type: "table",
              caption: "Figures published on the Collegiate Agency homepage",
              columns: ["Measure", "Published figure"],
              align: ["left", "right"],
              rows: siteConfig.stats.map((stat) => [stat.label, stat.value]),
            }}
          />
        </div>
      </Section>

      <Section tone="light" id="founder">
        <SectionHeading
          eyebrow={siteConfig.articleAuthor.jobTitle}
          title={siteConfig.articleAuthor.name}
          intro={
            <>
              {siteConfig.articleAuthor.jobTitle}, {siteConfig.companyName}. {siteConfig.articleAuthor.name} is{" "}
              {siteConfig.articleAuthor.jobTitle} of {siteConfig.companyName}. The insights on this site are published
              under his name.{" "}
              <a
                href={siteConfig.articleAuthor.linkedIn}
                rel="author noopener"
                target="_blank"
                className="underline decoration-ink/40 underline-offset-2 hover:text-accent"
              >
                {siteConfig.articleAuthor.name} on LinkedIn
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              .
            </>
          }
        />
      </Section>

      <Section tone="muted" id="team">
        <SectionHeading
          eyebrow="Team"
          title="The operators behind the network."
          intro="The people who run Collegiate Agency. Students are the audience of the programs brands hire."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {people.map((member, i) => {
            const card = (
              <div className="flex h-full flex-col items-center rounded-2xl border border-[color:var(--border-on-light)] bg-surface p-6 text-center shadow-soft transition-all group-card-press hover:-translate-y-1 motion-reduce:hover:transform-none group-hover:shadow-soft-lg">
                <TeamAvatar name={member.name} photo={member.photo} className="mx-auto" />
                <h3 className="mt-4 font-display text-base font-bold text-ink">{member.name}</h3>
                {member.title && (
                  <p className="mt-1 text-xs leading-relaxed text-[color:var(--muted-on-light)]">{member.title}</p>
                )}
              </div>
            );
            return (
              <Reveal key={member.name} delay={i * 0.06} className="h-full">
                {member.linkedin ? (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel={
                      member.name === siteConfig.articleAuthor.name
                        ? "author noopener"
                        : "noopener noreferrer"
                    }
                    className="group block h-full"
                  >
                    {card}
                  </a>
                ) : (
                  <div className="group h-full">{card}</div>
                )}
              </Reveal>
            );
          })}
        </div>
      </Section>

      <Section tone="dark" grain>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <SectionHeading onDark eyebrow="Our story" title="Campus programs, built for brands." />
          <Reveal delay={0.1} className="space-y-4 text-[color:var(--muted-on-dark)]">
            {siteConfig.showCredibility && <p className="text-lg text-white">{siteConfig.credibilityLine}</p>}
            <p>
              Collegiate Agency brings that events background to brands that need a campus program: ambassadors on
              campus, events students already attend, and product placed with student organizations.
            </p>
            <p>
              The operators named above run the work. The ambassador roster is the network a brand hires the agency to
              field.
            </p>
          </Reveal>
        </div>
      </Section>

      <Section tone="light">
        <SectionHeading eyebrow="What we value" title="How we work." />
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.06}>
              <div className="flex gap-4 rounded-2xl border border-[color:var(--border-on-light)] bg-surface p-6 shadow-soft">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <v.icon className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold text-ink">{v.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[color:var(--muted-on-light)]">{v.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <CTASection
        title="Plan a campus program."
        intro="Brands book a call to scope ambassadors, events, or product placement. Students apply separately to join the ambassador roster."
        primary={{ label: "Book a call", href: "/contact", variant: "lime" }}
        secondary={{ label: "Become an Ambassador", href: "/become-an-ambassador" }}
      />
    </>
  );
}
