import { useState, useMemo } from 'react';

const TYPE_LABELS = {
  en: { music:'Music', cultural:'Culture', taller:'Workshop', festival:'Festival', sports:'Sports', exposicion:'Exhibition', lgbtq:'LGTBIQ+' },
  es: { music:'Música', cultural:'Cultura', taller:'Taller', festival:'Festival', sports:'Deporte', exposicion:'Exposición', lgbtq:'LGTBIQ+' },
};

const TYPE_COLORS = {
  music:     { bg: 'rgba(200,148,58,0.12)',  text: '#C8943A', border: '#C8943A' },
  cultural:  { bg: 'rgba(196,92,38,0.12)',   text: '#C45C26', border: '#C45C26' },
  taller:    { bg: 'rgba(154,52,18,0.12)',   text: '#9A3412', border: '#9A3412' },
  festival:  { bg: 'rgba(212,80,58,0.12)',   text: '#D4503A', border: '#D4503A' },
  sports:    { bg: 'rgba(7,89,133,0.12)',    text: '#0369a1', border: '#0369a1' },
  exposicion:{ bg: 'rgba(7,89,133,0.12)',    text: '#0369a1', border: '#0369a1' },
  lgbtq:     { bg: 'rgba(126,34,206,0.12)',  text: '#7E22CE', border: '#7E22CE' },
};

const TYPE_THUMB = {
  music:'#C8943A', cultural:'#C45C26', taller:'#9A3412',
  festival:'#D4503A', sports:'#075985', exposicion:'#075985',
  lgbtq:'#7E22CE', default:'#6B6358',
};

function formatDayHeader(dateStr, lang) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString(lang === 'es' ? 'es-CO' : 'en-GB', {
    weekday: 'long', day: 'numeric', month: 'long',
  });
}

function groupByDate(events) {
  return events.reduce((acc, e) => {
    const key = e.data.date;
    (acc[key] = acc[key] || []).push(e);
    return acc;
  }, {});
}

function Initials({ title, type }) {
  const words = (title || '').split(' ').filter(Boolean);
  const initials = (words[0]?.[0] || '') + (words[1]?.[0] || '');
  return (
    <div style={{
      background: TYPE_THUMB[type] || TYPE_THUMB.default,
      flexShrink: 0, width: '2.5rem', height: '2.5rem',
      borderRadius: '8px', display: 'flex', alignItems: 'center',
      justifyContent: 'center', color: 'white', fontSize: '0.75rem', fontWeight: 700,
    }}>
      {initials.toUpperCase()}
    </div>
  );
}

function TypeTag({ type, lang }) {
  const labels = TYPE_LABELS[lang] || TYPE_LABELS.en;
  const colors = TYPE_COLORS[type] || { bg: 'var(--card-border)', text: 'var(--text-muted)', border: 'var(--border)' };
  return (
    <span style={{
      fontSize: '0.65rem', padding: '0.15rem 0.5rem', borderRadius: '4px',
      background: colors.bg, color: colors.text, fontWeight: 600,
    }}>
      {labels[type] || type}
    </span>
  );
}

