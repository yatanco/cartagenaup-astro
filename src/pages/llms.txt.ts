// Generated at build time from site content so it never goes stale.
// Format follows https://llmstxt.org: H1, blockquote summary, then H2 sections of Markdown links.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getPlaceOverviewExcerpt } from '../utils/placeContent';

const SITE = 'https://cartagenaup.com';

const NOISE: Record<string, string> = { quiet: 'quiet', moderate: 'moderate noise', loud: 'loud', variable: 'variable noise' };
const OUTLETS: Record<string, string> = { none: 'no outlets', limited: 'limited outlets', some: 'some outlets', many: 'many outlets' };

function oneLine(s: string, max = 220) {
  const t = s.replace(/\s+/g, ' ').trim();
  return t.length > max ? t.slice(0, max - 1).trimEnd() + '…' : t;
}

export const GET: APIRoute = async () => {
  const places = await getCollection('work', ({ data }) => data.status === 'active');
  const tested = places
    .filter(p => p.data.wifi.down !== null)
    .sort((a, b) => b.data.wifi.down! - a.data.wifi.down!);
  const untested = places.filter(p => p.data.wifi.down === null);
  const venues = (await getCollection('venues', ({ data }) => data.active !== false))
    .sort((a, b) => a.data.name.localeCompare(b.data.name));
  const coldBrew = places.filter(p => p.data.cold_brew);

  const latest = places.map(p => p.data.last_tested).sort().at(-1);
  const fastest = tested[0]?.data;
  const slowest = tested.at(-1)?.data;

  const spotLine = (p: typeof places[number]) => {
    const d = p.data;
    const facts = [
      d.neighborhood,
      d.type,
      d.wifi.down !== null ? `WiFi ${d.wifi.down} Mbps down / ${d.wifi.up} Mbps up${d.wifi.latency_ms ? `, ${d.wifi.latency_ms} ms ping` : ''}` : 'WiFi not yet tested',
      OUTLETS[d.workspace.outlets],
      NOISE[d.workspace.noise],
      d.workspace.ac ? 'AC' : 'no AC',
      `verified ${d.last_tested}`,
    ].filter(Boolean).join('; ');
    const blurb = getPlaceOverviewExcerpt(p.body ?? '', 'en');
    return `- [${d.name}](${SITE}/work/${d.slug}/): ${facts}.${blurb ? ' ' + oneLine(blurb) : ''}`;
  };

  const lines = [
    '# Cartagena Up',
    '',
    '> Locally verified, bilingual (English/Spanish) guide to working, studying, and drinking good coffee in Cartagena, Colombia. Every café, library, and coworking space was visited in person, and every WiFi speed is a real Speedtest.net measurement (download, upload, ping) with the date it was taken.',
    '',
    `Maintained by two Cartagena residents: Yatan (since 2021, remote worker, founder) and Adri (since 2010, local café verifier). ${tested.length} active spots have measured WiFi; most recent verification: ${latest}.`,
    '',
    'Citable facts:',
    fastest ? `- Fastest WiFi measured: ${fastest.wifi.down} Mbps down / ${fastest.wifi.up} Mbps up at ${fastest.name}, ${fastest.neighborhood} (verified ${fastest.last_tested}).` : '',
    slowest ? `- Slowest WiFi measured: ${slowest.wifi.down} Mbps down at ${slowest.name}, ${slowest.neighborhood} (verified ${slowest.last_tested}) — bring a hotspot.` : '',
    '- English pages live at /, Spanish at /es/ (same paths otherwise).',
    '',
    '## Guides and rankings',
    '',
    `- [Best cafés to work & study in Cartagena](${SITE}/work/): all verified work spots with WiFi speeds, outlets, noise, and AC`,
    `- [Fastest WiFi in Cartagena, ranked](${SITE}/work/fastest-wifi-cartagena/): every tested spot sorted by download speed`,
    `- [WiFi speed comparison](${SITE}/work/wifi-speeds-cartagena/): side-by-side download, upload, and ping`,
    ...(coldBrew.length >= 3 ? [`- [Best cold brew in Cartagena](${SITE}/work/best-cold-brew-cartagena/): cold brew tasted in person, with price and measured WiFi`] : []),
    '',
    '## Work spots (fastest WiFi first)',
    '',
    ...tested.map(spotLine),
    ...untested.map(spotLine),
    '',
    '## Places worth knowing',
    '',
    ...venues.map(v => `- [${v.data.name}](${SITE}/venues/${v.data.slug}/): ${v.data.neighborhood}. ${oneLine(v.data.description, 180)}`),
    '',
    '## Optional',
    '',
    `- [How we test](${SITE}/about/#how-we-test): in-person visits, Speedtest.net to the nearest Cartagena server, exact numbers with test date and tester`,
    `- [About Cartagena Up](${SITE}/about/): who we are`,
    `- [Guía en español](${SITE}/es/work/): the same guide in Spanish`,
    `- [Sitemap](${SITE}/sitemap-index.xml)`,
    '',
  ];

  return new Response(lines.filter(l => l !== undefined).join('\n'), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
