import type { Brand } from './types';

/**
 * Research status: brand positioning below is general market knowledge, not a verified catalogue.
 * Prices are tier-level bands, not product prices. Size ranges, store locations and product links
 * have NOT been verified — every entry carries lastVerified: null until checked on the official site.
 */
export const BRAND_RESEARCH = {
  lastVerified: '2026-11-11' as string | null,
  status: 'Prices, style counts, sizes in stock and ratings were read live from Myntra men\'s listings on 11 Nov 2026 (first results page per brand and category, so ranges are indicative). Positioning and fit notes remain general guidance. Size charts and product links are not yet verified.',
};

export interface MyntraRow { cat: string; styles: number; min: number; median: number; max: number; bigSizes: string; rating: number | null }
/** Live Myntra snapshot, 11 Nov 2026. Empty array = brand not listed on Myntra at that date. */
export const myntra: Record<string, MyntraRow[]> = {
 "ralph-lauren": [
  {
   "cat": "Shirts",
   "styles": 227,
   "min": 12000,
   "median": 20000,
   "max": 26000,
   "bigSizes": "XXL/44/46",
   "rating": null
  },
  {
   "cat": "T-shirts & polos",
   "styles": 310,
   "min": 11400,
   "median": 18500,
   "max": 34500,
   "bigSizes": "XXL",
   "rating": null
  }
 ],
 "lacoste": [
  {
   "cat": "T-shirts & polos",
   "styles": 906,
   "min": 1913,
   "median": 5213,
   "max": 10750,
   "bigSizes": "XXL/4XL",
   "rating": 4.69
  },
  {
   "cat": "Shirts",
   "styles": 109,
   "min": 4800,
   "median": 9950,
   "max": 20000,
   "bigSizes": "44/46",
   "rating": 4.12
  }
 ],
 "tommy": [
  {
   "cat": "Shirts",
   "styles": 1753,
   "min": 1455,
   "median": 3430,
   "max": 6299,
   "bigSizes": "44/46",
   "rating": 4.3
  },
  {
   "cat": "T-shirts & polos",
   "styles": 5414,
   "min": 632,
   "median": 795,
   "max": 2810,
   "bigSizes": "XXL",
   "rating": 4.5
  },
  {
   "cat": "Trousers",
   "styles": 539,
   "min": 1599,
   "median": 4000,
   "max": 7829,
   "bigSizes": "48",
   "rating": 4.19
  }
 ],
 "ck": [
  {
   "cat": "Jeans",
   "styles": 4311,
   "min": 2599,
   "median": 3587,
   "max": 7199,
   "bigSizes": "XXL",
   "rating": 4.11
  },
  {
   "cat": "T-shirts",
   "styles": 1987,
   "min": 1499,
   "median": 3422,
   "max": 6299,
   "bigSizes": "XXL",
   "rating": 4.13
  }
 ],
 "selected": [
  {
   "cat": "Shirts",
   "styles": 360,
   "min": 1799,
   "median": 2699,
   "max": 5499,
   "bigSizes": "44/46",
   "rating": 4.36
  },
  {
   "cat": "Blazers",
   "styles": 40,
   "min": 5399,
   "median": 7799,
   "max": 14999,
   "bigSizes": "46/48/50",
   "rating": 3.52
  },
  {
   "cat": "Trousers",
   "styles": 178,
   "min": 2399,
   "median": 3599,
   "max": 6999,
   "bigSizes": "46",
   "rating": 4.38
  }
 ],
 "mango": [
  {
   "cat": "Shirts",
   "styles": 509,
   "min": 1716,
   "median": 2794,
   "max": 7400,
   "bigSizes": "46",
   "rating": 4.31
  },
  {
   "cat": "Trousers",
   "styles": 388,
   "min": 1716,
   "median": 4990,
   "max": 6490,
   "bigSizes": "",
   "rating": 4.07
  }
 ],
 "hm": [
  {
   "cat": "Shirts",
   "styles": 435,
   "min": 1399,
   "median": 1799,
   "max": 2999,
   "bigSizes": "44/46",
   "rating": null
  },
  {
   "cat": "Trousers",
   "styles": 531,
   "min": 1029,
   "median": 1999,
   "max": 3999,
   "bigSizes": "XXL",
   "rating": null
  }
 ],
 "ms": [
  {
   "cat": "Shirts",
   "styles": 904,
   "min": 899,
   "median": 1619,
   "max": 2659,
   "bigSizes": "XXL/44/46",
   "rating": 4.17
  },
  {
   "cat": "Trousers",
   "styles": 965,
   "min": 719,
   "median": 1499,
   "max": 2717,
   "bigSizes": "",
   "rating": 4.26
  }
 ],
 "gap": [
  {
   "cat": "T-shirts",
   "styles": 1706,
   "min": 479,
   "median": 649,
   "max": 844,
   "bigSizes": "",
   "rating": 4.54
  },
  {
   "cat": "Trousers",
   "styles": 1260,
   "min": 913,
   "median": 1218,
   "max": 1624,
   "bigSizes": "",
   "rating": 4.61
  },
  {
   "cat": "Jeans",
   "styles": 579,
   "min": 927,
   "median": 1288,
   "max": 1799,
   "bigSizes": "",
   "rating": 4.52
  }
 ],
 "jj": [
  {
   "cat": "Jeans",
   "styles": 955,
   "min": 989,
   "median": 1819,
   "max": 4249,
   "bigSizes": "",
   "rating": 4.28
  },
  {
   "cat": "Shirts",
   "styles": 1644,
   "min": 989,
   "median": 1385,
   "max": 1799,
   "bigSizes": "44/46",
   "rating": 4.38
  }
 ],
 "rare-rabbit": [
  {
   "cat": "Shirts",
   "styles": 2748,
   "min": 1019,
   "median": 1483,
   "max": 1875,
   "bigSizes": "44/46/48",
   "rating": 4.29
  },
  {
   "cat": "Trousers",
   "styles": 631,
   "min": 1019,
   "median": 2210,
   "max": 6499,
   "bigSizes": "",
   "rating": 4.09
  },
  {
   "cat": "T-shirts & polos",
   "styles": 1680,
   "min": 674,
   "median": 1979,
   "max": 3299,
   "bigSizes": "XXL",
   "rating": 4.35
  }
 ],
 "blackberrys": [
  {
   "cat": "Shirts",
   "styles": 1522,
   "min": 1055,
   "median": 1259,
   "max": 1439,
   "bigSizes": "44",
   "rating": 4.46
  },
  {
   "cat": "Trousers",
   "styles": 1545,
   "min": 988,
   "median": 1463,
   "max": 1559,
   "bigSizes": "",
   "rating": 4.23
  },
  {
   "cat": "Blazers",
   "styles": 275,
   "min": 5999,
   "median": 7999,
   "max": 14739,
   "bigSizes": "50",
   "rating": 4.01
  }
 ],
 "lp": [
  {
   "cat": "Shirts",
   "styles": 6332,
   "min": 1172,
   "median": 1379,
   "max": 2549,
   "bigSizes": "44",
   "rating": 4.29
  },
  {
   "cat": "Trousers",
   "styles": 1866,
   "min": 1425,
   "median": 1663,
   "max": 3826,
   "bigSizes": "44",
   "rating": 4.28
  },
  {
   "cat": "Blazers",
   "styles": 215,
   "min": 4689,
   "median": 6541,
   "max": 12459,
   "bigSizes": "44/46/48",
   "rating": 4.02
  }
 ],
 "van-heusen": [
  {
   "cat": "Shirts",
   "styles": 6422,
   "min": 1149,
   "median": 1279,
   "max": 1379,
   "bigSizes": "",
   "rating": 4.43
  },
  {
   "cat": "Trousers",
   "styles": 1534,
   "min": 999,
   "median": 1443,
   "max": 2313,
   "bigSizes": "",
   "rating": 4.19
  },
  {
   "cat": "Blazers",
   "styles": 289,
   "min": 2899,
   "median": 4674,
   "max": 8454,
   "bigSizes": "44/46/48/50",
   "rating": 3.9
  }
 ],
 "allen-solly": [
  {
   "cat": "Shirts",
   "styles": 6616,
   "min": 619,
   "median": 1133,
   "max": 1379,
   "bigSizes": "XXL",
   "rating": 4.55
  },
  {
   "cat": "Trousers",
   "styles": 2029,
   "min": 854,
   "median": 1402,
   "max": 1627,
   "bigSizes": "",
   "rating": 4.24
  },
  {
   "cat": "T-shirts & polos",
   "styles": 3040,
   "min": 455,
   "median": 719,
   "max": 911,
   "bigSizes": "XXL",
   "rating": 4.46
  }
 ],
 "peter-england": [
  {
   "cat": "Shirts",
   "styles": 4078,
   "min": 799,
   "median": 1133,
   "max": 1356,
   "bigSizes": "44/46",
   "rating": 4.36
  },
  {
   "cat": "Trousers",
   "styles": 1438,
   "min": 1079,
   "median": 1259,
   "max": 1779,
   "bigSizes": "",
   "rating": 4.28
  }
 ],
 "indian-terrain": [
  {
   "cat": "Trousers",
   "styles": 656,
   "min": 999,
   "median": 1299,
   "max": 1549,
   "bigSizes": "",
   "rating": 4.31
  },
  {
   "cat": "Shirts",
   "styles": 2015,
   "min": 957,
   "median": 1199,
   "max": 1399,
   "bigSizes": "44/46",
   "rating": 4.06
  }
 ],
 "andamen": [
  {
   "cat": "T-shirts & polos",
   "styles": 270,
   "min": 1599,
   "median": 2625,
   "max": 3999,
   "bigSizes": "XXL",
   "rating": 4.31
  },
  {
   "cat": "Shirts",
   "styles": 759,
   "min": 2625,
   "median": 4590,
   "max": 6599,
   "bigSizes": "44/46",
   "rating": 4.39
  }
 ],
 "bear-house": [
  {
   "cat": "Shirts",
   "styles": 1882,
   "min": 730,
   "median": 873,
   "max": 1349,
   "bigSizes": "44/46/48",
   "rating": 4.33
  },
  {
   "cat": "Trousers",
   "styles": 361,
   "min": 730,
   "median": 978,
   "max": 1679,
   "bigSizes": "",
   "rating": 4.14
  }
 ],
 "snitch": [
  {
   "cat": "Shirts",
   "styles": 3426,
   "min": 599,
   "median": 999,
   "max": 1365,
   "bigSizes": "44/46",
   "rating": 4.42
  },
  {
   "cat": "Trousers",
   "styles": 1006,
   "min": 959,
   "median": 1146,
   "max": 1512,
   "bigSizes": "",
   "rating": 4.21
  }
 ],
 "raymond": [
  {
   "cat": "Blazers",
   "styles": 84,
   "min": 3749,
   "median": 4589,
   "max": 12642,
   "bigSizes": "44/46/48",
   "rating": 4.08
  },
  {
   "cat": "Trousers",
   "styles": 897,
   "min": 989,
   "median": 1149,
   "max": 1439,
   "bigSizes": "",
   "rating": 4.21
  },
  {
   "cat": "Shirts",
   "styles": 1638,
   "min": 839,
   "median": 1049,
   "max": 1274,
   "bigSizes": "44/46",
   "rating": 4.38
  }
 ],
 "manyavar": [
  {
   "cat": "Kurtas",
   "styles": 1134,
   "min": 799,
   "median": 1199,
   "max": 1299,
   "bigSizes": "XXL",
   "rating": 4.45
  },
  {
   "cat": "Nehru jackets",
   "styles": 541,
   "min": 2624,
   "median": 3999,
   "max": 12999,
   "bigSizes": "XXL/3XL",
   "rating": 4.31
  }
 ],
 "fabindia": [
  {
   "cat": "Kurtas",
   "styles": 1765,
   "min": 671,
   "median": 959,
   "max": 1639,
   "bigSizes": "XXL",
   "rating": 4.39
  },
  {
   "cat": "Shirts",
   "styles": 1193,
   "min": 559,
   "median": 1189,
   "max": 1393,
   "bigSizes": "44/46/48",
   "rating": 4.51
  }
 ],
 "massimo-dutti": [],
 "brooks": [],
 "zara": [],
 "uniqlo": [],
 "muji": [],
 "westside": []
};

