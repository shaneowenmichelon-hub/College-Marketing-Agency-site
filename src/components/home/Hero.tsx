"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { siteConfig } from "@/site.config";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function Hero() {
  const reduce = useReducedMotion();

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : 0.1, delayChildren: 0.05 },
    },
  };
  const item = {
    hidden: { opacity: 0, y: reduce ? 0 : 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
  };

  return (
    <section className="grain relative overflow-hidden bg-ink text-white">
      {/* Animated mesh */}
      <motion.div
        aria-hidden
        className="mesh pointer-events-none absolute inset-0"
        animate={reduce ? undefined : { scale: [1, 1.08, 1], opacity: [0.9, 1, 0.9] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <Container className="relative">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-start py-24 sm:py-32 lg:py-40"
        >
          {siteConfig.showCredibility && (
            <motion.div variants={item}>
              <Badge variant="outline-dark" className="mb-6">
                <Sparkles className="h-3.5 w-3.5 text-[color:var(--accent-2)]" />
                {siteConfig.credibilityLine}
              </Badge>
            </motion.div>
          )}

          <motion.h1
            variants={item}
            className="max-w-4xl text-balance font-display text-5xl font-bold leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl"
          >
            Where brands meet{" "}
            <span className="text-[color:var(--accent-2)]">campus culture.</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-2xl text-lg leading-relaxed text-[color:var(--muted-on-dark)] sm:text-xl"
          >
            We put your brand in front of college students through events, brand
            ambassadors, and influencers — on the campuses where they live, study,
            and go out.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Button href="/contact" variant="lime" size="lg">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="/become-an-ambassador" variant="ghost-dark" size="lg">
              Become an Ambassador
            </Button>
          </motion.div>

          <motion.p
            variants={item}
            className="mt-8 text-sm text-[color:var(--muted-on-dark)]"
          >
            Events · Brand Ambassadors · Influencers — across {siteConfig.campuses.length}+ markets.
          </motion.p>
        </motion.div>
      </Container>
    </section>
  );
}
