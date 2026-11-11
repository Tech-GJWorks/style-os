import type { Colour, Kind, Outfit, Ownership, Piece, Season, Slot, WardrobeItem } from '../data/types';
import { colourById } from '../data/colours';
import { kindById, groupSlot, wardrobeTree } from '../data/kinds';
import { pieceById, pieces } from './catalogue';
import { outfits } from '../data/outfits';
import type { AppState } from './store';

// ───────── Ownership ─────────

export function itemPieceId(i: WardrobeItem) {
  return i.kindId && i.colourId ? `${i.kindId}:${i.colourId}` : undefined;
}

export function pieceStatus(state: AppState, pieceId: string): Ownership {
  if (state.items.some((i) => i.status === 'OWNED' && itemPieceId(i) === pieceId)) return 'OWNED';
  return state.statuses[pieceId] ?? 'NOT_OWNED';
}

export const isOwned = (state: AppState, pieceId: string) => pieceStatus(state, pieceId) === 'OWNED';

/** Turn a free-form wardrobe item into something the engine can reason about. */
export function itemAsPiece(i: WardrobeItem): Piece {
  const pid = itemPieceId(i);
  if (pid && pieceById[pid]) return { ...pieceById[pid], id: `item:${i.id}`, name: i.name };
  const group = Object.entries(wardrobeTree).find(([, subs]) => subs.includes(i.category))?.[0];
  const slot: Slot = i.slot ?? (group ? groupSlot[group] : 'top');
  const k: Kind = (i.kindId && kindById[i.kindId]) || {
    id: 'custom', label: i.category, slot, wardrobe: i.category, formality: 2, fabric: i.fabric ?? 'cotton', seasons: i.seasons?.length ? i.seasons : ['summer', 'monsoon', 'winter', 'transitional'], estPrice: 0,
  };
  const c: Colour = (i.colourId && colourById[i.colourId]) || { id: 'custom', name: i.colourText || 'Unspecified colour', hex: '#9b9b9b', group: 'Practical extras', family: 'neutral', depth: 2, verdict: 'good', source: 'my-evaluation' };
  return { id: `item:${i.id}`, kind: k, colour: c, name: i.name };
}

export function resolveRef(state: AppState, ref: string): Piece | undefined {
  if (ref.startsWith('item:')) {
    const it = state.items.find((i) => i.id === ref.slice(5));
    return it ? itemAsPiece(it) : undefined;
  }
  return pieceById[ref];
}

export function refOwned(state: AppState, ref: string) {
  if (ref.startsWith('item:')) return state.items.find((i) => i.id === ref.slice(5))?.status === 'OWNED';
  return isOwned(state, ref);
}

export interface Component { key: string; slot: Slot; ref: string; original: string; required: boolean; piece?: Piece; owned: boolean; substituted: boolean }

export function outfitComponents(state: AppState, o: Outfit): Component[] {
  const subs = state.subs[o.id] ?? {};
  const list: { key: string; slot: Slot; ref: string; required: boolean }[] = [
    { key: 'top', slot: 'top', ref: o.top, required: true },
    { key: 'bottom', slot: 'bottom', ref: o.bottom, required: true },
    { key: 'footwear', slot: 'footwear', ref: o.footwear, required: true },
    ...(o.outer ? [{ key: 'outer', slot: 'outer' as Slot, ref: o.outer, required: true }] : []),
    ...o.required.map((r, i) => ({ key: `req${i}`, slot: 'accessory' as Slot, ref: r, required: true })),
    ...o.optional.map((r, i) => ({ key: `opt${i}`, slot: 'accessory' as Slot, ref: r, required: false })),
  ];
  return list.map((c) => {
    const ref = subs[c.key] ?? c.ref;
    return { ...c, ref, original: c.ref, piece: resolveRef(state, ref), owned: refOwned(state, ref), substituted: ref !== c.ref };
  });
}

export interface Completion { required: number; owned: number; missing: Component[]; pct: number; status: 'Complete' | 'Almost complete' | 'Incomplete'; cost: number }

