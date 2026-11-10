import type { Impression, Measurements } from './types';

// ───────── Profile ─────────
export const profile = {
  name: 'Gitesh Prakash Jawale',
  city: 'Bengaluru',
  faceShape: 'Diamond',
  skinTone: 'Medium-tan brown',
  undertone: 'Warm (greenish veins, tans gradually)',
  season: 'Warm Deep Autumn',
  bodyShapeReport: 'Oval',
  bodyShapeNow: 'Oval → transitioning toward Rectangle',
  direction: 'Structured tailoring, vertical lines, balanced proportions',
  metals: 'Warm metals: gold, bronze, copper',
  photoDate: '2026-11-10',
  silhouettes: [
    'Open layers (blazer, overshirt, cardigan): two vertical lines from shoulder to hip',
    'Mid-to-high rise, straight or slim-straight trousers with a slight break',
    'Tonal or low-contrast top and bottom, to avoid a horizontal break at the waist',
    'Structure at the shoulder, drape at the stomach: never cling',
    'Untucked tops ending at mid-fly, with a straight hem',
  ],
};

export const faceMeasurements = { forehead: 8, cheekbone: 12.5, jawline: 6.5, faceLength: 8.5 };

export const measurementHistory: (Measurements & { source: string })[] = [
  { date: '2026-01-06', source: 'Style report PDF (date in the PDF metadata)', height: 73, chest: 45, stomach: 47, waist: 42.5, hip: 47 },
  { date: '2026-08-18', source: 'Health log tape baseline', weight: 115.15, chest: 46, stomach: 47, waist: 42, hip: 46, thigh: 26, arm: 14.5 },
  { date: '2026-10-10', source: 'Health log weekly check-in', weight: 110.15, chest: 44.8, stomach: 43.7, waist: 39.6, hip: 45.3, thigh: 25, arm: 14.75 },
  { date: '2026-10-31', source: 'Health log weekly check-in (latest tape)', weight: 106.9, chest: 43.5, stomach: 41.9, waist: 38.9, hip: 44.5, thigh: 25.1, arm: 15 },
];

export const latestMeasurements: Measurements = {
  date: '2026-10-31', height: 73, weight: 105.55, chest: 43.5, stomach: 41.9, waist: 38.9, hip: 44.5, thigh: 25.1, arm: 15,
};

export const measurementGuide: { key: keyof Measurements; label: string; unit: string; how: string; used: string }[] = [
  { key: 'height', label: 'Height', unit: 'in', how: 'Barefoot, back against a wall, heels together. Put a hardback book flat on your head, mark the wall and measure from the floor.', used: 'Jacket length, inseam check, rise choice' },
  { key: 'weight', label: 'Weight', unit: 'kg', how: 'Morning, after the toilet, before food or water, same scale.', used: 'Context only. Never size clothes by weight.' },
  { key: 'chest', label: 'Chest', unit: 'in', how: 'Arms relaxed down. Run the tape under the armpits, across the fullest part of the chest and the shoulder blades. Keep it level and take one finger of slack.', used: 'Shirts, tees, polos, blazers' },
  { key: 'stomach', label: 'Stomach (at navel)', unit: 'in', how: 'Around the navel, relaxed (do not suck in), tape level.', used: 'Shirt buttoning, mid-rise trousers, jacket button point' },
  { key: 'waist', label: 'Natural waist (narrowest)', unit: 'in', how: 'The narrowest point between the ribs and the navel.', used: 'High-rise trousers, tailoring reference' },
  { key: 'hip', label: 'Hip / seat', unit: 'in', how: 'Feet together, around the fullest part of the seat.', used: 'Trousers, jeans, long jackets' },
  { key: 'shoulder', label: 'Shoulder width', unit: 'in', how: 'Ask someone to help: across your back from one shoulder bone (acromion) to the other, following the curve.', used: 'Shirts and jackets. The one measurement you cannot alter.' },
  { key: 'neck', label: 'Neck', unit: 'in', how: 'Around the base of the neck where a collar sits, with one finger inside the tape.', used: 'Formal shirt collar size' },
  { key: 'sleeve', label: 'Sleeve length', unit: 'in', how: 'Arm slightly bent. From the centre back of the neck, over the shoulder point, down to the wrist bone.', used: 'Shirts and jackets' },
  { key: 'arm', label: 'Arm (bicep)', unit: 'in', how: 'Around the fullest part of the relaxed upper arm.', used: 'Short-sleeve shirts, polos, tight blazer sleeves' },
  { key: 'thigh', label: 'Thigh', unit: 'in', how: 'Around the fullest part of the upper thigh, about 1 inch below the crotch.', used: 'Trousers and jeans: the most common reason jeans do not fit' },
  { key: 'inseam', label: 'Inseam', unit: 'in', how: 'Measure a pair of trousers that fit well, from the crotch seam to the hem along the inside leg.', used: 'Trouser length' },
  { key: 'outseam', label: 'Outseam', unit: 'in', how: 'Measure well-fitting trousers from the top of the waistband to the hem along the outside.', used: 'Rise calculation' },
  { key: 'footLength', label: 'Foot length', unit: 'cm', how: 'Standing, heel against a wall. Mark the longest toe on paper. Measure in the evening, when feet are largest.', used: 'Shoe size (UK/EU vary by brand)' },
  { key: 'footWidth', label: 'Foot width', unit: 'cm', how: 'Trace the foot standing and measure across the widest part (the ball).', used: 'Width fitting (Indian feet often need wider lasts)' },
];

