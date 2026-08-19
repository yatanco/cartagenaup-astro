const BOGOTA_TIME_ZONE = 'America/Bogota';

const FREE_PRICE_LABELS = new Set([
  'gratis',
  'entrada libre',
  'free',
  'free — open access',
]);

export function getBogotaToday(date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: BOGOTA_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export function isFreeEventPrice(price: string): boolean {
  return FREE_PRICE_LABELS.has(price.trim().toLocaleLowerCase('es-CO'));
}

export function getEventTitle(
  event: { title: string; title_en?: string },
  lang: 'en' | 'es'
): string {
  return lang === 'en' ? event.title_en || event.title : event.title;
}

export function getEventPriceLabel(price: string, lang: 'en' | 'es'): string {
  const normalized = price.trim().toLocaleLowerCase('es-CO');

  if (isFreeEventPrice(price)) return lang === 'en' ? 'Free' : 'Gratis';
  if (normalized === 'por confirmar') return lang === 'en' ? 'To be confirmed' : 'Por confirmar';

  const startingAt = price.match(/^desde\s+(.+)$/i);
  if (startingAt) return lang === 'en' ? `From ${startingAt[1]}` : `Desde ${startingAt[1]}`;

  return price;
}

export function getEventOffer(price: string) {
  if (isFreeEventPrice(price)) {
    return {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'COP',
      availability: 'https://schema.org/InStock',
    };
  }

  // Accept one unambiguous COP amount only, with optional $, thousands separators,
  // and COP before or after it. Reject ranges, packages and descriptive pricing.
  const match = price.trim().match(
    /^(?:COP\s*\$?\s*(\d{1,3}(?:[.,]\d{3})+|\d+)|\$?\s*(\d{1,3}(?:[.,]\d{3})+|\d+)\s*COP)$/i
  );
  if (!match) return undefined;

  const amount = (match[1] || match[2]).replace(/[.,]/g, '');
  if (!/^\d+$/.test(amount)) return undefined;

  return {
    '@type': 'Offer',
    price: amount,
    priceCurrency: 'COP',
    availability: 'https://schema.org/InStock',
  };
}
