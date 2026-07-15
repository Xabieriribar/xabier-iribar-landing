import { copyFile } from "node:fs/promises";
import { resolve } from "node:path";

const outputDirectory = resolve("dist");

await copyFile(
  resolve(outputDirectory, "sitemap-0.xml"),
  resolve(outputDirectory, "sitemap.xml"),
);

console.log("Alias sitemap.xml créé.");