export const reportInconsistencies = [
  { area: 'Measurements', issue: 'The report (Jan 2026) lists chest 45, stomach 47, waist 42.5, hip 47 in. Your 31 Oct 2026 tape reads 43.5 / 41.9 / 38.9 / 44.5.', resolution: 'The site uses the 31 Oct numbers. The report\'s "Oval" label rested on the stomach being the largest measurement, which is no longer true: hip is now largest. The oval strategies (vertical lines, structure, no cling) are still correct.' },
  { area: 'Height', issue: 'The report shows height as "6.1 Feet & Inches", and there is no measured height in your logs.', resolution: 'Assumed 6 ft 1 in (73 in). Please confirm.' },
  { area: 'Metals', issue: 'The jewellery section recommends warm metals (gold, bronze), but Casual Look 2, Travel Looks 1 and 4 and Dinner Look 1 each suggest a silver-tone watch.', resolution: 'Prefer gold-tone or bronze. Steel is acceptable on sports and smart watches.' },
  { area: 'Face shape', issue: 'Dinner Look 2 says it draws attention to "your oval face". You were measured as diamond.', resolution: 'Diamond is used throughout.' },
  { area: 'Palette labels', issue: 'Several looks list palettes that do not match their clothes. Dinner Look 1 is a rust shirt but lists "cream, off-white, warm beige". Casual Look 4 is a mustard polo but lists "off-white, earthy beige, tan". Travel Looks 3 and 4 have the same problem.', resolution: 'Outfits on this site are colour-checked against their actual garments.' },
  { area: 'Dinner Look 4', issue: 'It lists a "deep aubergine shirt" (aubergine is not in your palette) and then describes a mock-neck top.', resolution: 'Substituted warm burgundy, which is in your evening palette. The mock-neck is listed separately.' },
  { area: 'City', issue: 'Casual Look 1 mentions "bustling Mumbai days". You live in Bengaluru.', resolution: 'Seasonal guidance is written for Bengaluru.' },
  { area: 'Measurements not in any source', issue: 'Shoulder width, neck, sleeve length, inseam, outseam, foot length and foot width are missing.', resolution: 'Shown as "needed" on the Body page, with instructions for measuring each one.' },
];

