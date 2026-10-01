import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
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
          DEFAULT: "#F7F5F0",
          light: "#FCFBF9",
          dark: "#EFECE6",
        },
        sand: {
          DEFAULT: "#E2DDD3",
          dark: "#D4CEC3",
        },
        charcoal: {
          DEFAULT: "#1C1917",
          light: "#292524",
          lighter: "#44403C",
        },
        terracotta: {
          DEFAULT: "#D97706",
          light: "#F59E0B",
          dark: "#B45309",
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
