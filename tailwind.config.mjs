/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        ink: "#161616",
        muted: "#344251",
        paper: "#f7f3ee",
        surface: "#fbf9f5",
        line: "#ded7ce",
        accent: "#9f1616",
        navy: "#062c4a",
        "navy-dark": "#041d32",
      },
      fontFamily: {
        display: [
          "Bodoni 72",
          "Didot",
          "Libre Baskerville",
          "Georgia",
          "serif",
        ],
        sans: [
          "Avenir Next",
          "Avenir",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
