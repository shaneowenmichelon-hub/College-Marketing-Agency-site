"use client";

import { useEffect, useRef, useState, type ComponentType, type RefObject } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { siteConfig, clients } from "@/site.config";
import { INQUIRY_BRIEF_LINE } from "@/lib/inquiry-handoff";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ClientMarquee } from "@/components/ClientMarquee";
import { HeroCollage } from "@/components/home/HeroCollage";

/**
 * Fallback coin (reduced motion / pre-hydration): the tappable CS-3D CA coin,
 * cursor-tilt on desktop, one flip + micro-message + haptic on tap.
 */
function Coin({ reduce }: { reduce: boolean }) {
  const [rot, setRot] = useState({ x: -12, y: 18 });
  const [flipping, setFlipping] = useState(false);
  const [msg, setMsg] = useState(false);

  function spin() {
    setMsg(true);
    window.setTimeout(() => setMsg(false), 1700);
    if (typeof navigator !== "undefined" && "vibrate" in navigator && !reduce) {
      try {
        navigator.vibrate([8, 18, 8]);
      } catch {
        /* haptics unsupported */
      }
    }
    if (reduce || flipping) return;
    setFlipping(true);
    window.setTimeout(() => setFlipping(false), 820);
  }

  return (
    <div className="relative flex aspect-square w-full max-w-[210px] items-center justify-center justify-self-center sm:max-w-xs lg:max-w-sm">
      <div
        role="button"
        tabIndex={0}
        aria-label="CA, spin the campus coin"
        onClick={spin}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            spin();
          }
        }}
        className="relative rounded-full outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--accent-2)]/60"
        style={{ perspective: "900px" }}
        onMouseMove={
          reduce || flipping
            ? undefined
            : (e) => {
                const r = e.currentTarget.getBoundingClientRect();
                const px = (e.clientX - r.left) / r.width - 0.5;
                const py = (e.clientY - r.top) / r.height - 0.5;
                setRot({ x: -py * 40, y: px * 60 });
              }
        }
        onMouseLeave={() => !reduce && setRot({ x: -12, y: 18 })}
      >
        <div
          className={`${flipping ? "coin-flip" : "coin-idle"} relative h-40 w-40 rounded-full sm:h-56 sm:w-56 lg:h-64 lg:w-64 ${
            reduce ? "" : "will-change-transform"
          }`}
          style={{
            transform: flipping ? undefined : `rotateX(${rot.x}deg) rotateY(${rot.y}deg)`,
            transformStyle: "preserve-3d",
            transition: "transform 0.2s ease-out",
          }}
        >
          <div
            className="absolute inset-0 flex items-center justify-center rounded-full border-4 border-ink bg-[color:var(--accent-2)]"
            style={{ transform: "translateZ(22px)", boxShadow: "0 0 0 4px var(--ink)" }}
          >
            <span className="font-display text-5xl font-bold text-ink lg:text-6xl">CA</span>
          </div>
          <div
            className="absolute inset-0 flex items-center justify-center rounded-full border-4 border-ink bg-[color:var(--magenta)]"
            style={{ transform: "translateZ(-22px) rotateY(180deg)" }}
          >
            <Sparkles className="h-14 w-14 text-white lg:h-16 lg:w-16" aria-hidden />
          </div>
          <div className="absolute inset-0 rounded-full border-[10px] border-ink/80" style={{ transform: "translateZ(0px)" }} />
        </div>
      </div>
      <span
        aria-live="polite"
        className={`pointer-events-none absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-[3px] border-2 border-ink bg-[color:var(--accent-2)] px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wide text-ink shadow-[3px_3px_0_var(--ink)] transition-opacity duration-200 ${
          msg ? "opacity-100" : "opacity-0"
        }`}
      >
        Campus culture, on the ground.
      </span>
    </div>
  );
}

/** Stats shown above the fold: scale, coverage, reach — what a brand buys. */
// Speed sits last on purpose: it is the differentiator a brand buyer compares
// agencies on, and it reads as a promise rather than a vanity figure.
const HERO_STAT_KEYS = ["ambassadors", "campuses", "socialReach", "speedToActivation"] as const;

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduce;
}

