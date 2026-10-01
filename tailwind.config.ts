import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-newsreader)", "serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        cream: {
          DEFAULT: "var(--cream)",
          light: "var(--cream-light)",
          dark: "var(--cream-dark)",
        },
        sand: {
          DEFAULT: "var(--sand)",
          dark: "var(--sand-dark)",
        },
        charcoal: {
          DEFAULT: "var(--charcoal)",
          light: "var(--charcoal-light)",
          lighter: "var(--charcoal-lighter)",
        },
        stone: {
          DEFAULT: "var(--stone)",
        },
        terracotta: {
          DEFAULT: "var(--terracotta)",
          light: "var(--terracotta-light)",
          dark: "var(--terracotta-dark)",
        }
      },
      boxShadow: {
        'brutal': '2px 2px 0px 0px rgba(28,25,23,0.1)',
        'brutal-lg': '4px 4px 0px 0px rgba(28,25,23,0.1)',
      }
    },
  },
  plugins: [],
};
export default config;
