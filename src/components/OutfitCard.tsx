import type { Outfit, Ownership } from '../data/types';
import { useStore } from '../lib/store';
import { outfitComponents, pieceStatus } from '../lib/engine';
import { OutfitFigure } from './OutfitFigure';
import { Badge, StatusPicker } from './ui';
import { LookCard } from './Catalog';
import { assetByOutfit, loadManifest } from '../data/imageAssets';
import { useEffect, useState } from 'react';

export function useRenders() {
  const [set, setSet] = useState<Set<string>>(new Set());
  useEffect(() => { loadManifest().then(setSet); }, []);
  return set;
}

/** Priority: your uploaded photo → a generated personalised render (if listed in the manifest) → the proportion illustration. */
export function OutfitVisual({ o, className = 'h-64' }: { o: Outfit; className?: string }) {
  const { state } = useStore();
  const renders = useRenders();
  const comps = outfitComponents(state, o);
  const by = (k: string) => comps.find((c) => c.key === k)?.piece;
  const photo = state.photos[o.id];
  const render = renders.has(o.id) ? `${import.meta.env.BASE_URL}${assetByOutfit[o.id].path}` : undefined;
  const label = photo ? 'Your photo' : render ? 'Personalised render' : 'Illustration · not a photo';
  return (
    <div className="relative">
      {photo || render ? <img src={photo ?? render} alt={o.name} className={`mx-auto object-contain ${className}`} /> : (
        <OutfitFigure className={`mx-auto ${className}`} top={by('top')} bottom={by('bottom')} footwear={by('footwear')} outer={by('outer')} accessories={comps.filter((x) => x.slot === 'accessory').map((x) => x.piece!).filter(Boolean)} m={state.measurements} />
      )}
      <span className="absolute bottom-1 right-0 text-[10px] text-choc-soft">{label}</span>
    </div>
  );
}

export function useOutfitActions() {
  const { state, update } = useStore();
  return {
    setStatus: (pieceId: string, s: Ownership) => update((st) => ({ ...st, statuses: { ...st.statuses, [pieceId]: s } })),
    toggleFav: (id: string) => update((st) => ({ ...st, favourites: st.favourites.includes(id) ? st.favourites.filter((f) => f !== id) : [...st.favourites, id] })),
    isFav: (id: string) => state.favourites.includes(id),
  };
}

export function CompletionBadge({ status, pct }: { status: string; pct: number }) {
  const tone = status === 'Complete' ? 'green' : status === 'Almost complete' ? 'amber' : 'grey';
  return <Badge tone={tone}>{status} · {pct}%</Badge>;
}

export function OutfitCard({ o }: { o: Outfit; detailed?: boolean }) {
  return <LookCard o={o} />;
}

export function PieceStatusRow({ pieceId, label, required = true }: { pieceId: string; label?: string; required?: boolean }) {
  const { state } = useStore();
  const { setStatus } = useOutfitActions();
  const linked = state.items.some((i) => i.status === 'OWNED' && `${i.kindId}:${i.colourId}` === pieceId);
  return (
    <div className="flex min-w-0 items-center justify-between gap-3 py-2">
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm">{label}</div>
        {!required && <div className="text-[11px] text-choc-soft">Optional</div>}
        {linked && <div className="text-[11px] text-emerald-700">Owned via a wardrobe item</div>}
      </div>
      <StatusPicker value={pieceStatus(state, pieceId)} onChange={(s) => setStatus(pieceId, s)} compact />
    </div>
  );
}