// ───────── Style psychology ─────────
export const impressions: (Impression & { tags: string[] })[] = [
  { id: 'mature', name: 'Mature', tags: ['mature', 'refined', 'trustworthy'], colours: ['navy', 'camel', 'chocolate', 'charcoal'], garments: 'Blazers, Oxford shirts, pleated trousers, knitted polos', fabrics: 'Wool blends, Oxford cotton, fine merino', accessories: 'Leather-strap watch, matching belt', grooming: 'Short, defined beard; neat hair', footwear: 'Loafers, derbies', occasions: 'Family meetings, office, arranged-marriage meetings', avoid: 'Graphic tees, distressed denim, neon', why: 'Darker neutrals, tailoring and leather signal consistency and investment over trend.' },
  { id: 'sophisticated', name: 'Sophisticated', tags: ['sophisticated', 'refined', 'elegant'], colours: ['burgundy', 'charcoal', 'chocolate', 'ivory'], garments: 'Knitted polos, unstructured blazers, fine knits', fabrics: 'Merino, fine twill, suede', accessories: 'Slim dress watch, pocket square', grooming: 'Rounded beard edges, styled hair', footwear: 'Suede loafers, Chelsea boots', occasions: 'Dinner dates, receptions', avoid: 'Logos, loud prints', why: 'Texture over pattern and depth over brightness read as considered and expensive.' },
  { id: 'confident', name: 'Confident', tags: ['confident', 'expressive', 'sharp'], colours: ['rust', 'teal', 'mustard', 'terracotta'], garments: 'Rust or teal shirts, structured blazers', fabrics: 'Twill, linen', accessories: 'One statement (watch or bracelet)', grooming: 'Sharp lines', footwear: 'Chelsea boots', occasions: 'Dates, presentations, friends', avoid: 'Hiding in all-grey', why: 'Wearing a saturated colour near the face is a visible choice, and a visible choice reads as self-assurance.' },
  { id: 'approachable', name: 'Approachable', tags: ['approachable', 'friendly', 'relaxed'], colours: ['olive', 'beige', 'camel', 'warm-white'], garments: 'Henleys, polos, chinos, cardigans', fabrics: 'Soft cotton, knits', accessories: 'Minimal', grooming: 'Soft stubble', footwear: 'Suede sneakers, loafers', occasions: 'Coffee, family, second meetings', avoid: 'Black head-to-toe, stiff suits', why: 'Mid-tone earthy colours and soft fabrics have low contrast, and low contrast reads as warm and unthreatening.' },
  { id: 'friendly', name: 'Friendly', tags: ['friendly', 'approachable'], colours: ['coral', 'golden', 'mustard', 'teal'], garments: 'Polos, Cuban shirts', fabrics: 'Pique, linen', accessories: 'Leather bracelet', grooming: 'Smile-friendly short beard', footwear: 'Sneakers', occasions: 'Friends, casual lunches', avoid: 'Formal darks', why: 'Warm, light accent colours are associated with openness.' },
  { id: 'trustworthy', name: 'Trustworthy', tags: ['trustworthy', 'composed'], colours: ['navy', 'warm-white', 'charcoal'], garments: 'Navy blazer, Oxford shirt, dark trousers', fabrics: 'Oxford cotton, wool', accessories: 'Classic watch', grooming: 'Clean and even', footwear: 'Derbies', occasions: 'Interviews, clients, family introductions', avoid: 'Flashy accessories', why: 'Navy and white is the most common "institutional" pairing (uniforms, banking, academia), so it carries dependability by association.' },
  { id: 'intelligent', name: 'Intelligent', tags: ['intelligent', 'calm'], colours: ['teal', 'charcoal', 'navy', 'olive'], garments: 'Knit over shirt, cardigans, glasses', fabrics: 'Merino, herringbone', accessories: 'Your eyeglasses, a simple watch', grooming: 'Neat', footwear: 'Derbies', occasions: 'Presentations, office, networking', avoid: 'Athleisure', why: 'Layered knitwear and muted deep colours are the academic and professional archetype.' },
  { id: 'professional', name: 'Professional', tags: ['professional', 'trustworthy', 'composed'], colours: ['navy', 'charcoal', 'warm-white', 'camel'], garments: 'Twill or poplin shirts, formal trousers', fabrics: 'Poplin, twill, wool blend', accessories: 'Leather watch, belt matching the shoes', grooming: 'Trimmed', footwear: 'Derbies, oxfords', occasions: 'Office, clients', avoid: 'Rolled sleeves in meetings', why: 'Pressed fabrics and matched leathers show attention to detail.' },
  { id: 'masculine', name: 'Masculine', tags: ['rugged', 'adventurous', 'confident'], colours: ['olive', 'chocolate', 'rust', 'indigo'], garments: 'Utility shirts, chore jackets, boots, denim', fabrics: 'Canvas, denim, suede', accessories: 'Leather watch', grooming: 'Fuller beard with rounded edges', footwear: 'Desert boots, Chelsea boots', occasions: 'Weekends, travel', avoid: 'Delicate pastels', why: 'Workwear and military details carry rugged associations.' },
  { id: 'calm', name: 'Calm', tags: ['calm', 'understated'], colours: ['olive', 'stone', 'teal', 'beige'], garments: 'Linen, knits, tonal outfits', fabrics: 'Linen, merino', accessories: 'Minimal', grooming: 'Soft', footwear: 'Loafers', occasions: 'Brunch, office, family', avoid: 'High contrast', why: 'Tonal, low-contrast outfits have no visual "edges" for the eye to jump between.' },
  { id: 'creative', name: 'Creative', tags: ['creative', 'distinctive'], colours: ['teal', 'rust', 'mustard'], garments: 'Cuban shirts, micro-prints, band collars', fabrics: 'Linen, textured cotton', accessories: 'A bracelet', grooming: 'Textured hair', footwear: 'Espadrilles, suede sneakers', occasions: 'Weekends, dates', avoid: 'Corporate uniform', why: 'Unusual collars and colour combinations show independent taste.' },
  { id: 'romantic', name: 'Romantic', tags: ['romantic'], colours: ['burgundy', 'auburn', 'chocolate', 'ivory'], garments: 'Knitted polos, soft blazers, suede', fabrics: 'Suede, merino, silk-blend', accessories: 'Dress watch', grooming: 'Freshly trimmed', footwear: 'Loafers', occasions: 'Dinner dates, anniversaries', avoid: 'Sporty pieces', why: 'Deep reds and soft textures are culturally associated with warmth and intimacy.' },
  { id: 'elegant', name: 'Elegant', tags: ['elegant', 'refined'], colours: ['ivory', 'camel', 'chocolate'], garments: 'Cream blazer, fine knits, tonal looks', fabrics: 'Wool, linen, merino', accessories: 'Pocket square', grooming: 'Polished', footwear: 'Loafers', occasions: 'Receptions, dinners', avoid: 'Busy prints', why: 'Cream and camel is the classic "quiet luxury" pairing: understated and refined.' },
  { id: 'adventurous', name: 'Adventurous', tags: ['adventurous', 'rugged'], colours: ['olive', 'rust', 'camel'], garments: 'Field jackets, cargo, utility shirts', fabrics: 'Canvas, ripstop', accessories: 'Backpack, sunglasses', grooming: 'Relaxed', footwear: 'Desert boots', occasions: 'Travel, outdoors', avoid: 'Formal', why: 'Military and expedition details.' },
  { id: 'relaxed', name: 'Relaxed', tags: ['relaxed'], colours: ['olive', 'beige', 'warm-white'], garments: 'Henleys, linen, drawstring trousers', fabrics: 'Linen, jersey', accessories: 'Sunglasses', grooming: 'Stubble', footwear: 'Sandals, espadrilles', occasions: 'Weekend, beach', avoid: 'Stiff tailoring', why: 'Soft, unstructured shapes.' },
  { id: 'authoritative', name: 'Authoritative', tags: ['authoritative'], colours: ['charcoal', 'navy', 'chocolate'], garments: 'Structured suits, bandhgala, overcoats', fabrics: 'Wool', accessories: 'Bracelet watch, tie', grooming: 'Sharp', footwear: 'Oxfords', occasions: 'Formal events, interviews', avoid: 'Casual layers', why: 'Structured shoulders and dark solids are the visual language of leadership.' },
  { id: 'refined', name: 'Refined', tags: ['refined', 'understated'], colours: ['camel', 'ivory', 'stone'], garments: 'Knits, OCBDs, loafers', fabrics: 'Merino, cotton', accessories: 'Leather watch', grooming: 'Neat', footwear: 'Loafers', occasions: 'Lunches, dates', avoid: 'Logos', why: 'Quality basics in tonal neutrals.' },
  { id: 'traditional', name: 'Traditional', tags: ['traditional'], colours: ['ivory', 'mustard', 'forest'], garments: 'Kurtas, Nehru jackets', fabrics: 'Cotton, silk', accessories: 'Stole', grooming: 'Neat', footwear: 'Mojaris, kolhapuris', occasions: 'Festivals, ceremonies', avoid: 'Western casual', why: 'Indian garments honour the occasion and the family.' },
  { id: 'contemporary', name: 'Contemporary', tags: ['contemporary', 'urban'], colours: ['olive', 'teal', 'ivory'], garments: 'Band collars, overshirts, relaxed trousers', fabrics: 'Linen-cotton, technical', accessories: 'Smartwatch', grooming: 'Textured crop', footwear: 'Leather sneakers', occasions: 'Weekends, Indo-Western', avoid: 'Dated fits', why: 'Current silhouettes (relaxed legs, collarless shirts) without trend excess.' },
];

export const colourStories = [
  { pair: ['navy', 'ivory'], title: 'Navy + cream', reads: 'Composed, dependable, polished', note: 'Your polo photo is this pairing. It is reliable, but at the waist the light and dark meet in a hard line, so add a layer.' },
  { pair: ['olive', 'beige'], title: 'Olive + beige', reads: 'Grounded, relaxed, approachable', note: 'Low contrast, all earth tones. Your safest weekend formula.' },
  { pair: ['rust', 'chocolate'], title: 'Rust + chocolate', reads: 'Warm, expressive, confident', note: 'Deep autumn at its most characteristic.' },
  { pair: ['burgundy', 'charcoal'], title: 'Burgundy + charcoal', reads: 'Sophisticated, evening', note: 'Burgundy brings back the warmth charcoal takes away.' },
  { pair: ['ivory', 'camel'], title: 'Cream + camel', reads: 'Refined, understated, elegant', note: 'The core of the report\'s office looks.' },
  { pair: ['teal', 'beige'], title: 'Deep teal + beige', reads: 'Distinctive yet balanced', note: 'Teal is the one cool colour in your palette.' },
];

