import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const cases = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/cases" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    sector: z.string(),
    location: z.string(),
    summary: z.string(),
    initialSituation: z.string(),
    problem: z.string(),
    constraints: z.array(z.string()).optional(),
    intervention: z.string(),
    manualSteps: z.array(z.string()),
    results: z.array(z.string()).optional(),
    quote: z.string().optional(),
    quoteAuthor: z.string().optional(),
    implementationDetails: z.array(z.string()).optional(),
    date: z.coerce.date(),
    draft: z.boolean().default(true),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
  }),
});

export const collections = { cases };
