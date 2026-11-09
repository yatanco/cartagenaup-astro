import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const slug = z.string().regex(
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  'Use a lowercase, URL-safe slug with words separated by hyphens'
);

// Dates: Astro Editor shows a date picker for z.date() and saves it unquoted (2026-11-09),
// which YAML reads as a Date. Quoted strings ("2026-11-09") are accepted too.
// Either way the parsed value is a "YYYY-MM-DD" string, so page code is unchanged.
const isoDate = z.preprocess(
  (value) => {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    const date = new Date(`${value}T00:00:00Z`);
    // Reject impossible dates like 2026-02-30 instead of rolling them into March.
    return date.toISOString().slice(0, 10) === value ? date : value;
  },
  z.date({ error: 'Use a real date in YYYY-MM-DD format' })
).transform((date) => date.toISOString().slice(0, 10));

const bilingual = (en: string, es: string) => z.object({
  en: z.string().optional().describe(en),
  es: z.string().optional().describe(es),
});

// Field order and .describe() texts below drive the Astro Editor sidebar form:
// fields appear (and are saved) in this order, with the description as help text.
const workPlaces = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/work'
  }),
  schema: z.object({
    name: z.string().describe('Place name as shown on the site, e.g. "Bajo La Palma" (no "Cartagena" suffix)'),
    slug: slug.describe('URL: /work/<slug>/. Lowercase-with-hyphens, same as the file name. Never change after publishing'),
    status: z.enum(['active', 'temporarily_closed', 'closed']).default('active')
      .describe('closed = kept for history, hidden from rankings'),
    // cultural-space (not cultural-center); coworking covers the two closed business listings.
    type: z.enum(['cafe', 'coworking', 'library', 'cultural-space']).default('cafe'),
    // Add a neighborhood here if a new spot is somewhere else.
    neighborhood: z.enum([
      'Centro Histórico', 'Getsemaní', 'San Diego', 'Bocagrande', 'Castillogrande', 'El Laguito',
      'Manga', 'Crespo', 'Pie de la Popa', 'Marbella', 'Cabrero', 'Bazurto',
    ]),
    address: z.string().optional()
      .describe('Exact street address from Google Maps, e.g. "Cra. 3 #7-49 Loc 3, Cartagena de Indias, Bolívar"'),
    maps_link: z.url().optional().describe('Google Maps share link'),
    hours: z.string().optional().describe('e.g. "Mon–Fri 6:30am–6:30pm · Sat 7am–6:30pm · Sun 8am–6pm"'),

    last_tested: isoDate.describe('Day you ran the speed test — shown as "verified" on the site'),
    tested_by: z.string().optional().describe('Who tested: Yatan, Adri, Dani…'),
    wifi: z.object({
      down: z.number().nonnegative().nullable().describe('Speedtest DOWNLOAD in Mbps — exact, don\'t round'),
      up: z.number().nonnegative().nullable().describe('Speedtest UPLOAD in Mbps — exact, don\'t round'),
      latency_ms: z.number().nonnegative().optional().nullable().describe('Speedtest PING in ms'),
      video_calls: z.enum(['poor', 'fair', 'good', 'excellent']).optional()
        .describe('Rough guide: excellent = 50+ up & ping < 30 · good = 20+ up · fair = 5–20 up · poor = under 5'),
      network: z.string().optional().nullable().describe('WiFi network name (SSID), if useful'),
      isp: z.string().optional().nullable().describe('Provider shown in Speedtest, e.g. Tigo, Claro, Movistar'),
    }).refine(
      ({ down, up }) => (down === null) === (up === null),
      {
        message: 'WiFi download and upload must either both be numbers or both be null',
        path: ['up'],
      }
    ),
    workspace: z.object({
      outlets: z.enum(['none', 'limited', 'some', 'many', 'n/a']),
      ac: z.boolean().describe('Air conditioning'),
      noise: z.enum(['quiet', 'moderate', 'loud', 'variable', 'n/a']),
    }),
    best_time: bilingual('When to go, e.g. "Mornings before 11am"', 'Lo mismo en español').optional(),

    images: z.array(z.object({
      file: z.string().min(1),
      caption: z.string().optional(),
      credit: z.string().optional(),
    })).optional().describe(
      'Photos in src/assets/images/places/work/. First one is the main photo. ' +
      'Format: [{"file": "slug-interior.jpg", "caption": "What is in the photo — Place, Neighborhood", "credit": "Cartagena Up"}]'
    ),

    // Cold brew review — when present, the spot appears on /work/best-cold-brew-cartagena/.
    cold_brew: z.object({
      drink: z.object({ en: z.string(), es: z.string() }).describe('Drink name, e.g. "Lupin — cold brew with corozo"'),
      price_cop: z.number().int().positive().optional().describe('Price you actually paid, in COP'),
      note: z.object({ en: z.string(), es: z.string() }).describe('Your honest take, 1–3 sentences'),
      tried: isoDate.describe('Date you drank it'),
      rank: z.number().int().positive().optional().describe('1 = best; unranked go last'),
      ruta_2026: z.boolean().optional().describe('Was on La Ruta del Cold Brew 2026'),
    }).optional().describe('Only fill in if you tried their cold brew — adds the spot to the cold brew guide'),

    hotspot_warning: z.boolean().optional().describe('Turn on if the WiFi is unreliable and a phone hotspot is recommended'),
    hotspot_note: bilingual('Why a hotspot is recommended', 'Por qué se recomienda un hotspot').optional(),
    whatsapp_update_text: z.string().optional()
      .describe('Pre-filled WhatsApp message for "suggest an update", e.g. "Update for Bajo La Palma listing on Cartagena Up"'),
    related_listing: z.string().optional().describe('Internal note: slug of a related listing'),
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
