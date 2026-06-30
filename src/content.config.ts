import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const workPlaces = defineCollection({
  loader: glob({
    pattern: '**/*.yaml',
    base: './src/data/work'
  }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    neighborhood: z.string(),
    type: z.string(),
    last_tested: z.string(),
    tested_by: z.string().optional(),
    wifi_network: z.string().optional().nullable(),
    wifi_down_mbps: z.number(),
    wifi_up_mbps: z.number(),
    wifi_latency_ms: z.number().optional().nullable(),
    wifi_packet_loss_pct: z.number().optional().nullable(),
    wifi_isp: z.string().optional().nullable(),
    wifi_note: z.string().optional(),
    video_calls: z.string().optional(),
    outlets: z.string(),
    ac: z.boolean(),
    noise_level: z.string(),
    best_time: z.string().optional(),
    best_spot: z.string().optional(),
    price_to_stay: z.string().optional(),
    hours: z.string().optional(),
    maps_link: z.string().optional(),
    address: z.string().optional(),
    local_note: z.string().optional(),
    local_note_en: z.string().optional(),
    local_note_es: z.string().optional(),
    hotspot_warning: z.boolean().optional(),
    hotspot_note: z.string().optional(),
    whatsapp_update_text: z.string().optional(),
    related_listing: z.string().optional(),
    casa_gaviota_note: z.string().optional(),
    images: z.array(z.object({
      file: z.string(),
      caption: z.string().optional(),
      credit: z.string().optional(),
    })).optional(),
    active: z.boolean(),
  }),
});

const events = defineCollection({
  loader: glob({
    pattern: '**/*.yaml',
    base: './src/data/events'
  }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    date: z.string(),
    end_date: z.string().optional().nullable(),
    t0: z.string().optional(),
    t1: z.string().optional().nullable(),
    venue: z.string(),
    venue_slug: z.string().optional(),
    neighborhood: z.string().optional(),
    type: z.string(),
    recurring: z.string().optional(),
    price: z.string(),
    confirmed: z.boolean().optional(),
    source: z.string().optional(),
    maps_link: z.string().optional(),
    notes: z.string().optional(),
    notes_en: z.string().optional(),
    active: z.boolean(),
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

export const collections = { workPlaces, events, venues };