export function completion(state: AppState, o: Outfit): Completion {
  const comps = outfitComponents(state, o).filter((c) => c.required);
  const missing = comps.filter((c) => !c.owned);
  const owned = comps.length - missing.length;
  const cost = missing.reduce((s, c) => s + (c.piece?.kind.estPrice ?? 0), 0);
  return {
    required: comps.length, owned, missing, pct: Math.round((owned / comps.length) * 100), cost,
    status: missing.length === 0 ? 'Complete' : missing.length <= 2 ? 'Almost complete' : 'Incomplete',
  };
}

// ───────── Styling evaluation ─────────

export interface Check { label: string; status: 'ok' | 'warn' | 'bad'; detail: string }
export interface Evaluation { score: number; checks: Check[]; formality: number; seasons: Season[]; colourLogic: string }

export interface Parts { top?: Piece; bottom?: Piece; footwear?: Piece; outer?: Piece; accessories?: Piece[] }

const BROWNS = new Set(['brown', 'tan', 'chocolate', 'deep-brown', 'camel', 'auburn', 'bronze', 'copper', 'taupe']);

export function colourLogic(a?: Colour, b?: Colour): string {
  if (!a || !b) return '';
  if (a.id === b.id) return `Monochrome ${a.name.toLowerCase()}: one colour, one column.`;
  // Navy, charcoal, indigo, black and white behave as neutrals in menswear even though they are cool.
  const N = (c: Colour) => c.family === 'neutral' || ['navy', 'charcoal', 'indigo', 'black', 'white', 'grey', 'mid-denim'].includes(c.id);
  if (N(a) && N(b) && (a.family === 'cool' || b.family === 'cool')) return `A classic neutral pairing (${a.name.toLowerCase()} over ${b.name.toLowerCase()}): ${a.depth < b.depth ? 'light above dark keeps attention on the face and grounds the outfit' : a.depth > b.depth ? 'the darker top frames the shoulders while the lighter trouser keeps it fresh' : 'similar depth top to toe gives one long, calm column'}.`;
  if (N(a) && N(b)) return `Tonal neutrals (${a.name.toLowerCase()} + ${b.name.toLowerCase()}): calm and elongating.`;
  if (a.family === 'warm' && b.family === 'cool') return `Complementary temperature: warm ${a.name.toLowerCase()} above cool ${b.name.toLowerCase()}. The warm colour near the face lifts your skin tone, and the cool colour below recedes.`;
  if (a.family === 'cool' && b.family === 'warm') return `Cool ${a.name.toLowerCase()} above warm ${b.name.toLowerCase()}. It is balanced, but put a warm accent (leather, metal) near the top.`;
  if (N(b)) return `Accent and anchor: ${a.name.toLowerCase()} carries the colour, and ${b.name.toLowerCase()} grounds it.`;
  if (N(a)) return `Neutral top, coloured bottom (${b.name.toLowerCase()}). This draws the eye down, so keep it for casual looks.`;
  return `Two coloured pieces (${a.name.toLowerCase()} + ${b.name.toLowerCase()}): the expressive end of your palette.`;
}