export function Hero({ heroPhotos }: { heroPhotos?: { src: string; alt: string }[] }) {
  const reduce = usePrefersReducedMotion();
  // The pinned coin-reel is a DESKTOP-only interaction. On mobile/tablet it would
  // cram the reel + photo collage + logos into one pinned screen, so there we
  // fall back to a normal stacked hero (tappable coin, then photos, then logos).
  const [active, setActive] = useState(false);
  /**
   * Height of the sticky header. The hero pins below it, so the screen it
   * actually gets is 100svh MINUS this. Sizing it to a full 100svh pushed the
   * bottom of the hero — the brand logo strip — off the screen by exactly the
   * header's height, and a sticky box taller than its slot can never reveal
   * its own bottom. Measured rather than hardcoded: the header restyles on
   * scroll and differs across breakpoints.
   */
  const [headerH, setHeaderH] = useState(0);

  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;
    const measure = () => setHeaderH(header.getBoundingClientRect().height);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(header);
    return () => ro.disconnect();
  }, []);
  useEffect(() => {
    if (reduce) {
      setActive(false);
      return;
    }
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setActive(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [reduce]);

  const wrapRef = useRef<HTMLDivElement>(null);
  // Desktop-only reel. Loaded after mount so mobile LCP does not pay for framer-motion.
  const [Reel, setReel] = useState<ComponentType<{
    target: RefObject<HTMLDivElement | null>;
  }> | null>(null);
  useEffect(() => {
    if (!active) return;
    let cancel = false;
    void import("./HeroReel").then((mod) => {
      if (!cancel) setReel(() => mod.HeroReel);
    });
    return () => {
      cancel = true;
    };
  }, [active]);

  return (
    <div ref={wrapRef} className="relative">
      <section
        className={`grain relative overflow-hidden border-b-2 border-ink bg-ink text-white ${
          active ? "flex flex-col justify-between" : ""
        }`}
        // Still exactly the screen below the header, so the brand logo strip
        // lands at the bottom of the first view — it just scrolls away with
        // everything else now instead of being held in place.
        style={active ? { height: `calc(100svh - ${headerH}px)` } : undefined}
      >
        <div aria-hidden className="mesh pointer-events-none absolute inset-0" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(var(--surface) 1px, transparent 1px), linear-gradient(90deg, var(--surface) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <Container className={`relative ${active ? "flex min-h-0 flex-1 items-center" : ""}`}>
          <div className={`grid w-full items-center gap-6 lg:grid-cols-[1.3fr_1fr] ${active ? "py-4" : "py-20 sm:py-28 lg:py-36"}`}>
            {/*
              Plain markup, not motion.*. This headline is the mobile LCP element.
              Framer Motion initial="hidden" server-renders opacity:0, so the text
              stayed invisible until hydration. Supporting lines use a transform-only
              rise (.hero-rise) that never sets opacity, and the H1 is not animated.
            */}
            <div className="flex flex-col items-start">
              {siteConfig.showCredibility && (
                <div className="hero-rise">
                  <span className="sticker mono-label bg-[color:var(--accent-2)] px-3 py-1.5 text-[11px] font-bold text-ink">
                    <Sparkles className="h-3.5 w-3.5" />
                    {siteConfig.credibilityLine}
                  </span>
                </div>
              )}

              <h1
                className={`max-w-4xl text-balance font-display font-bold leading-[0.95] ${
                  active
                    ? "mt-4 text-[clamp(2.25rem,min(8.5svh,5.2vw),5rem)] leading-[0.92] tracking-[-0.035em]"
                    : "mt-6 text-display-lg"
                }`}
              >
                Where brands meet{" "}
                <span className="text-[color:var(--accent-2)]">campus culture.</span>
              </h1>

              <p
                className={`hero-rise max-w-2xl leading-relaxed text-[color:var(--muted-on-dark)] ${
                  active ? "mt-4 text-lg" : "mt-6 text-lg sm:text-xl"
                }`}
                style={{ animationDelay: "80ms" }}
              >
                We put your brand in front of college students through events, brand
                ambassadors, and product placement. We reach them on the campuses where
                they live, study, and go out.
              </p>

              {/*
                Two brand CTAs at full weight, the student one as a text link.
                Three equal buttons to three destinations made the first screen a
                choice rather than an action, and gave the supply side the same
                billing as the revenue side. Students still have the header, the
                footer, the mobile drawer and a whole section further down, so
                the path is demoted here, not removed.
              */}
              <div className={`hero-rise flex w-full flex-col gap-3 sm:max-w-md sm:flex-row ${active ? "mt-6" : "mt-9"}`} style={{ animationDelay: "140ms" }}>
                <Button href="/contact" variant="lime" size="lg">
                  Book a Call
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button href="/build-a-campaign" variant="magenta" size="lg">
                  Build a Campaign
                </Button>
              </div>
              <p
                className={`hero-rise max-w-xl text-sm leading-relaxed text-[color:var(--muted-on-dark)] ${
                  active ? "mt-3" : "mt-4"
                }`}
                style={{ animationDelay: "170ms" }}
              >
                {INQUIRY_BRIEF_LINE}
              </p>

              {/*
                Scale, on the first screen. These are the numbers a brand
                marketer is actually deciding on, and they used to sit four
                sections down. One compact line, so it costs almost no height on
                a phone.
              */}
              <ul
                className={`hero-rise flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[color:var(--muted-on-dark)] ${
                  active ? "mt-4" : "mt-6"
                }`}
                style={{ animationDelay: "200ms" }}
              >
                {HERO_STAT_KEYS.map((key) => {
                  const stat = siteConfig.stats.find((s) => s.key === key);
                  if (!stat) return null;
                  return (
                    <li key={key} className="flex items-baseline gap-1.5">
                      <span className="font-display text-base font-bold text-[color:var(--accent-2)]">
                        {stat.value}
                      </span>
                      {stat.shortLabel ?? stat.label}
                    </li>
                  );
                })}
              </ul>

              <div className={active ? "hero-rise mt-3" : "hero-rise mt-5"} style={{ animationDelay: "240ms" }}>
                <Link
                  href="/become-an-ambassador"
                  className="text-sm font-semibold text-[color:var(--muted-on-dark)] underline decoration-2 underline-offset-4 transition-colors hover:text-[color:var(--accent-2)]"
                >
                  Student? Become an ambassador
                </Link>
              </div>
            </div>

            {active && Reel ? <Reel target={wrapRef} /> : <Coin reduce={reduce} />}
          </div>
        </Container>

        {/* Scrolling event collage + brand logos (before you scroll).
            Swap sitePhotos in site.config for real event photos. */}
        <div className={`relative shrink-0 ${active ? "mt-4" : "mt-8 sm:mt-10"}`}>
          <Container>
            <HeroCollage photos={heroPhotos} compact={active} />
          </Container>
          <div className={`border-t-2 border-white/10 ${active ? "mt-3 pt-3" : "mt-6 pt-5"}`}>
            <Container>
              <p className={`text-center text-[11px] ${active ? "mb-2" : "mb-3"} font-medium uppercase tracking-widest text-[color:var(--muted-on-dark)]`}>
                Brands we&apos;ve worked with
              </p>
            </Container>
            <ClientMarquee clients={clients} onDark />
          </div>
        </div>
      </section>
    </div>
  );
}