export default function EventList({ events, lang, t }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const today = new Date().toISOString().split('T')[0];

  // FIX: use e.data.* — events are raw Content Collection entries
  const upcoming = useMemo(() =>
    events
      .filter(e =>
        e.data.active && (
          e.data.date >= today ||
          (e.data.end_date && e.data.end_date >= today)
        )
      )
      .sort((a, b) => a.data.date.localeCompare(b.data.date)),
    [events, today]
  );

  const filtered = useMemo(() => {
    return upcoming.filter(e => {
      const matchFilter =
        filter === 'all' ||
        e.data.type === filter ||
        (filter === 'gratis' && (e.data.price === 'gratis' || e.data.price === 'Free — open access'));
      const q = search.toLowerCase();
      const matchSearch = !q ||
        (e.data.title || '').toLowerCase().includes(q) ||
        (e.data.venue || '').toLowerCase().includes(q) ||
        (e.data.neighborhood || '').toLowerCase().includes(q);
      return matchFilter && matchSearch;
    });
  }, [upcoming, filter, search]);

  const grouped = groupByDate(filtered);
  const sortedDates = Object.keys(grouped).sort();

  const pills = [
    { key: 'all',      label: t.filterAll },
    { key: 'cultural', label: t.filterCulture },
    { key: 'music',    label: t.filterMusic },
    { key: 'gratis',   label: t.filterFree },
    { key: 'lgbtq',    label: t.filterPride },
  ];

  const isGratis = (price) =>
    price === 'gratis' || price === 'Free — open access' || price === 'Gratis';

  return (
    <div>
      {/* Search + filter */}
      <div style={{ marginBottom: '1.75rem' }}>
        <input
          type="search"
          placeholder={t.searchPlaceholder}
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '0.625rem 1rem', fontSize: '0.875rem',
            border: '1px solid var(--border)', borderRadius: '8px',
            background: 'var(--input-bg)', color: 'var(--fg)',
            marginBottom: '0.75rem', outline: 'none', boxSizing: 'border-box',
          }}
        />
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {pills.map(p => (
            <button key={p.key} onClick={() => setFilter(p.key)}
              style={{
                fontSize: '0.7rem', fontWeight: 700, padding: '0.35rem 0.875rem',
                borderRadius: '9999px', border: '1px solid',
                cursor: 'pointer', transition: 'all 0.1s', letterSpacing: '0.04em',
                background: filter === p.key ? '#C45C26' : 'transparent',
                color: filter === p.key ? 'white' : 'var(--text-muted)',
                borderColor: filter === p.key ? '#C45C26' : 'var(--border)',
              }}>
              {p.label}
            </button>
          ))}
        </div>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.625rem' }}>
          {filtered.length === 0
            ? t.noResults
            : `${filtered.length} ${lang === 'es' ? 'evento' + (filtered.length !== 1 ? 's' : '') : filtered.length === 1 ? 'event' : 'events'}`}
        </p>
      </div>

      {/* Day groups */}
      {sortedDates.map(date => (
        <div key={date} style={{ marginBottom: '2rem' }}>
          {/* Day header */}
          <div style={{
            fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)',
            textTransform: 'uppercase', letterSpacing: '0.08em',
            paddingBottom: '0.5rem', marginBottom: '0.75rem',
            borderBottom: '1px solid var(--border)',
          }}>
            {formatDayHeader(date, lang)}
          </div>

          {/* Day card wrapping all events */}
          <div style={{
            background: 'var(--card-bg)', border: '0.5px solid var(--card-border)',
            borderRadius: '12px', overflow: 'hidden',
          }}>
            {grouped[date].map((e, idx) => (
              <div key={e.id}
                style={{
                  display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
                  padding: '0.875rem 1.25rem',
                  borderBottom: idx < grouped[date].length - 1 ? '1px solid var(--border)' : 'none',
                }}>

                <Initials title={e.data.title} type={e.data.type} />

                {/* Time */}
                <div style={{ flexShrink: 0, minWidth: '3rem', paddingTop: '0.15rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--fg)', fontVariantNumeric: 'tabular-nums' }}>
                    {e.data.t0 && e.data.t0 !== 'TBC' ? e.data.t0 : ''}
                  </span>
                </div>

                {/* Divider */}
                <div style={{ width: '1px', background: 'var(--border)', alignSelf: 'stretch', flexShrink: 0, marginTop: '0.15rem' }} />

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--fg)', marginBottom: '0.15rem', lineHeight: 1.3 }}>
                    {e.data.title}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                    {e.data.venue}{e.data.neighborhood ? ` · ${e.data.neighborhood}` : ''}
                  </p>
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.4rem', alignItems: 'center' }}>
                    {e.data.type && <TypeTag type={e.data.type} lang={lang} />}
                    {isGratis(e.data.price) && (
                      <span style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem', borderRadius: '4px', background: 'rgba(22,163,74,0.12)', color: '#15803d', fontWeight: 600 }}>
                        {lang === 'es' ? 'Gratis' : 'Free'}
                      </span>
                    )}
                    {e.data.confirmed && (
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>✓ {lang === 'es' ? 'confirmado' : 'confirmed'}</span>
                    )}
                  </div>
                  {e.data.end_date && (
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                      {t.onUntil} {e.data.end_date}
                    </p>
                  )}
                  {(lang === 'en' ? (e.data.notes_en || e.data.notes) : e.data.notes) && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                      {lang === 'en' ? (e.data.notes_en || e.data.notes) : e.data.notes}
                    </p>
                  )}
                  {e.data.maps_link && (
                    <a href={e.data.maps_link} target="_blank" rel="noopener"
                      style={{ fontSize: '0.75rem', color: '#C45C26', textDecoration: 'none', marginTop: '0.25rem', display: 'inline-block' }}>
                      📍 {lang === 'es' ? 'Ver en mapa' : 'Open in Maps'}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