export function evaluate(p: Parts, ctx: { occasionRange?: [number, number]; season?: Season } = {}): Evaluation {
  const checks: Check[] = [];
  const main = [p.top, p.bottom, p.footwear, p.outer].filter(Boolean) as Piece[];
  const all = [...main, ...(p.accessories ?? [])];
  if (!p.top || !p.bottom || !p.footwear) {
    return { score: 0, checks: [{ label: 'Incomplete', status: 'bad', detail: 'Choose at least a top, a bottom and footwear.' }], formality: 0, seasons: [], colourLogic: '' };
  }

  // 1. Palette fit
  const bad = all.filter((x) => x.colour.verdict === 'avoid');
  const caution = [p.top, p.outer].filter((x) => x && x.colour.verdict === 'caution') as Piece[];
  if (bad.length) checks.push({ label: 'Colour vs your palette', status: 'bad', detail: `${bad.map((b) => b.colour.name).join(', ')} works against warm deep-autumn colouring. ${bad[0].colour.note ?? ''}` });
  else if (caution.length) checks.push({ label: 'Colour vs your palette', status: 'warn', detail: `${caution[0].colour.name} near the face is a caution colour for you. ${caution[0].colour.note ?? ''}` });
  else checks.push({ label: 'Colour vs your palette', status: 'ok', detail: 'Every colour near your face sits in or alongside your Warm Deep Autumn palette.' });

  // 2. Number of statement colours
  const statements = new Set(main.filter((x) => x.colour.family !== 'neutral' && !['navy', 'indigo', 'charcoal', 'white', 'black'].includes(x.colour.id)).map((x) => x.colour.id));
  if (statements.size >= 3) checks.push({ label: 'Colour count', status: 'warn', detail: `${statements.size} statement colours compete. Keep it to one or two and let neutrals do the rest.` });
  else checks.push({ label: 'Colour count', status: 'ok', detail: statements.size === 0 ? 'All neutrals: easy and refined. Add interest through texture.' : `${statements.size} statement colour${statements.size > 1 ? 's' : ''} against neutrals: controlled.` });

  // 3. Waist contrast (oval / transitioning shape)
  const diff = Math.abs(p.top.colour.depth - p.bottom.colour.depth);
  const kurta = p.top.kind.shape === 'kurta';
  if (kurta) checks.push({ label: 'Proportion at the waist', status: 'ok', detail: 'A kurta runs past the hips, so there is no waist line at all. It is one long vertical column.' });
  else if (diff >= 2 && !p.outer) checks.push({ label: 'Proportion at the waist', status: 'warn', detail: `Strong ${p.top.colour.depth > p.bottom.colour.depth ? 'dark-over-light' : 'light-over-dark'} contrast meets at your stomach and draws a horizontal line there. Add an open layer, or choose closer tones.` });
  else if (diff >= 2 && p.outer) checks.push({ label: 'Proportion at the waist', status: 'ok', detail: 'The top and bottom contrast strongly, but the open outer layer bridges them with two vertical lines.' });
  else checks.push({ label: 'Proportion at the waist', status: 'ok', detail: 'Top and bottom are close in depth, so there is no hard horizontal break at the midsection.' });

  // 4. Vertical lines / body
  const careful = main.filter((x) => x.kind.body === 'careful');
  if (p.outer && ['blazer', 'overshirt', 'cardigan', 'jacket', 'coat', 'nehru'].includes(p.outer.kind.outerShape ?? '')) checks.push({ label: 'Vertical lines', status: 'ok', detail: `The open ${p.outer.kind.label.toLowerCase()} creates two long vertical edges from shoulder to hip, which is your most flattering effect.` });
  if (careful.length) checks.push({ label: 'Fit on your body', status: 'warn', detail: careful.map((c) => `${c.kind.label}: ${c.kind.bodyNote ?? 'needs careful sizing.'}`).join(' ') });
  else {
    const flat = main.find((x) => x.kind.body === 'flattering' && x.kind.bodyNote);
    checks.push({ label: 'Fit on your body', status: 'ok', detail: flat ? `${flat.kind.label}: ${flat.kind.bodyNote}` : 'No pieces that cling or add volume at the midsection.' });
  }

  // 5. Volume on volume
  if (['hoodie', 'knit'].includes(p.top.kind.shape ?? '') && p.bottom.kind.legShape === 'relaxed' && !p.outer) checks.push({ label: 'Balance', status: 'warn', detail: 'A soft, bulky top over relaxed trousers adds volume everywhere. Pair one relaxed piece with one structured piece.' });

  // 6. Formality
  const f = main.map((x) => x.kind.formality);
  const spread = Math.max(...f) - Math.min(...f);
  const avg = f.reduce((a, b) => a + b, 0) / f.length;
  if (p.footwear.kind.formality <= 2 && p.bottom.kind.formality >= 5) checks.push({ label: 'Formality', status: 'bad', detail: `${p.footwear.kind.label} with ${p.bottom.kind.label.toLowerCase()} clash: formal trousers need leather shoes.` });
  else if (spread >= 3) checks.push({ label: 'Formality', status: 'warn', detail: `The pieces range from formality ${Math.min(...f)} to ${Math.max(...f)}. One piece is noticeably dressier or more casual than the rest.` });
  else checks.push({ label: 'Formality', status: 'ok', detail: `Consistent formality (${avg.toFixed(1)} / 5).` });
  if (ctx.occasionRange) {
    const [lo, hi] = ctx.occasionRange;
    if (avg < lo - 0.5) checks.push({ label: 'Occasion', status: 'warn', detail: `Too casual for this occasion (needs ${lo}–${hi}, outfit is ${avg.toFixed(1)}).` });
    else if (avg > hi + 0.7) checks.push({ label: 'Occasion', status: 'warn', detail: `Overdressed for this occasion (needs ${lo}–${hi}, outfit is ${avg.toFixed(1)}).` });
    else checks.push({ label: 'Occasion', status: 'ok', detail: 'The formality fits the occasion.' });
  }

  // 7. Seasons
  let seasons = (['summer', 'monsoon', 'winter', 'transitional'] as Season[]).filter((s) => main.every((x) => x.kind.seasons.includes(s)));
  if (!seasons.length) {
    checks.push({ label: 'Season', status: 'warn', detail: 'These pieces do not share a season: one is a hot-weather piece and another is a cold-weather piece.' });
    seasons = [];
  } else if (ctx.season && !seasons.includes(ctx.season)) checks.push({ label: 'Season', status: 'warn', detail: `Not ideal in ${ctx.season}: it suits ${seasons.join(', ')}.` });
  else checks.push({ label: 'Season', status: 'ok', detail: `Works in ${seasons.join(', ')}.` });

  // 8. Fabric compatibility
  const fab = main.map((x) => x.kind.fabric);
  if (fab.includes('linen') && (fab.includes('merino') || fab.includes('wool') || fab.includes('suede'))) checks.push({ label: 'Fabric', status: 'warn', detail: 'Linen (hot weather) is mixed with wool, merino or suede (cool weather). The textures and seasons fight each other.' });
  else if (p.footwear.kind.fabric === 'suede' && seasons.length === 1 && seasons[0] === 'monsoon') checks.push({ label: 'Fabric', status: 'warn', detail: 'Suede in the monsoon will stain.' });
  else checks.push({ label: 'Fabric', status: 'ok', detail: 'The fabric weights belong together.' });

  // 9. Leather harmony
  const belt = p.accessories?.find((a) => a.kind.wardrobe === 'Belts');
  const leatherShoe = ['leather', 'suede'].includes(p.footwear.kind.fabric) && p.footwear.kind.wardrobe !== 'White sneakers';
  if (belt && leatherShoe) {
    const sb = BROWNS.has(p.footwear.colour.id), bb = BROWNS.has(belt.colour.id);
    if (sb !== bb) checks.push({ label: 'Belt and shoes', status: 'warn', detail: 'Belt and shoes are from different leather families (brown vs black). Match them.' });
    else checks.push({ label: 'Belt and shoes', status: 'ok', detail: 'Belt and shoes share a leather family.' });
  }
  if (p.bottom.kind.formality >= 4 && !belt && p.top.kind.shape !== 'kurta' && p.bottom.kind.legShape !== 'jogger') checks.push({ label: 'Belt', status: 'warn', detail: 'Tailored trousers with a tucked shirt look unfinished without a belt (unless they have side adjusters).' });

  const score = Math.max(0, 100 - checks.filter((c) => c.status === 'warn').length * 10 - checks.filter((c) => c.status === 'bad').length * 25);
  return { score, checks, formality: Number(avg.toFixed(1)), seasons, colourLogic: colourLogic(p.top.colour, p.bottom.colour) };
}

