import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.25rem",
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        ink: "var(--ink)",
        surface: "var(--surface)",
        "surface-muted": "var(--surface-muted)",
        accent: {
          DEFAULT: "var(--accent)",
          2: "var(--accent-2)",
        },
        magenta: "var(--magenta)",
        orange: "var(--orange)",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        // Huge, viewport-scaled display sizes (Elevated Brutalism).
        "display-sm": ["clamp(2.25rem, 6vw, 3.5rem)", { lineHeight: "0.95", letterSpacing: "-0.03em" }],
        "display-md": ["clamp(2.75rem, 8vw, 5rem)", { lineHeight: "0.92", letterSpacing: "-0.035em" }],
        "display-lg": ["clamp(3.25rem, 12vw, 8.5rem)", { lineHeight: "0.88", letterSpacing: "-0.04em" }],
      },
      borderRadius: {
        DEFAULT: "3px",
        sm: "2px",
        md: "3px",
        lg: "3px",
        xl: "4px",
        "2xl": "4px",
        "3xl": "6px",
      },
      maxWidth: {
        container: "1280px",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "spin-slow": {
          from: { transform: "rotateY(0deg)" },
          to: { transform: "rotateY(360deg)" },
        },
      },
      animation: {
        marquee: "marquee 30s linear infinite",
        "fade-up": "fade-up 0.6s ease-out both",
        "spin-slow": "spin-slow 8s linear infinite",
      },
      boxShadow: {
        soft: "var(--shadow-stamp-sm)",
        "soft-lg": "var(--shadow-stamp)",
        stamp: "var(--shadow-stamp)",
        "stamp-sm": "var(--shadow-stamp-sm)",
        "stamp-accent": "var(--shadow-stamp-accent)",
      },
    },
  },
  plugins: [],
};

export default config;
