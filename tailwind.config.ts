import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        base: "#050A14",
        panel: "#0D1526",
        line: "#1F3048",
        highlight: "#5CD8FF",
        warm: "#F6B768",
        mint: "#6BE6B2",
        text: "#E8F0FF",
        textdim: "#96A7C2"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(92, 216, 255, 0.2), 0 12px 48px rgba(8, 45, 73, 0.35)"
      },
      keyframes: {
        pulseLine: {
          "0%": { transform: "scaleX(0.18)", opacity: "0.45" },
          "100%": { transform: "scaleX(1)", opacity: "1" }
        },
        riseIn: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        pulseLine: "pulseLine 500ms ease-out forwards",
        riseIn: "riseIn 550ms ease-out both"
      }
    }
  },
  plugins: []
};

export default config;
