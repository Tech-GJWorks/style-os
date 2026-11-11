import { outfits } from './outfits';

/** Folder layout for personalised outfit renders (public/images/outfits/<folder>/). */
export const imageFolders: Record<string, string> = {
  polo: 'casual', tees: 'casual', chinos: 'casual', jeans: 'casual', cargo: 'casual', overshirts: 'casual', jackets: 'casual',
  oxford: 'smart-casual', cotton: 'smart-casual', twill: 'smart-casual', utility: 'smart-casual', band: 'smart-casual', printed: 'smart-casual',
  'formal-trousers': 'office', blazers: 'office',
  date: 'dates', travel: 'travel', linen: 'linen', summer: 'linen',
  suits: 'formal', traditional: 'traditional', wedding: 'traditional',
  stripes: 'shirts', checks: 'shirts', prints: 'shirts', textures: 'shirts', coords: 'casual', relaxed: 'trousers', 'indian-new': 'traditional',
  knitwear: 'seasonal', winter: 'seasonal',
};

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export interface ImageAsset { outfitId: string; folder: string; file: string; path: string; status: 'pending' | 'available'; kind: 'personalised-render' }

export const imageAssets: ImageAsset[] = outfits.map((o) => {
  const folder = imageFolders[o.collection] ?? 'casual';
  const file = `${o.id}-${slug(o.name)}.webp`;
  return { outfitId: o.id, folder, file, path: `images/outfits/${folder}/${file}`, status: 'pending', kind: 'personalised-render' };
});

export const assetByOutfit = Object.fromEntries(imageAssets.map((a) => [a.outfitId, a]));

/** Loads public/images/outfits/manifest.json — the list of renders that actually exist. */
let manifest: Promise<Set<string>> | null = null;
export function loadManifest(): Promise<Set<string>> {
  manifest ??= fetch(`${import.meta.env.BASE_URL}images/outfits/manifest.json`, { cache: 'no-cache' })
    .then((r) => (r.ok ? r.json() : { available: [] }))
    .then((j: { available?: string[] }) => new Set(j.available ?? []))
    .catch(() => new Set<string>());
  return manifest;
}
