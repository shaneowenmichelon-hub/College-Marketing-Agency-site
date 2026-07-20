import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Section tone="dark" mesh grain containerClassName="text-center">
      <p className="font-display text-7xl font-bold text-[color:var(--accent-2)] sm:text-8xl">
        404
      </p>
      <h1 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl">
        This page took the semester off.
      </h1>
      <p className="mx-auto mt-3 max-w-md text-[color:var(--muted-on-dark)]">
        The page you&apos;re looking for doesn&apos;t exist or moved. Let&apos;s get you
        back on campus.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button href="/" variant="lime" size="lg">
          Back home
        </Button>
        <Button href="/contact" variant="ghost-dark" size="lg">
          Get Started
        </Button>
      </div>
    </Section>
  );
}
