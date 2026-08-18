import type { Config } from "tailwindcss";

/* ============================================================
   AZAN LACE — DESIGN TOKENS
   ------------------------------------------------------------
   This is the ONE place to change the site's color palette.
   The theme was chosen to evoke lace/embroidery: ivory fabric,
   a deep wine/maroon accent (common in South Asian textiles),
   and a soft gold "thread" accent for highlights and prices.

   Every color below has a "DEFAULT", "dark" (for dark mode)
   variant where relevant. Change the hex values here and the
   whole site updates — nothing is hard-coded elsewhere.
   ============================================================ */

const config: Config = {
  darkMode: "class", // toggled by ThemeToggle.tsx via a "dark" class on <html>
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Background surfaces
        ivory: "#FAF6F0", // <-- light mode page background (raw lace fabric tone)
        surface: "#FFFFFF", // <-- light mode card/surface background
        charcoal: "#231F1C", // <-- dark mode page background (warm near-black, not pure black)
        "charcoal-surface": "#2E2822", // <-- dark mode card/surface background

        // Brand accents
        wine: {
          DEFAULT: "#6B1E2B", // <-- primary brand accent (buttons, links, logo)
          light: "#8C3243",
          dark: "#4A1420",
        },
        gold: {
          DEFAULT: "#B8894A", // <-- secondary accent (prices, stars, thread motif)
          light: "#D4AC78",
          dark: "#8F6835",
        },

        // Text
        ink: "#2A2420", // <-- light mode body text
        "ink-muted": "#6B6259",
        cream: "#F5EFE6", // <-- dark mode body text
        "cream-muted": "#B8AEA1",
      },
      fontFamily: {
        // Display face: used sparingly for the logo, hero headline, section titles
        display: ["var(--font-display)", "Georgia", "serif"],
        // Body face: everything else (product info, buttons, nav)
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        // Urdu face: used automatically when the site is switched to Urdu mode
        urdu: ["var(--font-urdu)", "serif"],
      },
      keyframes: {
        "lace-weave": {
          "0%": { strokeDashoffset: "300" },
          "100%": { strokeDashoffset: "0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "lace-weave": "lace-weave 1.4s ease-in-out infinite",
        "fade-up": "fade-up 0.2s ease-out forwards",
        shimmer: "shimmer 2.2s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