// ───────── Trends ─────────
export const trends: { name: string; what: string; verdict: 'Highly suitable' | 'Suitable with modifications' | 'Occasion-dependent' | 'Not recommended'; why: string; longevity: string }[] = [
  { name: 'Relaxed / wider trouser legs', what: 'Straight and wide-leg trousers replacing skinny cuts.', verdict: 'Highly suitable', why: 'A straight leg balances a fuller upper body far better than skinny or tapered.', longevity: 'Long: straight legs are a classic, not a fad.' },
  { name: 'Pleated trousers', what: 'Single and double pleats returning to mainstream.', verdict: 'Highly suitable', why: 'Extra room through the hip, a higher rise and better drape.', longevity: 'Long.' },
  { name: 'Quiet luxury', what: 'Logo-free, tonal, quality-focused dressing.', verdict: 'Highly suitable', why: 'Tonal neutrals are your palette, and low contrast suits your shape.', longevity: 'The label will fade. The principle (quality basics) is permanent.' },
  { name: '"Old money" aesthetic', what: 'Preppy-classic: OCBDs, knitted polos, loafers, navy blazers.', verdict: 'Suitable with modifications', why: 'The garments are great for you. Skip the cable-knit chunky sweaters and tight polos.', longevity: 'The garments are timeless. The social-media label is short-lived.' },
  { name: 'Knitted polos', what: 'Sweater-knit polos, often buttonless.', verdict: 'Highly suitable', why: 'The single most flattering polo for your shape.', longevity: 'Long.' },
  { name: 'Cuban / camp collars', what: 'Open, flat collars on summer shirts.', verdict: 'Highly suitable', why: 'The V neck plus a straight hem skims the midsection.', longevity: 'Medium-long: a 1950s classic that cycles back.' },
  { name: 'Overshirts and shackets', what: 'Heavy shirts worn as jackets.', verdict: 'Highly suitable', why: 'Vertical lines with zero tailoring needed.', longevity: 'Long.' },
  { name: 'Oversized tees and boxy streetwear', what: 'Dropped shoulders, wide bodies.', verdict: 'Not recommended', why: 'Adds volume to a large frame. Choose regular-fit heavyweight instead.', longevity: 'Short-medium.' },
  { name: 'Skinny jeans', what: 'Tight from hip to ankle.', verdict: 'Not recommended', why: 'Makes the upper body look bigger by contrast.', longevity: 'Already dated.' },
  { name: 'Earth tones / "mocha" browns', what: 'Browns, olives and rust everywhere in retail.', verdict: 'Highly suitable', why: 'This is literally your colour season. Buy while the shops are full of it.', longevity: 'Colour trends cycle every 3–5 years, so stock up now.' },
  { name: 'Suede loafers and sneakers', what: 'Suede replacing smooth leather in casual shoes.', verdict: 'Suitable with modifications', why: 'Great colour match. Keep it out of the Bengaluru monsoon.', longevity: 'Long.' },
  { name: 'Smart casual / no-tie office', what: 'Ties disappearing outside formal events.', verdict: 'Highly suitable', why: 'Matches tech-office reality.', longevity: 'Permanent shift.' },
  { name: 'Contemporary Indian menswear', what: 'Minimal kurtas, Nehru jackets, band collars, Indo-Western.', verdict: 'Highly suitable', why: 'Long vertical shapes, and your palette is the festive palette.', longevity: 'Long.' },
  { name: 'Cropped jackets', what: 'Waist-length bombers and trucker jackets.', verdict: 'Occasion-dependent', why: 'They end at the widest point. Wear them open, and only for casual use.', longevity: 'Medium.' },
  { name: 'Minimalist fashion', what: 'Few pieces, neutral colours, clean lines.', verdict: 'Highly suitable', why: 'Fewer, better purchases, which matters while your body is still changing.', longevity: 'Permanent.' },
  { name: 'Layering trends', what: 'Tee + overshirt + jacket stacks.', verdict: 'Suitable with modifications', why: 'Two layers are great. Three layers in Bengaluru heat is too much except in winter.', longevity: 'Long.' },
];

