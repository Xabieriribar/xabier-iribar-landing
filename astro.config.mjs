import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://xabieriribar.ch",
  devToolbar: {
    enabled: false,
  },
  integrations: [
    sitemap({
      filter: (page) => !page.endsWith("/merci/"),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
