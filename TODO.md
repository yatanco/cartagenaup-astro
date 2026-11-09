# Cartagena Up — TODO

Open work for the site. Any agent (Claude Code, Codex, …): read this at the start of a session,
mention what's open, and update it when something is done (move it to "Done" with the date).

Site focus (decided 2026-11-08): WiFi-tested cafés, coffee, and places to work/study.
Events section is retired (old URLs 301 to /work/). Venues are kept as static pages that
link out to each venue's own calendar via `events_url` / Instagram.

---

## 1. Cold brew guide — `/work/best-cold-brew-cartagena/` (EN + ES)

Page template is built (`src/components/ColdBrewPage.astro`). It lists every active work spot
that has a `cold_brew` block in its frontmatter. It stays **noindex** until there are 3+ entries,
so it's safe to publish while empty.

Source: La Ruta del Cold Brew 2026 (already happened). Participating cafés, per the official poster
(NOT the AI-written list that circulated — that one had 4 wrong cafés):

| Café | On site? | Status |
|---|---|---|
| Mientras | ✅ `mientras-cartagena` | needs cold brew tasting only |
| Meeza (Café & Brunch Salón) | ❌ | visit: WiFi + photos + cold brew |
| Barra Xperimental | ❌ | visit: WiFi + photos + cold brew |
| Mura | ❌ | visit: WiFi + photos + cold brew |
| Just B | ❌ | visit: WiFi + photos + cold brew |
| CA.FÉ (Brunch) | ❌ | visit: WiFi + photos + cold brew |
| Kona | ❌ | visit: WiFi + photos + cold brew |
| Libertario (not on route) | ✅ `libertario-getsemani` | optional bonus pick |

**At each visit, capture:** Speedtest screenshot (exact numbers, don't round), 2–3 photos,
outlets / noise / AC, the cold brew name + price actually paid, a 1–3 sentence honest take,
the date. Addresses: get from Google Maps on the spot, not from the circulated list.

**To add a review**, put this in the spot's frontmatter (`src/content/work/<slug>.md`):

```yaml
cold_brew:
  drink: { en: "Lupin — cold brew with corozo", es: "Lupin — cold brew con corozo" }
  price_cop: 17500          # optional, what you paid
  note: { en: "Your honest take.", es: "Tu opinión honesta." }
  tried: "2026-11-15"
  rank: 1                   # optional, 1 = best; unranked go last
  ruta_2026: true           # optional, was on La Ruta del Cold Brew 2026
```

New cafés need a full work spot file first (same format as the others; see README-DANI.md).
Images go in `src/assets/images/places/work/` (see AGENTS.md image rules).

**When the page has 3+ entries:**
- [ ] Link it from the footer (Work Spots column in `src/layouts/Base.astro`) and from `/work/`
- [ ] Add it to `public/llms.txt`
- [ ] Tag the cafés + route organizer on Instagram ("we went back to every café on the route
      and tested the WiFi") — aim for reposts / a link back

## 2. Re-verify existing work spots

All 16 active spots were last tested Jun 20 – Jul 24, 2026. Fresh "verified" dates are the moat.
- [ ] Re-test, oldest first; update `last_tested`, `wifi`, and anything that changed

## 3. Search Console follow-ups (export lives in `reference/`, git-ignored)

- [ ] ~Dec 2026: check `/work/` CTR in Search Console → Performance → Pages. Titles were
      rewritten 2026-11-08 for "best places to study / cafés to work" (was 0.5% CTR at pos ~5.6)
- [ ] Juan Valdez La Mansión page: 201 impressions, 0 clicks — people search for the mall
      ("la mansion bocagrande"). Add a few sentences about the mall / what's around it
- [ ] Studying is the biggest search demand ("best places to study near me", 624 impressions,
      pos 2.8). Consider a dedicated "places to study in Cartagena" page (libraries + quiet cafés)

## 4. Small things

- [ ] Analytics: add key events for WhatsApp CTA clicks and "Open in Maps" clicks (GA4 shows 0 key events)
- [ ] Venues with no "What's on" link (no Instagram / `events_url`): Cafetería Central, Kim,
      María Julio, Mercado Bazurto, San Pedro Claver — add a handle or calendar URL if they have one
- [ ] La Triada's text says "fastest WiFi we've tested in the city: 372" but Mientras (531) is faster —
      reword La Triada's EN/ES overview (it's quoted verbatim in the generated llms.txt)
- [ ] robots.txt allows GPTBot + Google-Extended (training crawlers) while Content-Signal says ai-train=no —
      decide which you mean (robots.txt is likely Cloudflare-managed; check dashboard)
- [ ] After deploy: confirm https://cartagenaup.com/this-does-not-exist returns 404, then re-run PageSpeed

---

## Done

- 2026-11-08 — Retired events section; 301s in `public/_redirects`
- 2026-11-08 — Restored venues as static pages with "What's on" link-outs; Bartolomé Calvo → BanRep calendar
- 2026-11-08 — Rewrote `/work/` EN/ES titles for study/work search intent
- 2026-11-08 — Removed netlify.toml (site is on Cloudflare); `.node-version` = 22
- 2026-11-08 — Cold brew page template built
- 2026-11-08 — Real 404 page (Cloudflare was serving homepage w/ 200 for unknown URLs); llms.txt generated from content per llmstxt.org; sitemap lastmod from last_tested
