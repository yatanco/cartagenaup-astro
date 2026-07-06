import type { ImageMetadata } from 'astro';

const workImages = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/images/places/work/*',
  { eager: true }
);

const beachImages = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/images/places/beaches/*',
  { eager: true }
);

const venueImages = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/images/venues/*',
  { eager: true }
);

export function getWorkImage(filename: string): ImageMetadata | null {
  const key = `/src/assets/images/places/work/${filename}`;
  return workImages[key]?.default ?? null;
}

export function getBeachImage(filename: string): ImageMetadata | null {
  const key = `/src/assets/images/places/beaches/${filename}`;
  return beachImages[key]?.default ?? null;
}

export function getVenueImage(filename: string): ImageMetadata | null {
  const key = `/src/assets/images/venues/${filename}`;
  return venueImages[key]?.default ?? null;
}