// ───────── Glossary ─────────
export const glossary: { term: string; q?: string; a: string; tags: string[] }[] = [
  { term: 'Oxford shirt', q: 'What is an Oxford shirt?', a: 'A shirt made of Oxford cloth, a basket weave where pairs of yarns cross over pairs. It is thicker, softer and more textured than poplin. "OCBD" means Oxford Cloth Button-Down: an Oxford shirt with a button-down collar.', tags: ['shirt', 'weave'] },
  { term: 'Oxford vs poplin', q: 'Difference between Oxford and poplin?', a: 'Both are cotton. Poplin is a tight plain weave of fine yarns: smooth, crisp, formal and prone to creasing. Oxford is a looser basket weave of thicker yarns: textured, casual-to-smart and more forgiving. Choose poplin with a suit and Oxford for everything else.', tags: ['shirt', 'weave'] },
  { term: 'Linen-cotton', q: 'What is linen-cotton?', a: 'A fabric blending linen (flax) and cotton fibres. It keeps most of linen\'s breathability but creases about half as much and feels softer.', tags: ['fabric'] },
  { term: 'Shacket', q: 'What is a shacket?', a: 'Shirt + jacket: a heavy shirt-shaped jacket, usually in wool blend or brushed twill, worn open over a tee or shirt.', tags: ['outerwear'] },
  { term: 'Cuban collar', q: 'What is a Cuban collar?', a: 'A flat, open collar with no collar stand. It lies flat and forms a V at the neck. It is used on relaxed short-sleeve shirts made to be worn untucked. "Camp collar" is the same thing.', tags: ['shirt', 'collar'] },
  { term: 'Pique', q: 'What is polo pique fabric?', a: 'A knitted fabric with a raised waffle or honeycomb texture. It is the classic polo fabric: thicker, more structured and more breathable than flat jersey.', tags: ['knit', 'polo'] },
  { term: 'Half break', q: 'What is a half break?', a: 'The single soft fold your trouser hem makes where it rests on the shoe. No break means it just touches. Quarter break is a faint dimple. Half break is one fold. Full break is a deep fold. A quarter or half break suits you.', tags: ['trousers', 'fit'] },
  { term: 'Tapered fit', q: 'What is a tapered fit?', a: 'Trousers that narrow progressively from the knee to the ankle. "Slim-tapered" is trim throughout. "Regular-tapered" has room at the top and narrows below. A gentle taper suits you, a strong taper does not.', tags: ['trousers', 'fit'] },
  { term: 'Structured blazer', q: 'What is a structured blazer?', a: 'A blazer with shoulder pads, a stiffened (canvassed or fused) chest and full lining. It holds its own shape regardless of your body. An unstructured blazer has none of these and drapes like a cardigan.', tags: ['outerwear'] },
  { term: 'GSM', q: 'What is GSM?', a: 'Grams per square metre: fabric weight. For tees, under 160 is thin (clings), 180–220 is midweight (ideal for you) and 240+ is heavyweight (structured, warmer).', tags: ['fabric', 'knit'] },
  { term: 'Garment dyeing', q: 'What is garment dyeing?', a: 'Dyeing a garment after it has been sewn, instead of dyeing the fabric first. It gives softer, slightly uneven, lived-in colour and pre-shrinks the garment.', tags: ['finishing'] },
  { term: 'Garment washing', q: 'What is garment washing?', a: 'Washing a finished garment at the factory (sometimes with enzymes or stones) to soften it and give it a broken-in feel before you buy it.', tags: ['finishing'] },
  { term: 'French tuck', q: 'What is a French tuck?', a: 'Tucking only the front of the shirt or tee into the waistband and leaving the back out. Popular on social media, but for you it creates a horizontal line right across the stomach, so skip it.', tags: ['styling'] },
  { term: 'Capsule wardrobe', q: 'What is a capsule wardrobe?', a: 'A small, deliberately chosen set of interchangeable clothes (15–40 pieces) where almost everything matches everything. The value is in combinations per piece, not the number of pieces.', tags: ['wardrobe'] },
  { term: 'Rise', a: 'The distance from the crotch seam to the top of the waistband. Low rise sits below the navel, mid rise at the navel and high rise above it. Mid-to-high rise suits you: it does not fold under the stomach.', tags: ['trousers'] },
  { term: 'Inseam', a: 'The length of the inside leg seam, from crotch to hem. It decides trouser length.', tags: ['trousers', 'measurement'] },
  { term: 'Leg opening', a: 'The width around the trouser hem. 7–8 inches is slim, 8–9 regular and 9+ relaxed. Around 8–8.5 inches balances your frame.', tags: ['trousers'] },
  { term: 'Placket', a: 'The strip of fabric where buttons and buttonholes sit. On polos and henleys, the placket is a short vertical line.', tags: ['construction'] },
  { term: 'Yoke', a: 'The panel across the upper back of a shirt. A split yoke (two pieces) is a quality marker.', tags: ['construction'] },
  { term: 'Ease', a: 'The extra room a garment has over your body measurement. A shirt for a 43.5-inch chest typically measures 47–49 inches around. That 4–6 inches of ease is why garment measurements are always bigger than body measurements.', tags: ['fit', 'measurement'] },
  { term: 'Sanforised', a: 'Cotton that has been mechanically pre-shrunk, so it shrinks under about 1% when washed.', tags: ['fabric'] },
  { term: 'Selvedge', a: 'The self-finished edge of fabric woven on a shuttle loom. In jeans it shows as a coloured line on the outseam cuff. It signals craft, not fit.', tags: ['denim'] },
  { term: 'Notch vs peak lapel', a: 'A notch lapel has a V-cut where the collar meets the lapel and is the default. A peak lapel has points facing up and is more formal and authoritative.', tags: ['outerwear'] },
  { term: 'Vent', a: 'The slit at the back of a jacket. Double vents (two side slits) drape best over a fuller seat and let you put your hands in your pockets without the jacket pulling.', tags: ['outerwear'] },
  { term: 'Canvassed vs fused', a: 'Canvassed jackets have a floating layer of horsehair or wool canvas in the chest, which moulds to you over time. Fused jackets have the interlining glued in: cheaper and stiffer, and they can bubble after dry cleaning.', tags: ['outerwear'] },
  { term: 'Barrel vs French cuff', a: 'A barrel cuff buttons closed and is standard. A French cuff folds back and closes with cufflinks, for formal occasions only.', tags: ['shirt'] },
  { term: 'Break-in', a: 'The period where new leather shoes soften and mould to your feet. Wear them for a couple of hours at home before the occasion.', tags: ['footwear'] },
  { term: 'Last', a: 'The foot-shaped form a shoe is built on. It decides width and toe shape, which is why the same size differs between brands.', tags: ['footwear'] },
  { term: 'Bandhgala', a: '"Closed neck": a structured Indian jacket with a mandarin collar, buttoned to the neck. It is the Indian equivalent of a suit jacket.', tags: ['indian'] },
  { term: 'Nehru jacket', a: 'A hip-length, usually sleeveless jacket with a mandarin collar, worn over a kurta or shirt.', tags: ['indian'] },
  { term: 'Churidar', a: 'Fitted trousers worn with a kurta, long enough to gather in folds at the ankle.', tags: ['indian'] },
  { term: 'Mojari / jutti', a: 'Traditional closed leather slip-on shoes, often embroidered, worn with Indian wear.', tags: ['indian', 'footwear'] },
  { term: 'Tonal dressing', a: 'Wearing several shades of one colour family (camel, tan and chocolate, for example). It creates one long column and is your most elongating approach.', tags: ['styling', 'colour'] },
  { term: 'Vertical line', a: 'Any element that draws the eye up and down: an open jacket edge, a placket, a V-neck, pinstripes, a tonal column. Vertical lines make a frame look longer and narrower.', tags: ['styling'] },
  { term: 'Horizontal break', a: 'A strong change of colour or a hemline that cuts across the body. Where it sits, it widens. You want to avoid one at the stomach.', tags: ['styling'] },
  { term: 'Undertone', a: 'The underlying hue of skin beneath the surface tone: warm (golden, greenish veins), cool (pink, bluish veins) or neutral. Yours is warm.', tags: ['colour'] },
  { term: 'Colour season', a: 'A system grouping skin, hair and eye colouring into seasons. Warm Deep Autumn means warm undertone, deep colouring and muted-rich colours suit you best.', tags: ['colour'] },
];

