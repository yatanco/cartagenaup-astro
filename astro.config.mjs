// @ts-check
import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

import sitemap from '@astrojs/sitemap';
import placeLanguageSections from './src/utils/satteriPlaceLanguages.mjs';
import { readdirSync, readFileSync } from 'node:fs';
import { parse as parseYaml } from 'yaml';

// Sitemap <lastmod>: each work spot's last_tested date; list/ranking pages get the newest one.
const workDir = './src/content/work';
const lastTested = Object.fromEntries(
  readdirSync(workDir).filter(f => f.endsWith('.md')).map(f => {
    const fm = parseYaml(readFileSync(`${workDir}/${f}`, 'utf8').split(/^---$/m)[1] ?? '') ?? {};
    return [fm.slug, fm.last_tested];
  }).filter(([slug, date]) => slug && date)
);
const newestTest = Object.values(lastTested).sort().at(-1);

/** @param {string} url */
function sitemapLastmod(url) {
  const m = new URL(url).pathname.match(/^(?:\/es)?\/work\/([^/]+)\/$/);
  if (m && lastTested[m[1]]) return lastTested[m[1]];
  if (/^(?:\/es)?\/(work\/.*)?$/.test(new URL(url).pathname)) return newestTest;
  return undefined;
}

export default defineConfig({
  site: 'https://cartagenaup.com',
  markdown: {
    processor: satteri({
      mdastPlugins: [placeLanguageSections],
    }),
  },
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.endsWith('/404/'),
      serialize(item) {
        const lastmod = sitemapLastmod(item.url);
        if (lastmod) item.lastmod = new Date(lastmod + 'T12:00:00Z').toISOString();
        return item;
      },
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en-US',
          es: 'es-CO',
        },
      },
    }),
  ],
  output: 'static',
  // Site CSS is ~4 KiB: inline it to remove a render-blocking request.
  build: { inlineStylesheets: 'always' },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: {
      prefixDefaultLocale: false,
    }
  }
});
