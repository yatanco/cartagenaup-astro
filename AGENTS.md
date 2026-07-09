## Images (CRITICAL)

All images go in `src/assets/images/` NOT `public/`.
- Work spots: `src/assets/images/places/work/`
- Beaches: `src/assets/images/places/beaches/`
- Venues: `src/assets/images/venues/`

Use helpers from `src/utils/images.ts`:
  `getWorkImage(filename)`
  `getBeachImage(filename)`
  `getVenueImage(filename)`

Pre-resolve in Astro components using `getImage()` from `astro:assets`.
Pass resolved `{ url, webpUrl }` to React islands (they can't call `astro:assets` directly).
Never put place images in `public/`.
Never manually convert to WebP — Astro handles it via `getImage()`.
Never use `client:load` unless essential.
Use `client:visible` for all islands below the fold.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Competitive Position

Cartagena Up has a meaningful moat against every current competitor: real WiFi speed test data (download, upload, and ping for each spot), personal verification dates, original photography, and a live events pipeline sourced directly from Banco de la República, Alianza Francesa, and Espacio Cultural Claustro de la Merced. No other Cartagena guide — including cartagenaexplorer.com (~41k visits, broad authority) and cartagenaconnections.com (~7k visits, stale content) — publishes actual measured WiFi speeds. The 2018 Lost With Purpose wifi-cartagena article, the highest-ranking result for "wifi cartagena," has visible PHP errors and speed data from 2018. The realistic ranking timeline for a domain this young: 3–6 months for long-tail queries ("café with wifi cartagena", "coworking manga cartagena"), 6–12 months for competitive head terms like "coworking cartagena" or "best cafés to work cartagena." Local SEO signals (consistent NAP, Maps links, neighborhood tagging) will compound faster than domain age alone.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Future: Content Management (when needed)

Current workflow: YAML files edited manually or 
generated via Claude. Works fine for 2 contributors.

### When to build this
Build a submission form/CMS when:
- A third contributor who isn't technical joins
- Time spent on YAML per listing exceeds 30 minutes
- You need contributors who can't use GitHub

### Recommended solution: Tina CMS
- Open source, Git-backed, free for small teams
- Connects directly to the Astro repo
- Visual form UI that writes YAML and commits 
  to GitHub automatically
- Works with Cloudflare Pages deployment
- One afternoon to set up, no ongoing maintenance
- Docs: tina.io

### Alternative: Airtable + GitHub API
- Contributors fill Airtable form
- Zapier/Make converts rows to YAML via GitHub API
- More fragile but zero code required
- Good for non-technical contributors who 
  already use Airtable

### Do NOT build a custom form yet
The bottleneck is field verification time 
(visiting spots, running speed tests, taking photos) 
not YAML submission time. A form doesn't fix that.
