import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const logs = defineCollection({
  loader: glob({ base: "./src/content/logs", pattern: "**/*.md" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    project: z.string(),
    repo: z.string(),
    repoPath: z.string().optional(),
    remote: z.string().optional(),
    branch: z.string().optional(),
    commit: z.string().optional(),
    tags: z.array(z.string()).default([]),
    summary: z.string().default(""),
    draft: z.boolean().default(true),
    attachmentDir: z.string(),
    attachments: z.array(z.string()).default([])
  })
});

export const collections = { logs };
