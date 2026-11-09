import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const slug = z.string().regex(
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  'Use a lowercase, URL-safe slug with words separated by hyphens'
);

// Accepts both "2026-11-09" (quoted) and 2026-11-09 (unquoted, which YAML parses as a
// Date — Astro Editor writes dates that way). Either way the value is a YYYY-MM-DD string.
const isoDate = z.preprocess(
  (value) => (value instanceof Date ? value.toISOString().slice(0, 10) : value),
  z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use an ISO date in YYYY-MM-DD format')
    .refine((value) => {
      const date = new Date(`${value}T00:00:00Z`);
      return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
    }, 'Date must be a real calendar date')
);

const optionalUrl = z.url().optional();

const workPlaces = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/work'
  }),
  schema: z.object({
    name: z.string(),
    slug,
    neighborhood: z.string(),
    // Reflects actual data: cultural-space (not cultural-center), coworking added
    // for the two closed listings, which are business/coworking spaces by nature —
    // their closure is tracked separately via `status`, not by faking the type.
    type: z.enum(['cafe', 'coworking', 'library', 'cultural-space']),
    status: z.enum(['active', 'temporarily_closed', 'closed']),
    last_tested: isoDate,
    tested_by: z.string().optional(),
    wifi: z.object({
      network: z.string().optional().nullable(),
      down: z.number().nonnegative().nullable(),
      up: z.number().nonnegative().nullable(),
      latency_ms: z.number().nonnegative().optional().nullable(),
      isp: z.string().optional().nullable(),
      video_calls: z.enum(['poor', 'fair', 'good', 'excellent']).optional(),
    }).refine(
      ({ down, up }) => (down === null) === (up === null),
      {
        message: 'WiFi download and upload must either both be numbers or both be null',
        path: ['up'],
      }
    ),
    workspace: z.object({
      outlets: z.enum(['none', 'limited', 'some', 'many', 'n/a']),
      ac: z.boolean(),
      noise: z.enum(['quiet', 'moderate', 'loud', 'variable', 'n/a']),
    }),
    best_time: z.object({
      en: z.string().optional(),
      es: z.string().optional(),
    }).optional(),
    // Not in the original spec schema — dropped it silently would have lost real
    // opening-hours data present on ~6 listings. Kept as a plain string.
    hours: z.string().optional(),
    maps_link: optionalUrl,
    address: z.string().optional(),
    images: z.array(z.object({
      file: z.string().min(1),
      caption: z.string().optional(),
      credit: z.string().optional(),
    })).optional(),
    hotspot_warning: z.boolean().optional(),
    hotspot_note: z.object({
      en: z.string().optional(),
      es: z.string().optional(),
    }).optional(),
    // Cold brew review — when present, the spot appears on /work/best-cold-brew-cartagena/.
    cold_brew: z.object({
      drink: z.object({ en: z.string(), es: z.string() }),   // e.g. "Lupin — cold brew with corozo"
      price_cop: z.number().int().positive().optional(),     // price you actually paid
      note: z.object({ en: z.string(), es: z.string() }),     // your honest take, 1–3 sentences
      tried: isoDate,                                         // date you drank it
      rank: z.number().int().positive().optional(),          // your ordering (1 = best); unranked go last
      ruta_2026: z.boolean().optional(),                      // took part in La Ruta del Cold Brew 2026
    }).optional(),
    whatsapp_update_text: z.string().optional(),
    related_listing: z.string().optional(),
    casa_gaviota_note: z.string().optional(),
  }),
});

const venues = defineCollection({
  loader: glob({
    pattern: '**/*.yaml',
    base: './src/data/venues'
  }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    neighborhood: z.string(),
    type: z.string(),
    address: z.string().optional(),
    maps_link: z.string().optional(),
    instagram: z.string().optional(),
    // Link to the venue's own calendar/agenda page. Falls back to Instagram if empty.
    events_url: z.string().url().optional(),
    description: z.string(),
    description_es: z.string(),
    also_workplace: z.boolean().optional(),
    workplace_slug: z.string().optional(),
    images: z.array(z.object({
      file: z.string(),
      caption: z.string().optional(),
      credit: z.string().optional(),
    })).optional(),
    source: z.string().optional(),
    active: z.boolean(),
  }),
});

// Collection key matches the folder name (src/content/work) so Astro Editor finds work.schema.json.
export const collections = { work: workPlaces, venues };
