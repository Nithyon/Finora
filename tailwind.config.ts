import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#1a1f3a",
        "navy-dark": "#0f1219",
        "navy-light": "#252d45",
        lime: "#84cc16",
        blue: "#6366f1",
        "blue-dark": "#4f46e5",
        red: "#dc2626",
      },
    },
  },
  plugins: [],
};

export default config;