export function evaluateOutfit(state: AppState, o: Outfit, ctx?: Parameters<typeof evaluate>[1]) {
  const comps = outfitComponents(state, o);
  const by = (k: string) => comps.find((c) => c.key === k)?.piece;
  return evaluate({ top: by('top'), bottom: by('bottom'), footwear: by('footwear'), outer: by('outer'), accessories: comps.filter((c) => c.slot === 'accessory').map((c) => c.piece!).filter(Boolean) }, ctx);
}

// ───────── Wardrobe-wide analysis ─────────

export function ownedPool(state: AppState) {
  const fromPieces = pieces.filter((p) => isOwned(state, p.id));
  const linked = new Set(fromPieces.map((p) => p.id));
  const fromItems = state.items.filter((i) => i.status === 'OWNED' && !(itemPieceId(i) && linked.has(itemPieceId(i)!))).map(itemAsPiece);
  const all = [...fromPieces, ...fromItems];
  return {
    all,
    top: all.filter((p) => p.kind.slot === 'top'),
    bottom: all.filter((p) => p.kind.slot === 'bottom'),
    footwear: all.filter((p) => p.kind.slot === 'footwear'),
    outer: all.filter((p) => p.kind.slot === 'outer'),
    accessory: all.filter((p) => p.kind.slot === 'accessory'),
  };
}

