import useEmblaCarousel from 'embla-carousel-react';
import { useState, useCallback, useEffect } from 'react';

export default function PlaceCarousel({ images, placeName }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [lightbox, setLightbox] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateButtons = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', updateButtons);
    emblaApi.on('init', updateButtons);
    updateButtons();
  }, [emblaApi, updateButtons]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e) => {
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowLeft' && lightbox > 0) setLightbox(l => l - 1);
      if (e.key === 'ArrowRight' && lightbox < images.length - 1) setLightbox(l => l + 1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox, images.length]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightbox !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [lightbox]);

  if (!images || images.length === 0) return null;

  const single = images.length === 1;

  return (
    <>
      <div style={{ position: 'relative', borderRadius: '12px 12px 0 0', overflow: 'hidden', background: '#1C1A17' }}>

        <div ref={emblaRef} style={{ overflow: 'hidden' }}>
          <div style={{ display: 'flex' }}>
            {images.map((img, i) => (
              <div
                key={i}
                style={{ flex: '0 0 100%', minWidth: 0, cursor: 'zoom-in', position: 'relative' }}
                onClick={() => setLightbox(i)}
              >
                <img
                  src={`/images/places/work/${img.file}`}
                  alt={img.caption || placeName}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }}
                />
                {img.caption && (
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
                    color: 'white', fontSize: '11px',
                    padding: '1.5rem 0.75rem 0.5rem',
                    pointerEvents: 'none',
                  }}>
                    {img.caption}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {!single && (
          <>
            <button
              onClick={scrollPrev}
              disabled={!canPrev}
              aria-label="Previous photo"
              style={{
                position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none',
                borderRadius: '50%', width: '32px', height: '32px',
                cursor: canPrev ? 'pointer' : 'default',
                opacity: canPrev ? 1 : 0.3,
                fontSize: '16px', lineHeight: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'opacity 0.15s',
              }}>‹</button>

            <button
              onClick={scrollNext}
              disabled={!canNext}
              aria-label="Next photo"
              style={{
                position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none',
                borderRadius: '50%', width: '32px', height: '32px',
                cursor: canNext ? 'pointer' : 'default',
                opacity: canNext ? 1 : 0.3,
                fontSize: '16px', lineHeight: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'opacity 0.15s',
              }}>›</button>

            <div style={{
              position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)',
              display: 'flex', gap: '5px',
            }}>
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => emblaApi?.scrollTo(i)}
                  aria-label={`Go to photo ${i + 1}`}
                  style={{
                    width: selectedIndex === i ? '16px' : '6px',
                    height: '6px', borderRadius: '3px',
                    background: selectedIndex === i ? '#C45C26' : 'rgba(255,255,255,0.5)',
                    border: 'none', cursor: 'pointer', padding: 0,
                    transition: 'all 0.2s',
                  }}
                />
              ))}
            </div>

            <div style={{
              position: 'absolute', top: '8px', right: '8px',
              background: 'rgba(0,0,0,0.5)', color: 'white',
              fontSize: '11px', padding: '2px 8px', borderRadius: '10px',
              pointerEvents: 'none',
            }}>
              {selectedIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {lightbox !== null && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'zoom-out',
          }}>

          <button
            onClick={() => setLightbox(null)}
            aria-label="Close lightbox"
            style={{
              position: 'absolute', top: '1rem', right: '1rem',
              background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white',
              width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer',
              fontSize: '18px', lineHeight: 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>✕</button>

          {lightbox > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); setLightbox(l => l - 1); }}
              aria-label="Previous photo"
              style={{
                position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white',
                width: '44px', height: '44px', borderRadius: '50%', cursor: 'pointer',
                fontSize: '22px', lineHeight: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>‹</button>
          )}

          <div onClick={e => e.stopPropagation()} style={{ maxWidth: '90vw', maxHeight: '90vh' }}>
            <img
              src={`/images/places/work/${images[lightbox].file}`}
              alt={images[lightbox].caption || ''}
              style={{
                maxWidth: '90vw', maxHeight: '85vh',
                objectFit: 'contain', display: 'block', borderRadius: '4px',
              }}
            />
            {images[lightbox].caption && (
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', textAlign: 'center', marginTop: '0.5rem' }}>
                {images[lightbox].caption}
              </p>
            )}
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', textAlign: 'center', marginTop: '0.25rem' }}>
              {lightbox + 1} / {images.length} · click outside to close
            </p>
          </div>

          {lightbox < images.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setLightbox(l => l + 1); }}
              aria-label="Next photo"
              style={{
                position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white',
                width: '44px', height: '44px', borderRadius: '50%', cursor: 'pointer',
                fontSize: '22px', lineHeight: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>›</button>
          )}
        </div>
      )}
    </>
  );
}
