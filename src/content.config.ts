import { defineCollection, z } from "astro:content";

const logs = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    project: z.string(),
    repo: z.string(),
    repoPath: z.string(),
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
