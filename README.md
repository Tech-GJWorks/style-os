# My Style OS

Personal Fashion Intelligence & Wardrobe System. A static React app for learning men's clothing, planning outfits and managing a real wardrobe, personalised to one profile (Warm Deep Autumn, diamond face, 6′1″, measurements from 31 Oct 2026).

Live: https://tech-gjworks.github.io/style-os/

## What's inside

| Section | What it does |
|---|---|
| Dashboard | Profile, owned counts, "What should I wear today?" engine, shopping priorities, wardrobe gaps |
| Body & Measurements | Measurement history, editable measurements with how-to guides, derived size profile, brand size comparison tool, report inconsistencies |
| Colour Intelligence | Report palette + evaluated extra colours, combination tester, colour psychology |
| Clothing Academy | 118 garment types, each on its own page with 29 sections |
| Outfit Lookbook | 24 collections / 108 outfits with full spec sheets |
| My Outfit Combinations | Ownership tracker, completion %, filters, side-by-side compare, substitution from owned items |
| Occasions / Seasons / Fabrics | 53 occasion guides, Bengaluru seasonal wardrobe, textile and care tables |
| My Wardrobe | Catalogue ownership (5 statuses) + full item CRUD with photos, duplicate, filters |
| Outfit Builder | Any-outfit builder with "Why does this outfit work?" + owned-only generator |
| Virtual Try-On | Image asset library and render status (personalised renders pending) |
| Brands, Accessories, Grooming, Psychology, Trends, Search | Reference sections |
| Shopping Planner | Gap ranking by outfits unlocked, wishlist, budget, wardrobe value, capsule wardrobes |
| Journal, Backup & Data | Wear log; JSON export, import and reset |

## Local development

```bash
npm install
npm run dev            # http://localhost:5173/style-os/
npm run build          # type-check + production build into dist/
npm run preview        # serve dist/
```

Requires Node 20+.

## Configuration

- **Base path**: `vite.config.ts` reads `BASE_PATH` (default `/style-os/`). For a custom domain or root hosting: `BASE_PATH=/ npm run build`.
- **Routing**: `HashRouter` (`/#/outfits`), so deep links work on GitHub Pages without server rewrites.
- **Catalogue data**: everything in `src/data/` is plain typed data, separate from the UI:
  - `colours.ts`: palette with verdicts
  - `kinds.ts`: component garment types (slot, fabric, formality, seasons, body notes)
  - `outfits.ts`: outfit rows (`kind:colour` references)
  - `garments.ts`: Academy content
  - `fabrics.ts`, `occasions.ts`, `brands.ts`, `content.ts` (profile, measurements, impressions, glossary, capsules, trends)

  To add an outfit, append a row to `rows` in `outfits.ts`. Pieces are created automatically from the `kind:colour` references.

## Personalised outfit images

Each outfit has a reserved file at `public/images/outfits/<folder>/<outfit-id>-<slug>.webp` (folders: casual, smart-casual, office, dates, travel, linen, formal, traditional, seasonal, accessories). To publish a render:

1. Save the image at the path shown on the Virtual Try-On page.
2. Add the outfit id to `available` in `public/images/outfits/manifest.json`.
3. Commit and push. The lookbook shows the render instead of the illustration.

Until then each outfit shows a flat proportion illustration drawn from the measurements (labelled "Illustration · not a photo"). You can also upload your own photo per outfit; it is stored only in the browser.

## Data and privacy

Wardrobe data lives in the browser's IndexedDB (`idb-keyval`, key `style-os-v1`). It does not sync across devices: use **Backup & Data** to export and import JSON. All state sits behind `src/lib/store.tsx`, so a cloud backend can be added later.

The repository is public and contains body measurements by choice. The reference photo is never committed: upload it in the app and it stays in your browser. Original renders live outside the repo.

## Deployment

`.github/workflows/deploy.yml` builds on every push to `main` and deploys to GitHub Pages (Settings → Pages → Source: GitHub Actions).

## Accuracy notes

- Brand entries are positioning only. Prices, size charts, stock and links are marked **research pending**, and no product URLs are included.
- Garment prices are indicative market bands, not product prices.
- Psychology content describes cultural associations, not guaranteed effects.