export const brands: Brand[] = [
  { id: 'massimo-dutti', name: 'Massimo Dutti', origin: 'International', tier: 'Premium', positioning: 'Inditex group\'s elevated label. Refined, quiet-luxury basics.', categories: ['shirts', 'knits', 'bottoms', 'outerwear'], bestKnown: ['Linen shirts', 'Knitwear', 'Blazers', 'Suede jackets'], quality: 'Good fabrics for the price tier', fit: 'European slim-leaning; check the regular-fit options', price: '₹₹₹ (premium high-street)', sizes: 'Research pending', alterations: 'Research pending', online: 'Research pending', stores: 'Research pending', bestFor: ['linen-shirts', 'blazers', 'knitwear'] },
  { id: 'ralph-lauren', name: 'Ralph Lauren', origin: 'International', tier: 'Premium', positioning: 'American classic: preppy, the "old money" reference.', categories: ['shirts', 'knits', 'bottoms', 'outerwear'], bestKnown: ['Polo shirts', 'Oxford shirts', 'Chinos', 'Cable knits'], quality: 'Generally high', fit: 'Classic fit is roomier; Custom/Slim fits are narrow', price: '₹₹₹', sizes: 'Research pending', alterations: 'Research pending', online: 'Research pending', stores: 'Research pending', bestFor: ['polos', 'oxford-shirts'] },
  { id: 'lacoste', name: 'Lacoste', origin: 'International', tier: 'Premium', positioning: 'French sportswear heritage, the original pique polo.', categories: ['knits', 'shirts', 'footwear'], bestKnown: ['Pique polos', 'Leather sneakers'], quality: 'High for polos', fit: 'Classic fit vs slim fit — sizing is numeric (2–8) in some lines', price: '₹₹₹', sizes: 'Research pending', alterations: '—', online: 'Research pending', stores: 'Research pending', bestFor: ['polos'] },
  { id: 'tommy', name: 'Tommy Hilfiger', origin: 'International', tier: 'Premium', positioning: 'American preppy, logo-forward casualwear.', categories: ['shirts', 'knits', 'bottoms'], bestKnown: ['Polos', 'Oxford shirts', 'Chinos'], quality: 'Mid-to-good', fit: 'Regular and slim options', price: '₹₹–₹₹₹', sizes: 'Research pending', alterations: '—', online: 'Research pending', stores: 'Research pending', bestFor: ['polos', 'chinos'] },
  { id: 'ck', name: 'Calvin Klein', origin: 'International', tier: 'Premium', positioning: 'American minimalism; denim and basics.', categories: ['knits', 'bottoms'], bestKnown: ['Jeans', 'T-shirts'], quality: 'Mid-to-good', fit: 'Leans slim', price: '₹₹–₹₹₹', sizes: 'Research pending', alterations: '—', online: 'Research pending', stores: 'Research pending', bestFor: ['jeans'] },
  { id: 'brooks', name: 'Brooks Brothers', origin: 'International', tier: 'Premium', positioning: 'American tailoring heritage; inventor of the button-down collar.', categories: ['shirts', 'bottoms', 'outerwear', 'occasion'], bestKnown: ['OCBD shirts', 'Non-iron shirts', 'Suits'], quality: 'High', fit: 'Regent (tailored) / Madison (classic, roomy) — Madison likely suits you better', price: '₹₹₹', sizes: 'Research pending', alterations: 'Research pending', online: 'Research pending', stores: 'Research pending', bestFor: ['oxford-shirts', 'formal-trousers'] },
  { id: 'selected', name: 'Selected Homme', origin: 'International', tier: 'Mid-range', positioning: 'Danish (Bestseller group) smart-casual minimalism.', categories: ['shirts', 'outerwear', 'bottoms'], bestKnown: ['Blazers', 'Linen shirts', 'Trousers'], quality: 'Good', fit: 'Slim-leaning Scandinavian', price: '₹₹–₹₹₹', sizes: 'Research pending', alterations: '—', online: 'Research pending', stores: 'Research pending', bestFor: ['blazers', 'linen-shirts'] },
  { id: 'mango', name: 'Mango Man', origin: 'International', tier: 'Mid-range', positioning: 'Spanish high-street with a refined Mediterranean edge.', categories: ['shirts', 'knits', 'bottoms', 'outerwear'], bestKnown: ['Linen shirts', 'Pleated trousers', 'Knit polos'], quality: 'Mid', fit: 'Slim and regular; pleated trousers worth trying', price: '₹₹', sizes: 'Research pending', alterations: '—', online: 'Research pending', stores: 'Research pending', bestFor: ['linen-shirts', 'formal-trousers', 'polos'] },
  { id: 'hm', name: 'H&M', origin: 'International', tier: 'Value', positioning: 'Swedish fast fashion; basics and trend pieces.', categories: ['shirts', 'knits', 'bottoms', 'outerwear'], bestKnown: ['Basics', 'Linen-blend shirts'], quality: 'Variable — check composition', fit: 'Regular, Relaxed and Slim labelled clearly', price: '₹–₹₹', sizes: 'Research pending', alterations: '—', online: 'Research pending', stores: 'Research pending', bestFor: ['tees', 'linen-shirts'] },
  { id: 'zara', name: 'Zara', origin: 'International', tier: 'Mid-range', positioning: 'Inditex trend-led high-street.', categories: ['shirts', 'knits', 'bottoms', 'outerwear'], bestKnown: ['Overshirts', 'Textured shirts', 'Trend pieces'], quality: 'Variable', fit: 'Runs slim; size up and check', price: '₹₹', sizes: 'Research pending', alterations: '—', online: 'Research pending', stores: 'Research pending', bestFor: ['overshirts'] },
  { id: 'uniqlo', name: 'Uniqlo', origin: 'International', tier: 'Mid-range', positioning: 'Japanese technical basics — "LifeWear".', categories: ['shirts', 'knits', 'bottoms', 'outerwear'], bestKnown: ['Oxford shirts', 'Heavyweight tees (U line)', 'Merino knits', 'Smart ankle pants', 'Linen shirts'], quality: 'Very good value', fit: 'Generally roomy; consistent sizing', price: '₹₹', sizes: 'Research pending (larger sizes often online-only)', alterations: 'Research pending', online: 'Research pending', stores: 'Research pending', bestFor: ['oxford-shirts', 'tees', 'knitwear', 'linen-shirts', 'chinos'] },
  { id: 'ms', name: 'Marks & Spencer', origin: 'International', tier: 'Mid-range', positioning: 'British classic, comfort-first.', categories: ['shirts', 'bottoms', 'knits'], bestKnown: ['Easy-iron shirts', 'Chinos', 'Trousers with stretch'], quality: 'Reliable', fit: 'Regular fits are generous', price: '₹₹', sizes: 'Research pending', alterations: '—', online: 'Research pending', stores: 'Research pending', bestFor: ['chinos', 'formal-trousers'] },
  { id: 'gap', name: 'GAP', origin: 'International', tier: 'Mid-range', positioning: 'American casual basics.', categories: ['knits', 'bottoms'], bestKnown: ['Chinos (khakis)', 'Denim', 'Tees'], quality: 'Mid', fit: 'Straight and relaxed options', price: '₹₹', sizes: 'Research pending', alterations: '—', online: 'Research pending', stores: 'Research pending', bestFor: ['chinos', 'jeans'] },
  { id: 'jj', name: 'Jack & Jones', origin: 'International', tier: 'Value', positioning: 'Danish (Bestseller) denim-led casualwear.', categories: ['bottoms', 'knits', 'shirts'], bestKnown: ['Jeans', 'Casual shirts'], quality: 'Mid', fit: 'Fit names (e.g. slim vs regular) vary by line', price: '₹–₹₹', sizes: 'Research pending', alterations: '—', online: 'Research pending', stores: 'Research pending', bestFor: ['jeans'] },
  { id: 'muji', name: 'Muji', origin: 'International', tier: 'Mid-range', positioning: 'Japanese no-brand minimalism; natural fibres.', categories: ['shirts', 'knits'], bestKnown: ['Linen shirts', 'Organic cotton basics'], quality: 'Good', fit: 'Relaxed', price: '₹₹', sizes: 'Research pending', alterations: '—', online: 'Research pending', stores: 'Research pending', bestFor: ['linen-shirts'] },
  { id: 'rare-rabbit', name: 'Rare Rabbit', origin: 'Indian', tier: 'Mid-range', positioning: 'Indian premium casual shirts; texture and print.', categories: ['shirts', 'knits', 'bottoms'], bestKnown: ['Textured & printed shirts', 'Linen shirts'], quality: 'Good', fit: 'Slim-leaning; check regular fit', price: '₹₹', sizes: 'Research pending', alterations: '—', online: 'Research pending', stores: 'Research pending', bestFor: ['linen-shirts', 'printed-shirts'] },
  { id: 'blackberrys', name: 'Blackberrys', origin: 'Indian', tier: 'Mid-range', positioning: 'Indian formal and occasion wear.', categories: ['shirts', 'bottoms', 'outerwear', 'occasion'], bestKnown: ['Suits', 'Blazers', 'Formal trousers'], quality: 'Good', fit: 'Slim and comfort fits', price: '₹₹', sizes: 'Research pending', alterations: 'Research pending (many formal brands offer in-store alteration)', online: 'Research pending', stores: 'Research pending', bestFor: ['blazers', 'formal-trousers', 'suits'] },
  { id: 'lp', name: 'Louis Philippe', origin: 'Indian', tier: 'Mid-range', positioning: 'Indian (Aditya Birla) premium formalwear.', categories: ['shirts', 'bottoms', 'outerwear', 'occasion'], bestKnown: ['Formal shirts', 'Suits'], quality: 'Good', fit: 'Multiple fits — ask for regular/comfort', price: '₹₹', sizes: 'Research pending', alterations: 'Research pending', online: 'Research pending', stores: 'Research pending', bestFor: ['formal-shirts', 'suits'] },
  { id: 'van-heusen', name: 'Van Heusen', origin: 'Indian', tier: 'Mid-range', positioning: 'Indian (Aditya Birla) office wear.', categories: ['shirts', 'bottoms', 'outerwear'], bestKnown: ['Office shirts', 'Trousers', 'Blazers'], quality: 'Reliable', fit: 'Slim and regular', price: '₹–₹₹', sizes: 'Research pending', alterations: 'Research pending', online: 'Research pending', stores: 'Research pending', bestFor: ['formal-shirts', 'formal-trousers'] },
  { id: 'allen-solly', name: 'Allen Solly', origin: 'Indian', tier: 'Value', positioning: 'Indian (Aditya Birla) "Friday dressing" business casual.', categories: ['shirts', 'knits', 'bottoms'], bestKnown: ['Casual office shirts', 'Chinos', 'Polos'], quality: 'Mid', fit: 'Slim and regular', price: '₹–₹₹', sizes: 'Research pending', alterations: '—', online: 'Research pending', stores: 'Research pending', bestFor: ['chinos', 'polos'] },
  { id: 'peter-england', name: 'Peter England', origin: 'Indian', tier: 'Value', positioning: 'Indian (Aditya Birla) value formalwear.', categories: ['shirts', 'bottoms'], bestKnown: ['Formal shirts', 'Trousers'], quality: 'Mid', fit: 'Regular available', price: '₹', sizes: 'Research pending', alterations: '—', online: 'Research pending', stores: 'Research pending', bestFor: ['formal-shirts'] },
  { id: 'indian-terrain', name: 'Indian Terrain', origin: 'Indian', tier: 'Value', positioning: 'Indian casualwear; chinos specialist.', categories: ['bottoms', 'shirts'], bestKnown: ['Chinos', 'Casual shirts'], quality: 'Mid', fit: 'Comfort fit options', price: '₹–₹₹', sizes: 'Research pending', alterations: '—', online: 'Research pending', stores: 'Research pending', bestFor: ['chinos'] },
  { id: 'andamen', name: 'Andamen', origin: 'Indian', tier: 'Premium', positioning: 'Indian premium polos and shirts; fabric-forward.', categories: ['knits', 'shirts'], bestKnown: ['Polos', 'Shirts'], quality: 'High (positioning)', fit: 'Research pending', price: '₹₹–₹₹₹', sizes: 'Research pending', alterations: '—', online: 'Research pending', stores: 'Research pending', bestFor: ['polos'] },
  { id: 'bear-house', name: 'The Bear House', origin: 'Indian', tier: 'Value', positioning: 'Indian D2C shirts and casualwear.', categories: ['shirts', 'knits'], bestKnown: ['Casual shirts', 'Linen-blend shirts'], quality: 'Mid', fit: 'Slim and regular', price: '₹', sizes: 'Research pending', alterations: '—', online: 'Research pending', stores: 'Research pending', bestFor: ['linen-shirts'] },
  { id: 'snitch', name: 'Snitch', origin: 'Indian', tier: 'Value', positioning: 'Indian trend-led D2C fast fashion.', categories: ['shirts', 'bottoms'], bestKnown: ['Trend shirts', 'Cargo'], quality: 'Variable', fit: 'Slim/trend; check measurements', price: '₹', sizes: 'Research pending', alterations: '—', online: 'Research pending', stores: 'Research pending', bestFor: ['printed-shirts'] },
  { id: 'westside', name: 'Westside', origin: 'Indian', tier: 'Value', positioning: 'Tata Trent in-house fashion; Indian and Western.', categories: ['shirts', 'bottoms', 'occasion'], bestKnown: ['Kurtas', 'Casual shirts'], quality: 'Mid', fit: 'Regular', price: '₹', sizes: 'Research pending', alterations: '—', online: 'Research pending', stores: 'Research pending', bestFor: ['kurtas'] },
  { id: 'raymond', name: 'Raymond', origin: 'Indian', tier: 'Mid-range', positioning: 'Indian suiting fabric house; tailoring and made-to-measure.', categories: ['occasion', 'bottoms', 'outerwear'], bestKnown: ['Suiting fabric', 'Made-to-measure suits', 'Bandhgala'], quality: 'Good', fit: 'Made-to-measure available', price: '₹₹–₹₹₹', sizes: 'MTM', alterations: 'Research pending', online: 'Research pending', stores: 'Research pending', bestFor: ['suits', 'formal-trousers', 'kurtas'] },
  { id: 'manyavar', name: 'Manyavar', origin: 'Indian', tier: 'Mid-range', positioning: 'Indian celebration and wedding wear.', categories: ['occasion'], bestKnown: ['Kurta sets', 'Nehru jackets', 'Sherwanis'], quality: 'Good', fit: 'Regular', price: '₹₹', sizes: 'Research pending', alterations: 'Research pending', online: 'Research pending', stores: 'Research pending', bestFor: ['kurtas', 'nehru'] },
  { id: 'fabindia', name: 'Fabindia', origin: 'Indian', tier: 'Mid-range', positioning: 'Indian handloom and natural-fibre ethnic wear.', categories: ['occasion', 'shirts'], bestKnown: ['Cotton & linen kurtas', 'Nehru jackets'], quality: 'Good natural fibres', fit: 'Relaxed', price: '₹–₹₹', sizes: 'Research pending', alterations: '—', online: 'Research pending', stores: 'Research pending', bestFor: ['kurtas', 'nehru'] },
];

export const bestForTables: { key: string; label: string }[] = [
  { key: 'linen-shirts', label: 'Linen shirts' },
  { key: 'oxford-shirts', label: 'Oxford shirts' },
  { key: 'polos', label: 'Polos' },
  { key: 'chinos', label: 'Chinos' },
  { key: 'jeans', label: 'Jeans' },
  { key: 'blazers', label: 'Blazers' },
  { key: 'formal-trousers', label: 'Formal trousers' },
  { key: 'formal-shirts', label: 'Formal shirts' },
  { key: 'suits', label: 'Suits' },
  { key: 'knitwear', label: 'Knitwear' },
  { key: 'tees', label: 'T-shirts' },
  { key: 'kurtas', label: 'Indian occasion wear (kurtas)' },
  { key: 'nehru', label: 'Nehru jackets' },
  { key: 'printed-shirts', label: 'Printed shirts' },
  { key: 'overshirts', label: 'Overshirts' },
];
