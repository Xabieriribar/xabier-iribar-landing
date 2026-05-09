/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        ink: "#171414",
        coal: "#2a2525",
        paper: "#f8f5ef",
        bone: "#fffaf2",
        line: "#e4ddd2",
        mist: "#f0ebe2",
        swiss: {
          red: "#b21f2d",
          burgundy: "#5f101b",
          deep: "#3b0b12",
          soft: "#f5d8dc",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      boxShadow: {
        subtle: "0 18px 60px rgba(23, 20, 20, 0.08)",
        red: "0 18px 50px rgba(95, 16, 27, 0.18)",
      },
      backgroundImage: {
        topo: "url(\"data:image/svg+xml,%3Csvg width='520' height='520' viewBox='0 0 520 520' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23b21f2d' stroke-opacity='.13' stroke-width='1'%3E%3Cpath d='M46 110c34-44 98-55 150-28 39 21 76 17 115-6 56-34 130-18 166 36 27 41 20 100-15 136-43 43-92 32-139 15-43-16-81-8-112 27-39 44-105 60-154 24-45-33-55-95-28-144 12-22 7-42 17-60Z'/%3E%3Cpath d='M92 136c28-30 74-35 110-16 45 25 86 18 126-8 38-25 88-14 113 24 20 30 14 74-13 100-34 33-75 23-113 9-52-19-96-6-132 36-30 34-83 44-120 17-32-24-39-70-18-106 12-21 17-40 47-56Z'/%3E%3Cpath d='M138 164c24-18 54-18 82-4 41 21 80 14 116-10 24-16 57-8 72 16 13 21 7 51-13 68-27 23-58 15-89 4-58-21-111-2-146 42-19 24-56 28-81 10-21-16-25-47-10-70 13-21 33-39 69-56Z'/%3E%3Cpath d='M184 190c19-9 38-7 58 4 34 18 69 11 99-9 11-8 27-4 35 8 8 14 3 32-10 42-18 13-41 10-64 2-58-19-103 2-130 40-9 13-30 16-44 6-12-9-13-28-3-41 13-17 30-37 59-52Z'/%3E%3Cpath d='M230 215c24 12 50 10 76-6 10-6 21 5 15 15-10 17-30 20-52 12-31-12-58-1-78 23-6 7-18 1-14-8 8-18 26-49 53-36Z'/%3E%3C/g%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