// ───────── Accessories & footwear ─────────
export const accessoryGuides: { group: string; items: { name: string; what: string; forMe: string }[] }[] = [
  { group: 'Watches', items: [
    { name: 'Leather strap', what: 'A watch on a stitched leather strap. The most versatile option, from smart casual to formal.', forMe: 'Your best everyday option. Choose brown or tan straps, with a gold-tone or steel case.' },
    { name: 'Metal bracelet', what: 'A steel or gold-tone link bracelet. Sporty-to-dressy.', forMe: 'Gold-tone or two-tone suits your warm undertone better than polished silver.' },
    { name: 'Mesh strap', what: 'A fine woven-metal (Milanese) strap. Minimal and modern.', forMe: 'Good in gold-tone.' },
    { name: 'Minimalist', what: 'A plain dial with few or no numerals.', forMe: 'Pairs with everything. A good first "proper" watch.' },
    { name: 'Chronograph', what: 'A stopwatch function with sub-dials. Busy and sporty.', forMe: 'Casual and travel. Keep the case at 40–42 mm.' },
    { name: 'Dress watch', what: 'A thin case and simple dial on leather.', forMe: 'For suits and receptions.' },
    { name: 'Smartwatch', what: 'What you wear now (black, seen in your photo).', forMe: 'Fine for casual, gym and travel. For dates and formal events, switch to a leather watch. A tan or brown strap on the smartwatch would also warm it up.' },
  ]},
  { group: 'Watch sizing', items: [
    { name: 'Case diameter', what: 'The width of the watch case, excluding the crown.', forMe: 'A larger wrist and frame suits 40–42 mm. Under 38 mm will look small on you, and over 44 mm looks costume.' },
    { name: 'Lug-to-lug', what: 'The length from strap attachment to strap attachment.', forMe: 'It should not overhang your wrist width. Measure your wrist and add it to the Body page.' },
    { name: 'Strap colour', what: '—', forMe: 'Brown, tan or chocolate. Match the strap loosely to your belt and shoes.' },
  ]},
  { group: 'Eyewear (diamond face)', items: [
    { name: 'Oval', what: 'Soft, rounded rectangle.', forMe: 'Recommended by your report. It softens the cheekbone angle.' },
    { name: 'Round', what: 'Circular lenses.', forMe: 'Recommended ("light, rounded frames").' },
    { name: 'Rectangular', what: 'Straight-edged.', forMe: 'Use with care. It echoes the angles you are trying to soften.' },
    { name: 'Browline', what: 'A heavy top rim and thin bottom.', forMe: 'Adds width at the brow, which balances a narrow forehead. Good.' },
    { name: 'Aviator', what: 'A teardrop shape with a double bridge.', forMe: 'Your current frames look like a thin-metal double-bridge style, and the report suggests gold-tone aviator sunglasses. Wider at the bottom works for a diamond face.' },
    { name: 'Rimless', what: 'No frame around the lenses.', forMe: 'Recommended by your report. It keeps focus on the eyes.' },
    { name: 'Tortoiseshell', what: 'A brown mottled acetate.', forMe: 'A warm-colour match, and it suits deep autumn very well. Worth trying as a second pair.' },
  ]},
  { group: 'Belts', items: [
    { name: 'Brown leather', what: 'The default, around 1.25 inches wide.', forMe: 'Essential. Wear it with brown shoes.' },
    { name: 'Dark brown', what: 'Dressier.', forMe: 'For dark-brown derbies and oxfords.' },
    { name: 'Black', what: 'Formal and evening.', forMe: 'Only if you own black shoes.' },
    { name: 'Suede', what: 'Casual texture.', forMe: 'With suede loafers.' },
    { name: 'Casual woven', what: 'Braided leather or elastic.', forMe: 'Summer chinos and linen. It adjusts to any hole, which is useful while your waist changes.' },
  ]},
  { group: 'Shoes', items: [
    { name: 'White leather sneakers', what: 'Minimal low-top in white leather.', forMe: 'Owned (seen in your photo). Keep them clean: dirty white sneakers ruin an outfit.' },
    { name: 'Canvas sneakers', what: 'Fabric uppers, rubber sole.', forMe: 'Summer casual.' },
    { name: 'Neutral sneakers', what: 'Suede or leather in taupe, stone or brown.', forMe: 'More versatile than white for smart casual.' },
    { name: 'Brown loafers', what: 'A slip-on leather shoe.', forMe: 'High priority: the shoe that unlocks the most outfits on this site.' },
    { name: 'Penny loafers', what: 'A loafer with a strap across the vamp.', forMe: 'The classic. Pick brown or tan.' },
    { name: 'Suede loafers', what: 'A loafer in napped leather.', forMe: 'Superb colour match for you. Avoid the monsoon.' },
    { name: 'Derby', what: 'A lace-up with open lacing (quarters sewn on top). Slightly less formal.', forMe: 'Office. More comfortable for wider feet than oxfords.' },
    { name: 'Oxford', what: 'A lace-up with closed lacing. The most formal.', forMe: 'For suits.' },
    { name: 'Chelsea boots', what: 'An ankle boot with elastic sides.', forMe: 'Evening and winter. Suede or leather in brown.' },
    { name: 'Desert boots', what: 'A suede ankle boot with two eyelets and a crepe sole.', forMe: 'Casual and travel. Camel or chocolate.' },
    { name: 'Espadrilles', what: 'Canvas upper, jute sole.', forMe: 'Beach and resort.' },
    { name: 'Sandals', what: 'Open leather sandals.', forMe: 'Monsoon and home. Not for the city.' },
    { name: 'Traditional Indian footwear', what: 'Mojaris, juttis, kolhapuris.', forMe: 'One tan mojari plus one kolhapuri covers every function.' },
  ]},
  { group: 'Other accessories', items: [
    { name: 'Bracelets', what: 'Leather, bead or metal.', forMe: 'One at most, in brown leather or gold-tone.' },
    { name: 'Rings', what: '—', forMe: 'Optional. Gold-tone.' },
    { name: 'Sunglasses', what: '—', forMe: 'Gold-tone aviators, as your report suggests.' },
    { name: 'Wallets', what: '—', forMe: 'A slim bifold or cardholder. A fat wallet in a back pocket distorts the seat of your trousers.' },
    { name: 'Backpacks', what: '—', forMe: 'Brown or navy, leather trim, no loud logos.' },
    { name: 'Messenger bags', what: '—', forMe: 'Brown leather for the office.' },
    { name: 'Leather bags', what: '—', forMe: 'A weekender for travel (the report suggests one).' },
    { name: 'Pocket squares', what: '—', forMe: 'Complement the outfit rather than matching the tie. Rust, mustard, teal or ivory.' },
    { name: 'Ties', what: '—', forMe: '3–3.25 inches wide. Burgundy, teal, brown.' },
    { name: 'Cufflinks', what: '—', forMe: 'Gold-tone (the report suggests it).' },
  ]},
];

