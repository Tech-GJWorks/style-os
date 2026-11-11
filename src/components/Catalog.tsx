import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, X } from 'lucide-react';
import type { Outfit } from '../data/types';
import { collections } from '../data/outfits';
import { assetByOutfit } from '../data/imageAssets';
import { useStore } from '../lib/store';
import { completion, outfitComponents } from '../lib/engine';
import { OutfitFigure } from './OutfitFigure';
import { useOutfitActions, useRenders } from './OutfitCard';

export function lookImageSrc(o: Outfit, renders: Set<string>, photos: Record<string, string>) {
  if (photos[o.id]) return photos[o.id];
  if (renders.has(o.id)) return `${import.meta.env.BASE_URL}${assetByOutfit[o.id].path}`;
  return undefined;
}

/** Photo-first image: your own upload, then the personalised render, then the proportion illustration. Fills its container. */
export function LookImage({ o, eager, onClick }: { o: Outfit; eager?: boolean; onClick?: () => void }) {
  const { state } = useStore();
  const renders = useRenders();
  const src = lookImageSrc(o, renders, state.photos);
  const comps = outfitComponents(state, o);
  const by = (k: string) => comps.find((c) => c.key === k)?.piece;
  if (src) return <img src={src} alt={o.name} loading={eager ? 'eager' : 'lazy'} onClick={onClick} className={`h-full w-full object-cover object-top ${onClick ? 'cursor-zoom-in' : ''}`} />;
  return (
    <div className="flex h-full w-full items-end justify-center pt-6" onClick={onClick}>
      <OutfitFigure className="h-[92%]" top={by('top')} bottom={by('bottom')} footwear={by('footwear')} outer={by('outer')} accessories={comps.filter((x) => x.slot === 'accessory').map((x) => x.piece!).filter(Boolean)} m={state.measurements} />
      <span className="absolute bottom-2 left-3 text-[9px] uppercase tracking-[0.2em] text-choc-soft">Illustration · photo pending</span>
    </div>
  );
}

export function LookCard({ o, size = 'md' }: { o: Outfit; size?: 'md' | 'lg' }) {
  const { state } = useStore();
  const { toggleFav, isFav } = useOutfitActions();
  const comps = outfitComponents(state, o);
  const c = completion(state, o);
  const swatches = [o.top, o.outer, o.bottom, o.footwear].filter(Boolean).map((r) => comps.find((x) => x.original === r)?.piece).filter(Boolean);
  return (
    <article className="group">
      <div className="relative aspect-[3/4] overflow-hidden bg-sand">
        <Link to={`/outfit/${o.id}`} className="block h-full transition duration-500 group-hover:scale-[1.03]"><LookImage o={o} /></Link>
        <button aria-label="Save" onClick={() => toggleFav(o.id)} className="absolute right-3 top-3 rounded-full bg-ivory/80 p-1.5 backdrop-blur"><Heart className={`h-4 w-4 ${isFav(o.id) ? 'fill-rust text-rust' : 'text-choc'}`} /></button>
        {c.status === 'Complete' && <span className="absolute left-3 top-3 bg-olive px-2 py-1 text-[9px] uppercase tracking-[0.2em] text-ivory">In your wardrobe</span>}
      </div>
      <div className="mt-3">
        <div className="text-[10px] uppercase tracking-[0.22em] text-choc-soft">{collections.find((x) => x.id === o.collection)?.name}</div>
        <Link to={`/outfit/${o.id}`} className={`mt-1 block font-serif leading-tight hover:text-rust ${size === 'lg' ? 'text-2xl' : 'text-lg'}`}>{o.name}</Link>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex -space-x-1">{swatches.map((p, i) => <span key={i} className="h-3.5 w-3.5 rounded-full border border-ivory" style={{ background: p!.colour.hex }} title={p!.name} />)}</div>
          <span className="text-[11px] text-choc-soft">{o.occasions.slice(0, 2).join(' · ')}</span>
          <span className="ml-auto text-[10px] uppercase tracking-[0.15em] text-choc-soft">{c.owned}/{c.required} owned</span>
        </div>
      </div>
    </article>
  );
}

export function Lightbox({ o, onClose }: { o: Outfit; onClose: () => void }) {
  const { state } = useStore();
  const renders = useRenders();
  const src = lookImageSrc(o, renders, state.photos);
  const [zoom, setZoom] = useState(false);
  useEffect(() => { const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose(); window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k); }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85" onClick={onClose}>
      <button aria-label="Close" className="absolute right-5 top-5 text-ivory"><X /></button>
      {src ? (
        <div className={`max-h-full overflow-auto ${zoom ? 'cursor-zoom-out' : 'cursor-zoom-in'}`} onClick={(e) => { e.stopPropagation(); setZoom((z) => !z); }}>
          <img src={src} alt={o.name} className={zoom ? 'w-[160vw] max-w-none md:w-[1100px]' : 'max-h-[92vh] w-auto'} />
        </div>
      ) : <div className="text-ivory">No photo yet for this look.</div>}
    </div>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="text-[10px] uppercase tracking-[0.3em] text-olive">{children}</div>;
}

export function SectionHead({ eyebrow, title, link, linkTo }: { eyebrow?: string; title: string; link?: string; linkTo?: string }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4 border-b border-camel-light/70 pb-3">
      <div>{eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}<h2 className="mt-1 font-serif text-3xl md:text-4xl">{title}</h2></div>
      {link && linkTo && <Link to={linkTo} className="shrink-0 text-[11px] uppercase tracking-[0.2em] text-choc-soft hover:text-choc">{link} →</Link>}
    </div>
  );
}
