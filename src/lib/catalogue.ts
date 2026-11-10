import { colourById } from '../data/colours';
import { kindById } from '../data/kinds';
import { outfits } from '../data/outfits';
import { capsules, seedOwned } from '../data/content';
import type { Piece } from '../data/types';

export function makePiece(id: string): Piece | undefined {
  const [k, c] = id.split(':');
  const kind = kindById[k];
  const colour = colourById[c];
  if (!kind || !colour) {
    if (import.meta.env.DEV) console.warn('Unknown piece', id);
    return undefined;
  }
  const colourName = colour.name.replace(/-tone metal/, '-tone');
  const words = kind.label.split(' ');
  const label = words.length > 1 && colourName.toLowerCase().includes(words[0].toLowerCase()) ? words.slice(1).join(' ') : kind.label;
  return { id, kind, colour, name: `${colourName} ${label.charAt(0).toLowerCase()}${label.slice(1)}` };
}

const ids = new Set<string>();
for (const o of outfits) [o.top, o.bottom, o.footwear, o.outer, ...o.required, ...o.optional].forEach((p) => p && ids.add(p));
capsules.forEach((c) => c.pieces.forEach((p) => ids.add(p)));
seedOwned.forEach((p) => ids.add(p));

export const pieces: Piece[] = [...ids].map(makePiece).filter((p): p is Piece => !!p).sort((a, b) => a.kind.wardrobe.localeCompare(b.kind.wardrobe) || a.name.localeCompare(b.name));
export const pieceById: Record<string, Piece> = Object.fromEntries(pieces.map((p) => [p.id, p]));

export const slotLabel: Record<string, string> = { top: 'Top', bottom: 'Bottom', footwear: 'Footwear', outer: 'Outerwear', accessory: 'Accessory' };
