import { siteConfig } from "@/site.config";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";

/** Simple placeholder legal page. Replace body with counsel-reviewed copy. */
export function LegalPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Section tone="light">
      <Container className="max-w-3xl px-0">
        <h1 className="font-display text-4xl font-bold text-ink sm:text-5xl">{title}</h1>
        <p className="mt-4 text-sm text-[color:var(--muted-on-light)]">
          Placeholder for {siteConfig.companyName}. Replace with your reviewed{" "}
          {title.toLowerCase()} before launch.
        </p>
        <div className="mt-8 space-y-4 text-base leading-relaxed text-[color:var(--muted-on-light)]">
          {children}
        </div>
      </Container>
    </Section>
  );
}
