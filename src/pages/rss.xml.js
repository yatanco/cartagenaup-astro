import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const today = new Date().toISOString().split('T')[0];
  const events = await getCollection('events',
    ({ data }) =>
      data.active !== false &&
      (data.date >= today ||
       (data.end_date && data.end_date >= today))
  );
  return rss({
    title: 'Cartagena Up — This Week',
    description:
      'Current events in Cartagena, Colombia ' +
      '— updated weekly by a local.',
    site: context.site,
    items: events
      .sort((a, b) => a.data.date.localeCompare(b.data.date))
      .map(e => ({
        title: e.data.title,
        pubDate: new Date(e.data.date + 'T12:00:00'),
        description: e.data.notes_en || e.data.notes || '',
        link: '/events/',
      })),
    customData: '<language>en-us</language>',
  });
}