export const matchingRules = [
  { rule: 'Belt matches shoes', detail: 'Same colour family (brown with brown, black with black). An exact shade match is not needed; the same depth is better.' },
  { rule: 'Metals match', detail: 'Watch case, belt buckle and glasses frame in the same tone. For you, that means gold-tone.' },
  { rule: 'Socks', detail: 'Formal: match the trousers, not the shoes. Casual: no-show socks with loafers and sneakers. Never white sports socks with leather shoes.' },
  { rule: 'Trouser break and shoe', detail: 'Loafers and sneakers want little or no break. Oxfords and derbies take a half break.' },
  { rule: 'Shoe formality equals trouser formality', detail: 'Formal trousers take leather shoes. Sneakers belong with chinos and denim only.' },
  { rule: 'Two leathers maximum', detail: 'Do not mix tan shoes with a chocolate belt and a black strap. Pick one leather story.' },
];

// ───────── Grooming ─────────
export const grooming = {
  hair: [
    { name: 'Textured crop with slight fringe', from: 'report', detail: 'Short sides, 2–3 inches on top, tousled forward with matte clay. The fringe softens the angular forehead. Your current hair is already close: curly volume on top with shorter sides.' },
    { name: 'Side-swept undercut', from: 'report', detail: 'A longer top swept to one side with short sides. The diagonal line counteracts the straight lines of a diamond face.' },
    { name: 'Volume', from: 'my-advice', detail: 'Keep some width at the temples rather than fading very high. A diamond face is narrow at the forehead and benefits from width there.' },
    { name: 'Products', from: 'my-advice', detail: 'Matte clay or paste for texture. Avoid wet-look gel. With curly hair, a light cream on damp hair controls frizz in the humidity.' },
  ],
  beard: [
    { name: 'Full beard with rounded edges', from: 'report', detail: 'Softens the angles and adds width at the jaw. Round the bottom rather than squaring it, and keep the cheek line natural.' },
    { name: 'Short stubble', from: 'report', detail: 'About 3–5 mm. Clean and defined without overwhelming a narrow chin.' },
    { name: 'Goatee with moustache', from: 'report', detail: 'Adds width and definition at the chin.' },
    { name: 'Neckline', from: 'my-advice', detail: 'Trim it about 1 inch above the Adam\'s apple, in a gentle U from ear to ear. A neckline too high makes the jaw look smaller.' },
  ],
  eyebrows: 'Tidy only the strays between the brows and under the arch. Do not reshape them; full brows suit your face.',
  skincare: ['Gentle cleanser morning and night', 'Moisturiser (gel-based in humidity)', 'Sunscreen SPF 30+ daily; warm skin still tans unevenly', 'Exfoliate 1–2× a week where the beard meets the cheek (prevents ingrowns)', 'Lip balm in AC and on flights'],
  fragrances: [
    { name: 'Davidoff Cool Water', family: 'Aquatic-aromatic', intensity: 'Light', use: 'Daily, office, warm weather', longevity: '4–6 hours, soft projection', notes: 'Mint, lavender, coriander, rosemary → geranium, neroli, jasmine → sandalwood, cedar, musk', price: '~₹1,300–1,800 / 125 ml (from report, Jan 2026; unverified)' },
    { name: 'Montblanc Legend', family: 'Aromatic-fougère', intensity: 'Moderate', use: 'Versatile: office, day events, dates', longevity: '6–8 hours, moderate', notes: 'Bergamot, lavender, pineapple leaf → rose, geranium, coumarin → sandalwood, tonka, evernyl', price: '~₹3,200–3,800 / 100 ml (from report; unverified)' },
    { name: 'Dior Sauvage', family: 'Aromatic-spicy', intensity: 'Moderate-strong', use: 'Evening, special occasions, cooler months', longevity: '8–10 hours, pronounced', notes: 'Calabrian bergamot, Sichuan pepper → lavender, geranium, pink pepper → vetiver, patchouli, labdanum', price: '~₹7,500–8,500 / 100 ml (from report; unverified)' },
  ],
  fragranceFamilies: [
    { name: 'Fresh / aquatic / citrus', when: 'Day, heat, office' },
    { name: 'Aromatic / fougère', when: 'All-rounder: lavender, herbs, tonka' },
    { name: 'Woody', when: 'Evening, cooler weather: cedar, sandalwood, vetiver' },
    { name: 'Spicy / amber / oriental', when: 'Night, winter, special occasions' },
  ],
  application: ['Apply to clean, moisturised skin after a shower', '2 sprays for the office, 3 maximum in the evening', 'Pulse points: neck sides, chest, inner wrists. Do not rub the wrists together.', 'Humid heat amplifies projection, so use less in Bengaluru summer', 'Fragrance is never a substitute for a shower, clean clothes and deodorant'],
};

