import type { Colour } from './types';

// Hex values are representative swatches for screen use, not matched dye references.
export const colours: Colour[] = [
  // Report: Neutrals
  { id: 'beige', name: 'Warm beige', hex: '#D8C3A0', group: 'Neutrals', family: 'neutral', depth: 1, verdict: 'core', source: 'report' },
  { id: 'camel', name: 'Camel', hex: '#B8895A', group: 'Neutrals', family: 'neutral', depth: 2, verdict: 'core', source: 'report' },
  { id: 'olive', name: 'Olive green', hex: '#6B6B3A', group: 'Neutrals', family: 'neutral', depth: 2, verdict: 'core', source: 'report' },
  { id: 'chocolate', name: 'Chocolate brown', hex: '#4E3426', group: 'Neutrals', family: 'neutral', depth: 3, verdict: 'core', source: 'report' },
  { id: 'ivory', name: 'Creamy ivory', hex: '#F1E8D4', group: 'Neutrals', family: 'neutral', depth: 1, verdict: 'core', source: 'report' },
  // Report: Mains
  { id: 'terracotta', name: 'Terracotta', hex: '#B5603F', group: 'Mains', family: 'warm', depth: 2, verdict: 'core', source: 'report' },
  { id: 'rust', name: 'Rust', hex: '#9C4A2A', group: 'Mains', family: 'warm', depth: 2, verdict: 'core', source: 'report' },
  { id: 'mustard', name: 'Mustard yellow', hex: '#C99A2E', group: 'Mains', family: 'warm', depth: 2, verdict: 'core', source: 'report' },
  { id: 'warm-olive', name: 'Warm olive', hex: '#7D7340', group: 'Mains', family: 'warm', depth: 2, verdict: 'core', source: 'report' },
  { id: 'burnt-orange', name: 'Burnt orange', hex: '#C0612B', group: 'Mains', family: 'warm', depth: 2, verdict: 'good', source: 'report', note: 'Strong. Best as a shirt or knit, rarely as trousers.' },
  // Report: Accents
  { id: 'teal', name: 'Deep teal', hex: '#1F5C5A', group: 'Accents', family: 'cool', depth: 3, verdict: 'core', source: 'report', note: 'The one cool-leaning colour in your palette — your best "distinctive" colour.' },
  { id: 'coral', name: 'Warm coral', hex: '#D9735B', group: 'Accents', family: 'warm', depth: 2, verdict: 'good', source: 'report', note: 'Summer casual shirts and polos only.' },
  { id: 'pumpkin', name: 'Pumpkin', hex: '#C96A1F', group: 'Accents', family: 'warm', depth: 2, verdict: 'good', source: 'report', note: 'Accent, not a base. A knit or a pocket square.' },
  { id: 'golden', name: 'Golden yellow', hex: '#D6A83A', group: 'Accents', family: 'warm', depth: 1, verdict: 'good', source: 'report' },
  { id: 'copper', name: 'Copper', hex: '#A8623A', group: 'Accents', family: 'warm', depth: 2, verdict: 'good', source: 'report', note: 'Mostly metals: watch case, buckle, bracelet.' },
  // Report: Evening
  { id: 'deep-brown', name: 'Deep warm brown', hex: '#3E2A1E', group: 'Evening', family: 'neutral', depth: 3, verdict: 'core', source: 'report' },
  { id: 'auburn', name: 'Rich auburn', hex: '#7A3524', group: 'Evening', family: 'warm', depth: 3, verdict: 'good', source: 'report' },
  { id: 'dark-olive', name: 'Dark olive', hex: '#3F4326', group: 'Evening', family: 'neutral', depth: 3, verdict: 'core', source: 'report' },
  { id: 'burgundy', name: 'Warm burgundy', hex: '#6A2430', group: 'Evening', family: 'warm', depth: 3, verdict: 'core', source: 'report' },
  { id: 'bronze', name: 'Bronze', hex: '#8C6A3A', group: 'Evening', family: 'warm', depth: 2, verdict: 'good', source: 'report' },
  // My evaluation of practical extras
  { id: 'navy', name: 'Ink navy', hex: '#1E2638', group: 'Practical extras', family: 'cool', depth: 3, verdict: 'core', source: 'my-evaluation', note: 'Not in the report, but a deep, slightly warm navy behaves like a dark neutral on deep-autumn colouring. You already own a navy polo and it works: navy is dark enough that it does not wash you out. Pair it with cream, camel, tan or rust.' },
  { id: 'charcoal', name: 'Charcoal', hex: '#3A3A3C', group: 'Practical extras', family: 'cool', depth: 3, verdict: 'good', source: 'my-evaluation', note: 'Excellent for trousers and suits. Away from the face it is neutral; near the face warm it with a cream or tan shirt and brown leather.' },
  { id: 'forest', name: 'Forest green', hex: '#2F4A35', group: 'Practical extras', family: 'neutral', depth: 3, verdict: 'core', source: 'my-evaluation', note: 'The report lists forest under "Greens". Great for knits, kurtas and overshirts.' },
  { id: 'warm-white', name: 'Warm white / ecru', hex: '#F4EFE3', group: 'Practical extras', family: 'neutral', depth: 1, verdict: 'core', source: 'my-evaluation', note: 'Softer than optic white. Use it for shirts and linen.' },
  { id: 'white', name: 'Optic white', hex: '#FFFFFF', group: 'Practical extras', family: 'cool', depth: 1, verdict: 'good', source: 'my-evaluation', note: 'Fine for sneakers, formal shirts and tees under layers. As a large field next to the face, ecru is kinder.' },
  { id: 'indigo', name: 'Dark indigo denim', hex: '#26324F', group: 'Practical extras', family: 'cool', depth: 3, verdict: 'core', source: 'my-evaluation', note: 'Dark, clean denim is a neutral. Avoid heavy fades and whiskering at the thighs.' },
  { id: 'mid-denim', name: 'Mid-blue denim', hex: '#4A6A8F', group: 'Practical extras', family: 'cool', depth: 2, verdict: 'good', source: 'my-evaluation', note: 'Casual weekend only. Chambray and denim shirts in this shade are fine.' },
  { id: 'tan', name: 'Tan', hex: '#A8774A', group: 'Practical extras', family: 'neutral', depth: 2, verdict: 'core', source: 'my-evaluation', note: 'Leather colour: belts, loafers, watch straps. Also a strong chino and knit colour.' },
  { id: 'brown', name: 'Mid brown', hex: '#6B4430', group: 'Practical extras', family: 'neutral', depth: 3, verdict: 'core', source: 'my-evaluation', note: 'The default leather colour for you.' },
  { id: 'taupe', name: 'Taupe', hex: '#8E7F6E', group: 'Practical extras', family: 'neutral', depth: 2, verdict: 'good', source: 'my-evaluation' },
  { id: 'stone', name: 'Stone', hex: '#BDB3A1', group: 'Practical extras', family: 'neutral', depth: 1, verdict: 'good', source: 'my-evaluation' },
  { id: 'black', name: 'Black', hex: '#151515', group: 'Practical extras', family: 'cool', depth: 3, verdict: 'caution', source: 'my-evaluation', note: 'Usable for evening, formal shoes and a tux, but harsher than chocolate or navy on warm colouring. Never make it your default.' },
  { id: 'grey', name: 'Light heather grey', hex: '#B9B9BB', group: 'Practical extras', family: 'cool', depth: 1, verdict: 'caution', source: 'my-evaluation', note: 'Cool and flat near warm skin. Fine for gym and lounge wear.' },
  { id: 'gold-metal', name: 'Gold-tone metal', hex: '#C8A456', group: 'Practical extras', family: 'warm', depth: 2, verdict: 'core', source: 'report', note: 'The report recommends warm metals (gold, bronze) over silver.' },
  { id: 'silver-metal', name: 'Silver-tone metal', hex: '#B8BCC2', group: 'Practical extras', family: 'cool', depth: 1, verdict: 'caution', source: 'my-evaluation', note: 'The report contradicts itself: it recommends warm metals, but several of its looks suggest a silver-tone watch. Steel is acceptable on a sports or smart watch. For jewellery, prefer gold or bronze.' },
  { id: 'pastel-pink', name: 'Pastel pink', hex: '#F2C4CE', group: 'Practical extras', family: 'cool', depth: 1, verdict: 'avoid', source: 'my-evaluation', note: 'Icy pastels drain warm, deep colouring. Choose coral or terracotta instead.' },
  { id: 'icy-blue', name: 'Icy light blue', hex: '#CFE3F2', group: 'Practical extras', family: 'cool', depth: 1, verdict: 'caution', source: 'my-evaluation', note: 'The classic office-shirt colour. Prefer a warmer, slightly deeper blue (chambray) or ecru.' },
];

export const colourById = Object.fromEntries(colours.map((c) => [c.id, c])) as Record<string, Colour>;

export const paletteGroups = ['Neutrals', 'Mains', 'Accents', 'Evening', 'Practical extras'] as const;
