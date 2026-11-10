import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import type { Outfit, Ownership } from '../data/types';
import { useStore } from '../lib/store';
import { completion, inr, outfitComponents, pieceStatus } from '../lib/engine';
import { OutfitFigure } from './OutfitFigure';
import { Badge, StatusPicker, Swatch } from './ui';
import { collections } from '../data/outfits';
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

export function OutfitCard({ o, detailed }: { o: Outfit; detailed?: boolean }) {
  const { state } = useStore();
  const { toggleFav, isFav } = useOutfitActions();
  const comps = outfitComponents(state, o);
  const c = completion(state, o);
  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-camel-light/70 bg-paper">
      <Link to={`/outfit/${o.id}`} className="relative block bg-gradient-to-b from-sand/70 to-paper px-6 pt-4">
        <OutfitVisual o={o} />
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <Link to={`/outfit/${o.id}`} className="font-serif text-lg font-semibold leading-tight hover:text-rust">{o.name}</Link>
          <button aria-label="Favourite" onClick={() => toggleFav(o.id)}><Heart className={`h-5 w-5 ${isFav(o.id) ? 'fill-rust text-rust' : 'text-camel'}`} /></button>
        </div>
        <div className="mt-1 text-xs text-choc-soft">{collections.find((x) => x.id === o.collection)?.name} · {o.occasions.slice(0, 3).join(', ')}</div>
        <div className="mt-3 flex items-center gap-1.5">
          {[o.top, o.outer, o.bottom, o.footwear].filter(Boolean).map((r) => { const p = comps.find((x) => x.original === r)?.piece; return p ? <Swatch key={r} hex={p.colour.hex} size="sm" /> : null; })}
          <span className="ml-auto"><CompletionBadge status={c.status} pct={c.pct} /></span>
        </div>
        {detailed && (
          <ul className="mt-3 space-y-1 text-xs">
            {comps.filter((x) => x.required).map((x) => (
              <li key={x.key} className="flex items-center justify-between gap-2">
                <span className={x.owned ? 'text-choc' : 'text-choc-soft'}>{x.piece?.name ?? x.ref}</span>
                <span className={`h-2 w-2 shrink-0 rounded-full ${x.owned ? 'bg-emerald-600' : pieceStatus(state, x.ref) === 'WANT' || pieceStatus(state, x.ref) === 'PLANNED' ? 'bg-amber-500' : 'bg-stone-300'}`} />
              </li>
            ))}
          </ul>
        )}
        {c.missing.length > 0 && <div className="mt-auto pt-3 text-xs text-choc-soft">Missing {c.missing.length} · est. {inr(c.cost)} <span className="opacity-70">(indicative)</span></div>}
      </div>
    </div>
  );
}

export function PieceStatusRow({ pieceId, label, required = true }: { pieceId: string; label?: string; required?: boolean }) {
  const { state } = useStore();
  const { setStatus } = useOutfitActions();
  const linked = state.items.some((i) => i.status === 'OWNED' && `${i.kindId}:${i.colourId}` === pieceId);
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <div className="min-w-0">
        <div className="truncate text-sm">{label}</div>
        {!required && <div className="text-[11px] text-choc-soft">Optional</div>}
        {linked && <div className="text-[11px] text-emerald-700">Owned via a wardrobe item</div>}
      </div>
      <StatusPicker value={pieceStatus(state, pieceId)} onChange={(s) => setStatus(pieceId, s)} compact />
    </div>
  );
}
