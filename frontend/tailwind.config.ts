import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/providers/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ["class", ".dark"],
  theme: {
    extend: {
      screens: {
        "w1900": "1900px",
        "w1800": "1800px",
        "w1700": "1700px",
        "w1600": "1600px",
        "w1500": "1500px",
        "w1400": "1400px",
        "w1300": "1300px",
        "w900": "900px",
        "w1200": "1200px",
        "w1100": "1100px",
        "w1020": "1020px",
        "xs": "500px",
      },
    },
  },
  plugins: [
    nextui(),
    // ... other plugins
  ],
};
export default config;
