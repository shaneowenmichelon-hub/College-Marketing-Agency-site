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
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "1.75rem",
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
      },
      animation: {
        marquee: "marquee 30s linear infinite",
        "fade-up": "fade-up 0.6s ease-out both",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(11,11,15,0.04), 0 8px 30px rgba(11,11,15,0.06)",
        "soft-lg": "0 2px 4px rgba(11,11,15,0.05), 0 20px 60px rgba(11,11,15,0.10)",
      },
    },
  },
  plugins: [],
};

export default config;