export interface Combo { key: string; top: Piece; bottom: Piece; footwear: Piece; outer?: Piece; accessories: Piece[]; ev: Evaluation }

export function bestAccessories(pool: Piece[], top: Piece, bottom: Piece, footwear: Piece): Piece[] {
  const out: Piece[] = [];
  const belts = pool.filter((p) => p.kind.wardrobe === 'Belts');
  if (bottom.kind.formality >= 3 && bottom.kind.legShape !== 'jogger' && top.kind.shape !== 'kurta' && belts.length) {
    const brownShoe = BROWNS.has(footwear.colour.id) || footwear.kind.wardrobe === 'White sneakers';
    out.push(belts.find((b) => BROWNS.has(b.colour.id) === brownShoe) ?? belts[0]);
  }
  const watches = pool.filter((p) => p.kind.wardrobe === 'Watches');
  if (watches.length) {
    const formal = (top.kind.formality + bottom.kind.formality) / 2 >= 3;
    out.push((formal ? watches.find((w) => w.kind.id !== 'watch-smart') : watches.find((w) => w.kind.id === 'watch-smart')) ?? watches[0]);
  }
  const glasses = pool.find((p) => p.kind.wardrobe === 'Eyeglasses');
  if (glasses) out.push(glasses);
  return out;
}

export function generateCombos(state: AppState, opts: { season?: Season; occasionRange?: [number, number]; withOuter?: boolean; minScore?: number; limit?: number; fixed?: Partial<Record<'top' | 'bottom' | 'footwear' | 'outer', string>> } = {}): Combo[] {
  const pool = ownedPool(state);
  const pick = (slot: 'top' | 'bottom' | 'footwear', id?: string) => (id ? pool[slot].filter((p) => p.id === id) : pool[slot]);
  const outers: (Piece | undefined)[] = opts.fixed?.outer ? pool.outer.filter((p) => p.id === opts.fixed!.outer) : [undefined, ...(opts.withOuter === false ? [] : pool.outer)];
  const res: Combo[] = [];
  for (const top of pick('top', opts.fixed?.top))
    for (const bottom of pick('bottom', opts.fixed?.bottom))
      for (const footwear of pick('footwear', opts.fixed?.footwear))
        for (const outer of outers) {
          if (outer && top.kind.shape === 'knit' && outer.kind.outerShape !== 'blazer') continue;
          const accessories = bestAccessories(pool.accessory, top, bottom, footwear);
          const ev = evaluate({ top, bottom, footwear, outer, accessories }, { season: opts.season, occasionRange: opts.occasionRange });
          if (ev.score >= (opts.minScore ?? 70)) res.push({ key: [top.id, bottom.id, footwear.id, outer?.id ?? '-'].join('|'), top, bottom, footwear, outer, accessories, ev });
        }
  res.sort((a, b) => b.ev.score - a.ev.score);
  return opts.limit ? res.slice(0, opts.limit) : res;
}

/** Count good combinations a set of catalogue pieces can make. */
export function countCombos(ids: string[], minScore = 75) {
  const ps = ids.map((i) => pieceById[i]).filter(Boolean);
  const by = (s: Slot) => ps.filter((p) => p.kind.slot === s);
  const acc = by('accessory');
  let n = 0;
  for (const top of by('top')) for (const bottom of by('bottom')) for (const footwear of by('footwear'))
    for (const outer of [undefined, ...by('outer')]) {
      if (outer && top.kind.shape === 'knit' && outer.kind.outerShape !== 'blazer') continue;
      if (evaluate({ top, bottom, footwear, outer, accessories: bestAccessories(acc, top, bottom, footwear) }).score >= minScore) n++;
    }
  return n;
}

export interface GapItem { pieceId: string; completes: number; appears: number; outfitIds: string[] }

