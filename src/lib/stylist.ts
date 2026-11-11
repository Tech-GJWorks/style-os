import type { Outfit, Piece } from '../data/types';
import { fabricById } from '../data/fabrics';
import type { AppState } from './store';
import { evaluateOutfit, outfitComponents } from './engine';

export interface StylistNotes {
  headline: string;
  why: { title: string; text: string }[];
  how: string[];
  details: string[];
  verdict: string;
}

const lc = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
const fab = (p?: Piece) => (p ? (fabricById[p.kind.fabric]?.name ?? p.kind.fabric).toLowerCase() : '');
const isBrownLeather = (p?: Piece) => !!p && ['brown', 'tan', 'chocolate', 'deep-brown', 'camel'].includes(p.colour.id);

/** Editorial commentary assembled from the outfit's actual pieces, colours and the styling engine's checks. */
export function stylistNotes(state: AppState, o: Outfit): StylistNotes {
  const comps = outfitComponents(state, o);
  const get = (k: string) => comps.find((c) => c.key === k)?.piece;
  const top = get('top')!, bottom = get('bottom')!, shoes = get('footwear')!, outer = get('outer');
  const acc = comps.filter((c) => c.slot === 'accessory').map((c) => c.piece!).filter(Boolean);
  const belt = acc.find((a) => a.kind.wardrobe === 'Belts');
  const watch = acc.find((a) => a.kind.wardrobe === 'Watches');
  const ev = evaluateOutfit(state, o);
  const kurta = top.kind.shape === 'kurta';
  const knit = ['knit', 'turtleneck', 'hoodie'].includes(top.kind.shape ?? '') || top.kind.id.startsWith('polo-knit');
  const shirt = ['shirt', 'shirt-band'].includes(top.kind.shape ?? '');
  const tucked = !kurta && !!belt && (shirt || top.kind.formality >= 3) && !/cuban|printed|utility|linen-shirt|linen-cotton/.test(top.kind.id);
  const depthGap = Math.abs(top.colour.depth - bottom.colour.depth);

  const why: StylistNotes['why'] = [];

  // Colour
  const warmNearFace = [top, outer].filter(Boolean).some((p) => p!.colour.family === 'warm' || p!.colour.verdict === 'core');
  why.push({
    title: 'Colour',
    text: `${ev.colourLogic} ${warmNearFace ? `With ${lc((outer ?? top).colour.name)} framing the face, the outfit picks up the gold in your medium-tan skin, which is exactly what a Warm Deep Autumn palette is meant to do.` : 'Keep warm leather and gold-tone metal close to the face to bring back warmth.'}`,
  });

  // Silhouette
  if (kurta) why.push({ title: 'Silhouette', text: `The ${lc(top.kind.label)} falls in one unbroken line from shoulder to knee, the most elongating shape in menswear. There is no waistline at all, so the midsection simply disappears into the column.${outer ? ` The ${lc(outer.kind.label)} adds structure at the shoulder and frames the torso.` : ''}` });
  else if (outer) why.push({ title: 'Silhouette', text: `Worn open, the ${lc(outer.kind.label)} draws two clean vertical edges from shoulder to hip. The eye travels up and down rather than across, which lengthens the frame and lets the ${lc(top.colour.name)} panel in the centre read as a narrow column.` });
  else if (depthGap <= 1) why.push({ title: 'Silhouette', text: `Top and trousers sit close in depth, so there is no hard line across the waist. The outfit reads as one continuous shape, which is the most flattering route for a broad frame without a jacket.` });
  else why.push({ title: 'Silhouette', text: `${top.colour.depth > bottom.colour.depth ? 'The darker top keeps attention on the shoulders and face while the lighter trouser lifts the look.' : 'The light top brings attention to the face; the darker trouser grounds the outfit and recedes.'} The contrast meets at the waist, so ${tucked ? 'a belt in a matching leather tone softens that line' : 'keep the hem straight and at mid-fly so it does not draw a line across the stomach'}.` });

  // Fabric & texture
  const fabrics = [...new Set([top, outer, bottom].filter(Boolean).map((p) => fab(p)))];
  const textures: string[] = [];
  if (['suede'].includes(shoes.kind.fabric)) textures.push('suede shoes');
  if (fabrics.includes('linen')) textures.push('slubby linen');
  if (knit) textures.push('knit');
  why.push({
    title: 'Fabric & texture',
    text: `${fabrics.map((f) => f.charAt(0).toUpperCase() + f.slice(1)).join(', ')}${fabrics.length > 1 ? ' work together' : ''} for ${o.seasons.length >= 4 ? 'year-round wear in Bengaluru' : o.seasons.join(' and ')}. ${textures.length ? `The ${textures.join(' and ')} add surface interest, so the outfit looks considered without needing pattern.` : 'Clean, matte surfaces keep it refined; let the fit do the talking.'}`,
  });

  // Finishing
  const metals = watch ? (watch.colour.id.includes('gold') || isBrownLeather(watch) ? 'gold-tone or leather' : lc(watch.colour.name)) : '';
  why.push({
    title: 'Finishing',
    text: `${belt && isBrownLeather(belt) === isBrownLeather(shoes) ? `Belt and ${lc(shoes.kind.label)} share one leather family, which is the first thing a trained eye checks.` : `The ${lc(shoes.kind.label)} set the formality: ${shoes.kind.formality >= 4 ? 'polished leather keeps it dressed' : shoes.kind.formality === 3 ? 'smart but relaxed' : 'easy and casual'}.`} ${watch ? `A ${metals} watch keeps metals warm against your undertone.` : ''} ${acc.some((a) => a.kind.wardrobe === 'Pocket squares') ? 'The pocket square adds one controlled flash of colour; it should complement, never match, the tie or shirt.' : ''}`.trim(),
  });

  // How to wear
  const how: string[] = [];
  if (kurta) how.push('Kurta length should land just above the knee for your height; side slits should open cleanly when you walk.');
  else if (tucked) how.push('Full tuck, with the shirt pulled slightly taut at the sides so it does not balloon over the belt. Avoid the half "French" tuck: it draws a line straight across the stomach.');
  else if (shirt) how.push('Wear it untucked only if the hem is straight and ends at mid-fly. A long curved shirt tail left out looks sloppy.');
  else how.push('Hem should finish at mid-fly, covering the belt line but not the seat.');
  if (shirt && !tucked && top.kind.formality <= 3) how.push('Roll sleeves twice to just below the elbow (the "master roll"), which shows the forearm and breaks up the arm line.');
  if (outer?.kind.outerShape === 'blazer') how.push('Leave the blazer open, or fasten only the top button when standing. Never the bottom button. Unbutton when seated.');
  else if (outer) how.push(`Keep the ${lc(outer.kind.label)} open; zipped or buttoned it becomes a horizontal block.`);
  if (bottom.kind.legShape === 'shorts') how.push('Shorts should end just above the knee, a 7 to 9 inch inseam. Any shorter exaggerates the torso-to-leg ratio.');
  else if (!kurta) how.push(`Trousers: mid-to-high rise so the waistband sits above the softest part of the stomach, with ${['loafer', 'loafer-suede', 'sneaker-white', 'sneaker-suede', 'slipon', 'espadrille', 'sandal'].includes(shoes.kind.id) ? 'little or no break over the shoe' : 'a slight half break'}.`);
  if (['loafer', 'loafer-suede', 'espadrille', 'slipon', 'sneaker-white'].includes(shoes.kind.id)) how.push('No-show socks with these shoes; a visible sports sock ruins the line.');
  else if (shoes.kind.formality >= 4) how.push('Socks match the trouser colour, not the shoe, so the leg line continues unbroken.');
  if (top.kind.body === 'careful') how.push(top.kind.bodyNote ?? 'Size this piece for drape rather than a tight fit.');

  const details = [
    `${top.name} · ${fab(top)}`,
    ...(outer ? [`${outer.name} · ${fab(outer)}`] : []),
    `${bottom.name} · ${fab(bottom)}`,
    shoes.name,
    ...acc.map((a) => a.name),
  ];

  const headline = o.impression.length ? `${o.impression.slice(0, 2).map((i) => i.charAt(0).toUpperCase() + i.slice(1)).join(' & ')}` : 'Considered and easy';
  return { headline, why, how, details, verdict: o.why };
}
