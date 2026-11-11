export type Slot = 'top' | 'bottom' | 'footwear' | 'outer' | 'accessory';
export type Season = 'summer' | 'monsoon' | 'winter' | 'transitional';
export type Ownership = 'OWNED' | 'NOT_OWNED' | 'WANT' | 'PLANNED' | 'NOT_INTERESTED';
export type Verdict = 'core' | 'good' | 'caution' | 'avoid';

export interface Colour {
  id: string;
  name: string;
  hex: string;
  group: 'Neutrals' | 'Mains' | 'Accents' | 'Evening' | 'Practical extras';
  family: 'neutral' | 'warm' | 'cool';
  depth: 1 | 2 | 3; // 1 light, 2 mid, 3 dark
  verdict: Verdict;
  source: 'report' | 'my-evaluation';
  note?: string;
}

/** A component kind: the "thing" an outfit needs, e.g. Oxford shirt. Combined with a colour it becomes a Piece. */
export interface Kind {
  id: string;
  label: string;
  slot: Slot;
  wardrobe: string; // wardrobe sub-category, e.g. "Oxford shirts"
  formality: 1 | 2 | 3 | 4 | 5;
  fabric: string; // fabric id
  seasons: Season[];
  academy?: string; // garment type id in the academy
  body?: 'flattering' | 'neutral' | 'careful'; // for my current shape
  bodyNote?: string;
  shape?: 'tee' | 'polo' | 'shirt' | 'shirt-band' | 'henley' | 'knit' | 'hoodie' | 'kurta' | 'turtleneck';
  outerShape?: 'blazer' | 'jacket' | 'overshirt' | 'cardigan' | 'nehru' | 'coat';
  legShape?: 'straight' | 'tapered' | 'relaxed' | 'shorts' | 'jogger';
  estPrice: number; // indicative mid-market INR, unverified
  detail?: string; // exact pattern / construction wording used in image prompts
  wornClosed?: boolean; // outer layer worn buttoned (e.g. a bandhgala)
}

export interface Piece {
  id: string; // `${kind}:${colour}`
  kind: Kind;
  colour: Colour;
  name: string;
}

export interface Outfit {
  id: string;
  collection: string;
  name: string;
  top: string;
  bottom: string;
  footwear: string;
  outer?: string;
  required: string[]; // required accessories (e.g. belt)
  optional: string[];
  occasions: string[];
  seasons: Season[];
  weather: string;
  impression: string[];
  difficulty: 1 | 2 | 3;
  price: '₹' | '₹₹' | '₹₹₹';
  why: string;
  source?: 'report' | 'photo' | 'catalogue';
}

export interface Fabric {
  id: string;
  name: string;
  type: 'Natural fibre' | 'Synthetic fibre' | 'Blend';
  what: string;
  feel: string;
  breathability: number; // 1-5
  moisture: number; // absorption 1-5
  drying: number; // speed 1-5 (5 fast)
  wrinkle: number; // resistance 1-5 (5 resists)
  heatRetention: number; // 1-5
  weight: string;
  layering: string;
  iron: 'No' | 'Optional' | 'Yes' | 'Always';
  steam: string;
  heat: 'Low' | 'Medium' | 'High' | 'None';
  machineWash: string;
  shrink: string;
  shape: string;
  travel: string;
  dryClean: string;
  storage: string;
  bengaluru: string;
  pilling?: string;
  fading?: string;
}

export interface GarmentType {
  id: string;
  cat: 'shirts' | 'knits' | 'bottoms' | 'outerwear' | 'occasion';
  name: string;
  definition: string;
  looks: string;
  construction: string;
  fabrics: string[];
  formality: number;
  body: string;
  colours: string[];
  where: string[];
  avoid: string[];
  mistakes: string[];
  verdict: string;
  price: string;
  kind?: string; // linked component kind for outfit generation
  collars?: string[];
  sleeves?: string[];
  fits?: string[];
  lengths?: string[];
  trousers?: string[];
  footwear?: string[];
  accessories?: string[];
  tuck?: string;
  roll?: string;
  layer?: string;
  priority?: 'Essential' | 'High priority' | 'Useful addition' | 'Optional' | 'Avoid buying';
}

export interface Brand {
  id: string;
  name: string;
  origin: 'Indian' | 'International';
  tier: 'Value' | 'Mid-range' | 'Premium';
  positioning: string;
  categories: string[];
  bestKnown: string[];
  quality: string;
  fit: string;
  price: string;
  sizes: string;
  alterations: string;
  online: string;
  stores: string;
  bestFor: string[]; // comparison table keys
}

export interface Occasion {
  id: string;
  group: 'Everyday and casual' | 'Dates and relationships' | 'Professional' | 'Travel' | 'Traditional and festive';
  name: string;
  formality: [number, number];
  tags: string[]; // outfit occasion tags this occasion draws from
  clothing: string;
  avoid: string;
  colours: string[];
  fabrics: string;
  footwear: string;
  accessories: string;
  grooming: string;
  fragrance: string;
  note?: string;
}

export interface Impression {
  id: string;
  name: string;
  colours: string[];
  garments: string;
  fabrics: string;
  accessories: string;
  grooming: string;
  footwear: string;
  occasions: string;
  avoid: string;
  why: string;
}

export interface WardrobeItem {
  id: string;
  name: string;
  slot: Slot;
  category: string;
  subcategory?: string;
  kindId?: string;
  colourId?: string;
  brand?: string;
  productName?: string;
  colourText?: string;
  secondaryColour?: string;
  fabric?: string;
  composition?: string;
  fit?: string;
  size?: string;
  price?: number;
  purchaseDate?: string;
  condition?: string;
  lastWorn?: string;
  wearCount?: number;
  seasons?: Season[];
  occasions?: string;
  care?: string;
  wrinkle?: string;
  ironing?: string;
  url?: string;
  notes?: string;
  image?: string; // data URL, compressed
  status: Ownership;
  createdAt: number;
}

export interface WishItem {
  id: string;
  product: string;
  brand?: string;
  price?: number;
  category?: string;
  colour?: string;
  pieceId?: string;
  why?: string;
  priority: 'Essential' | 'High priority' | 'Useful addition' | 'Optional';
  bought?: boolean;
  url?: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  outfitId?: string;
  outfitText?: string;
  occasion?: string;
  feeling: number;
  notes: string;
}

export interface Measurements {
  date: string;
  height?: number;
  weight?: number;
  chest?: number;
  stomach?: number;
  waist?: number;
  hip?: number;
  shoulder?: number;
  neck?: number;
  sleeve?: number;
  arm?: number;
  thigh?: number;
  inseam?: number;
  outseam?: number;
  footLength?: number;
  footWidth?: number;
}
