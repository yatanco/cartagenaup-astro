const EN_MARKER = '## En / Overview';
const ES_MARKER = '## Es / Descripción';

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