// ───────── Seasons (Bengaluru) ─────────
export const seasons = [
  { id: 'summer', name: 'Summer', months: 'March – May', climate: 'Bengaluru 30–35°C days, dry heat, strong sun', fabrics: 'Linen, linen-cotton, seersucker, lightweight cotton', garments: 'Linen and Cuban shirts, polos, linen trousers, chinos', avoid: 'Denim jackets, knitwear, dark heavy fabrics in the midday sun', trade: 'Linen creases. Linen-cotton is the trade-off when you need to look crisp.' },
  { id: 'monsoon', name: 'Monsoon', months: 'June – September', climate: '20–28°C, frequent rain, high humidity', fabrics: 'Quick-dry blends, cotton-poly, nylon shells, darker cotton', garments: 'Polos, dark chinos, windbreaker, sandals or rubber soles', avoid: 'Suede, light trousers, linen (stays wet, sticks), leather soles', trade: 'Synthetics dry fast but hold sweat and odour. Use them only for the outer layer.' },
  { id: 'transitional', name: 'Post-monsoon / transitional', months: 'October – November', climate: '18–28°C, occasional showers, pleasant evenings', fabrics: 'Cotton twill, Oxford, light knits for evenings', garments: 'OCBDs, overshirts, chinos, light jackets in the evening', avoid: 'Heavy wool', trade: 'Layer so you can remove one piece by noon.' },
  { id: 'winter', name: 'Winter', months: 'December – February', climate: '15–27°C, cool mornings (can dip near 12°C), dry', fabrics: 'Merino, fine cotton knits, flannel for trips, suede', garments: 'Fine sweaters, cardigans, overshirts, Chelsea and desert boots', avoid: 'Puffers and heavy coats (overkill in Bengaluru)', trade: 'A merino crewneck does more than a heavy jacket here.' },
];

export const environments = [
  { name: 'Hot and humid', advice: 'Natural fibres, loose weaves, light colours away from the face, dark colours to hide sweat on the back. Carry a spare tee if you are out all day.' },
  { name: 'Air-conditioned office', advice: 'A breathable base (cotton or linen-cotton) plus a removable layer (cardigan, merino or unstructured blazer) kept at your desk.' },
  { name: 'Evening outings', advice: 'Temperatures drop 6–10°C after sunset in Bengaluru. An overshirt or light jacket, deeper colours, suede shoes.' },
];

// ───────── Capsules ─────────
export const capsules: { id: string; name: string; pieces: string[]; note: string }[] = [
  { id: 'c15', name: '15-piece starter capsule', note: 'Built around what you already own (navy polo, beige chinos, white sneakers).', pieces: ['polo:navy', 'polo:mustard', 'polo-knit:chocolate', 'oxford:warm-white', 'oxford:navy', 'linen-shirt:olive', 'tee-crew:ivory', 'chinos:beige', 'chinos:olive', 'jeans-slim-straight:indigo', 'overshirt:camel', 'sneaker-white:white', 'loafer-suede:brown', 'belt-leather:brown', 'watch-leather:tan'] },
  { id: 'c25', name: '25-piece versatile wardrobe', note: 'Adds office, layering and an evening option.', pieces: [] },
  { id: 'c40', name: '40-piece mature wardrobe', note: 'Adds tailoring, Indian wear and seasonal layers.', pieces: [] },
  { id: 'c60', name: '60-piece expanded wardrobe', note: 'Full coverage including weddings, travel and winter trips.', pieces: [] },
];
const add25 = ['twill-shirt:olive', 'linen-cotton-shirt:navy', 'henley:ivory', 'chinos:stone', 'chinos:navy', 'pleated:charcoal', 'blazer-unstructured:camel', 'crew-sweater:teal', 'loafer:brown', 'desert:camel'];
const add40 = ['cuban:teal', 'oxford:terracotta', 'twill-shirt:rust', 'polo-knit:teal', 'kurta:ivory', 'churidar:ivory', 'nehru:teal', 'formal-trousers:navy', 'linen-trousers:olive', 'blazer:navy', 'chore:olive', 'cardigan:camel', 'derby:brown', 'mojari:tan', 'belt-leather:tan'];
const add60 = ['suit-jacket:navy', 'formal-trousers:charcoal', 'formal-shirt:warm-white', 'oxford-shoe:brown', 'tie:burgundy', 'pocket-square:rust', 'silk-kurta:forest', 'nehru:rust', 'chelsea:brown', 'windbreaker:olive', 'cargo:olive', 'shorts:stone', 'linen-shirt:warm-white', 'twill-shirt:burgundy', 'utility-shirt:olive', 'henley-ls:olive', 'sunglasses:gold-metal', 'espadrille:ivory', 'joggers:charcoal', 'v-sweater:teal'];
capsules[1].pieces = [...capsules[0].pieces, ...add25];
capsules[2].pieces = [...capsules[1].pieces, ...add40];
capsules[3].pieces = [...capsules[2].pieces, ...add60];

/** Seeded from the 10 Nov 2026 mirror photo. Editable in the app. */
export const seedOwned = ['polo:navy', 'chinos:beige', 'sneaker-white:white', 'watch-smart:black', 'glasses:gold-metal'];
