import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'esa-blue': '#0072B1', // Adjust according to ESAWAS brand colors
        'esa-lightblue': '#00A9E0', // Adjust accordingly
        'esa-darkblue': '#004D73', // Adjust accordingly
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
