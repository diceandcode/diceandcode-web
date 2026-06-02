import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const legal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/legal' }),
  schema: z.object({
    app: z.string(),
    type: z.enum(['privacy', 'terms']),
    lang: z.enum(['en', 'es', 'ca']),
    title: z.string(),
    lastUpdated: z.coerce.date(),
  }),
});

export const collections = { legal };
