import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const dist = path.join(root, "dist");
const requiredRoutes = [
  "/",
  "/offres/",
  "/audit/",
  "/methode/",
  "/a-propos/",
  "/contact/",
  "/mentions-legales/",
  "/confidentialite/",
  "/merci/",
];

const routeFile = (route) =>
  route === "/"
    ? path.join(dist, "index.html")
    : path.join(dist, route.slice(1), "index.html");

const walk = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(fullPath)));
    else files.push(fullPath);
  }
  return files;
};

test("toutes les routes principales sont construites", () => {
  for (const route of requiredRoutes) {
    assert.ok(existsSync(routeFile(route)), `route absente : ${route}`);
  }
});

test("le brouillon fictif n’est pas produit", () => {
  assert.equal(
    existsSync(path.join(dist, "cas", "exemple-fictif", "index.html")),
    false,
  );
});

test("le sitemap exclut merci et les brouillons", async () => {
  const sitemap = await readFile(path.join(dist, "sitemap-0.xml"), "utf8");
  assert.doesNotMatch(sitemap, /\/merci\/?</);
  assert.doesNotMatch(sitemap, /exemple-fictif/);
  assert.match(sitemap, /\/audit\//);
});

test("les liens internes des pages HTML pointent vers des sorties existantes", async () => {
  const htmlFiles = (await walk(dist)).filter((file) => file.endsWith(".html"));
  for (const file of htmlFiles) {
    const html = await readFile(file, "utf8");
    const hrefs = [...html.matchAll(/href="(\/[^"#?]*)/g)].map(
      (match) => match[1],
    );
    for (const href of hrefs) {
      if (href.includes(".")) {
        assert.ok(
          existsSync(path.join(dist, href.slice(1))),
          `${href} référencé dans ${file}`,
        );
      } else {
        assert.ok(
          existsSync(routeFile(href.endsWith("/") ? href : `${href}/`)),
          `${href} référencé dans ${file}`,
        );
      }
    }
  }
});

test("tous les blocs JSON-LD sont du JSON valide", async () => {
  const htmlFiles = (await walk(dist)).filter((file) => file.endsWith(".html"));
  for (const file of htmlFiles) {
    const html = await readFile(file, "utf8");
    const blocks = [
      ...html.matchAll(
        /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
      ),
    ];
    assert.ok(blocks.length >= 2, `données structurées absentes : ${file}`);
    for (const [, source] of blocks)
      assert.doesNotThrow(() => JSON.parse(source));
  }
});

test("les configurations manquantes ont un repli sûr", async () => {
  const contact = await readFile(routeFile("/contact/"), "utf8");
  const audit = await readFile(routeFile("/audit/"), "utf8");
  assert.match(contact, /Formulaire indisponible/);
  assert.match(contact, /PUBLIC_FORM_ENDPOINT/);
  assert.match(audit, /Le calendrier n’est pas encore configuré/);
  assert.match(audit, /PUBLIC_BOOKING_URL/);
});

test("le composant de formulaire garde un POST HTML sans JavaScript", async () => {
  const source = await readFile(
    path.join(root, "src/components/ContactForm.astro"),
    "utf8",
  );
  assert.match(source, /method="POST"/);
  assert.match(source, /action=\{endpoint\}/);
  assert.doesNotMatch(source, /preventDefault/);
});

test("la page merci est noindex et sans analytics", async () => {
  const html = await readFile(routeFile("/merci/"), "utf8");
  assert.match(html, /name="robots" content="noindex, nofollow"/);
  assert.doesNotMatch(html, /plausible\.io/);
});