export function gapRanking(state: AppState): GapItem[] {
  const map = new Map<string, GapItem>();
  for (const o of outfits) {
    const c = completion(state, o);
    for (const m of c.missing) {
      if (m.ref.startsWith('item:')) continue;
      if (pieceStatus(state, m.ref) === 'NOT_INTERESTED') continue;
      const g = map.get(m.ref) ?? { pieceId: m.ref, completes: 0, appears: 0, outfitIds: [] };
      g.appears++;
      if (c.missing.length === 1) { g.completes++; g.outfitIds.push(o.id); }
      map.set(m.ref, g);
    }
  }
  return [...map.values()].sort((a, b) => b.completes - a.completes || b.appears - a.appears);
}

export function wardrobeInsights(state: AppState) {
  const pool = ownedPool(state);
  const count = (pred: (p: Piece) => boolean) => pool.all.filter(pred).length;
  const insights: { level: 'gap' | 'ok' | 'dup'; text: string }[] = [];
  const casualTops = count((p) => p.kind.slot === 'top' && p.kind.formality <= 2);
  const smartTops = count((p) => p.kind.slot === 'top' && p.kind.formality >= 3);
  const bottoms = pool.bottom.length;
  const smartShoes = count((p) => p.kind.slot === 'footwear' && p.kind.formality >= 3);
  const layers = pool.outer.length;
  const traditional = count((p) => p.kind.shape === 'kurta');
  const belts = count((p) => p.kind.wardrobe === 'Belts');
  if (bottoms < 3) insights.push({ level: 'gap', text: `Only ${bottoms} bottom${bottoms === 1 ? '' : 's'}. Each extra trouser multiplies every top you own, so this is usually the highest-leverage gap.` });
  if (smartShoes === 0) insights.push({ level: 'gap', text: 'No smart-casual footwear (loafers, derbies, Chelsea boots). Every office, date and family outfit on this site needs one.' });
  if (layers === 0) insights.push({ level: 'gap', text: 'No layering piece (overshirt, blazer, cardigan). Layers are your main proportion tool and your answer to office AC.' });
  if (smartTops === 0) insights.push({ level: 'gap', text: 'No collared smart top (Oxford, twill, knitted polo).' });
  if (traditional === 0) insights.push({ level: 'gap', text: 'No Indian wear. One ivory kurta covers most festivals and family functions.' });
  if (belts === 0) insights.push({ level: 'gap', text: 'No belt. Tucked shirts and tailored trousers look unfinished without one.' });
  if (casualTops >= 5 && bottoms < 3) insights.push({ level: 'dup', text: `You have ${casualTops} casual tops but only ${bottoms} bottoms. You have enough tops, so add trousers first.` });
  const dupMap: Record<string, number> = {};
  state.items.filter((i) => i.status === 'OWNED').forEach((i) => { const k = itemPieceId(i) ?? `${i.category}|${(i.colourText ?? '').toLowerCase()}`; dupMap[k] = (dupMap[k] ?? 0) + 1; });
  Object.entries(dupMap).filter(([, n]) => n > 1).forEach(([k, n]) => insights.push({ level: 'dup', text: `${n}× ${pieceById[k]?.name ?? k.replace('|', ' ')}: likely duplicates.` }));
  // Low versatility: owned pieces that appear in no catalogue outfit and in few generated combos
  const combos = generateCombos(state, { minScore: 70 });
  const usage: Record<string, number> = {};
  combos.forEach((c) => [c.top, c.bottom, c.footwear, c.outer].forEach((p) => p && (usage[p.id] = (usage[p.id] ?? 0) + 1)));
  pool.all.filter((p) => ['top', 'bottom', 'footwear', 'outer'].includes(p.kind.slot) && (usage[p.id] ?? 0) === 0).forEach((p) => insights.push({ level: 'dup', text: `${p.name} pairs with nothing else you own yet (low versatility).` }));
  if (!insights.length) insights.push({ level: 'ok', text: 'No obvious gaps. Your wardrobe covers the basics.' });
  return { insights, combos: combos.length, counts: { casualTops, smartTops, bottoms, smartShoes, layers, traditional, belts } };
}

export const currentSeason = (d = new Date()): Season => {
  const m = d.getMonth() + 1;
  if (m >= 3 && m <= 5) return 'summer';
  if (m >= 6 && m <= 9) return 'monsoon';
  if (m >= 10 && m <= 11) return 'transitional';
  return 'winter';
};

export const inr = (n?: number) => (n || n === 0 ? `₹${Math.round(n).toLocaleString('en-IN')}` : '—');
