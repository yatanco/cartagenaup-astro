import { marked } from 'marked';

const EN_MARKER = '## En / Overview';
const ES_MARKER = '## Es / Descripción';

/**
 * Work-place Markdown bodies hold both language sections in one file (see
 * src/content/work/*.md). Public routes must show exactly one language —
 * splitting the raw Markdown source on the known ## En / ## Es headings
 * (rather than post-render HTML) keeps the split unambiguous and lets each
 * half go through a normal Markdown parser on its own.
 */
export function renderPlaceSection(body: string, lang: 'en' | 'es'): string {
  const enIndex = body.indexOf(EN_MARKER);
  const esIndex = body.indexOf(ES_MARKER);

  if (enIndex === -1 || esIndex === -1 || esIndex < enIndex) {
    throw new Error('Work-place Markdown body is missing the ## En / Overview or ## Es / Descripción section marker');
  }

  const enSection = body.slice(enIndex + EN_MARKER.length, esIndex).trim();
  const esSection = body.slice(esIndex + ES_MARKER.length).trim();
  const section = lang === 'en' ? enSection : esSection;

  return marked.parse(section, { async: false }) as string;
}

/**
 * Plain-text teaser for list cards: just the opening Overview paragraph,
 * stripped of Markdown syntax, before the ### Best spot / ### Food & drinks
 * subheadings.
 */
export function getPlaceOverviewExcerpt(body: string, lang: 'en' | 'es'): string {
  const enIndex = body.indexOf(EN_MARKER);
  const esIndex = body.indexOf(ES_MARKER);

  if (enIndex === -1 || esIndex === -1 || esIndex < enIndex) return '';

  const enSection = body.slice(enIndex + EN_MARKER.length, esIndex).trim();
  const esSection = body.slice(esIndex + ES_MARKER.length).trim();
  const section = lang === 'en' ? enSection : esSection;
  const paragraph = section.split(/\n###\s/)[0];

  return paragraph.replace(/[#*_`]/g, '').trim();
}
