import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        accent: {
          DEFAULT: "var(--color-accent)",
          secondary: "var(--color-accent-secondary)",
          glow: "var(--color-accent-glow)",
        },
        surface: {
          DEFAULT: "var(--color-surface)",
          hover: "var(--color-surface-hover)",
          border: "var(--color-surface-border)",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
        heading: ["var(--font-space-grotesk)"], // New heading font
        mono: ["var(--font-jetbrains-mono)"], // New mono font
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      transitionTimingFunction: {
        'premium': 'cubic-bezier(0.25, 1, 0.5, 1)',
      }
    },
  },
  plugins: [],
};
export default config;
