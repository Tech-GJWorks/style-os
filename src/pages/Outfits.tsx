import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Camera, Columns2, Heart, RotateCcw, Shirt, Trash2 } from 'lucide-react';
import { collections, outfits, outfitById } from '../data/outfits';
import { fabricById } from '../data/fabrics';
import { useStore, compressImage } from '../lib/store';
import { completion, currentSeason, evaluateOutfit, inr, outfitComponents, ownedPool } from '../lib/engine';
import { slotLabel } from '../lib/catalogue';
import type { Outfit } from '../data/types';
import { Badge, Card, CheckLine, Note, PageHeader, Section, Swatch, Table, btnGhost, inputCls } from '../components/ui';
import { CompletionBadge, OutfitCard, OutfitVisual, PieceStatusRow, useOutfitActions } from '../components/OutfitCard';

const filters = [
  { id: 'all', label: 'All outfits' }, { id: 'complete', label: 'Complete' }, { id: 'incomplete', label: 'Incomplete' },
  { id: 'today', label: 'Wear today' }, { id: 'fav', label: 'Favourites' }, { id: 'planned', label: 'Planned' },
  { id: 'date', label: 'Date' }, { id: 'office', label: 'Office' }, { id: 'casual', label: 'Casual' }, { id: 'travel', label: 'Travel' }, { id: 'traditional', label: 'Traditional' },
];
const tagMatch: Record<string, string[]> = {
  date: ['date', 'first-date', 'dinner', 'romantic', 'anniversary'], office: ['office', 'business', 'client', 'presentation', 'interview'],
  casual: ['casual', 'weekend', 'friends', 'coffee'], travel: ['travel', 'airport', 'flight', 'train', 'hill', 'city'], traditional: ['festive', 'wedding', 'diwali', 'family', 'religious', 'engagement'],
};

export function OutfitsPage() {
  const { state } = useStore();
  const [f, setF] = useState('all');
  const [q, setQ] = useState('');
  const [compare, setCompare] = useState<string[]>([]);
  const season = currentSeason();
  const list = useMemo(() => outfits.filter((o) => {
    const c = completion(state, o);
    if (q && !(o.name + o.occasions.join(' ') + o.top + o.bottom).toLowerCase().includes(q.toLowerCase())) return false;
    switch (f) {
      case 'complete': return c.status === 'Complete';
      case 'incomplete': return c.status !== 'Complete';
      case 'today': return c.status === 'Complete' && o.seasons.includes(season);
      case 'fav': return state.favourites.includes(o.id);
      case 'planned': return state.planned.includes(o.id);
      case 'all': return true;
      default: return o.occasions.some((t) => tagMatch[f].includes(t)) || o.collection === f;
    }
  }), [state, f, q, season]);
  const counts = { complete: outfits.filter((o) => completion(state, o).status === 'Complete').length, almost: outfits.filter((o) => completion(state, o).status === 'Almost complete').length };
  return (
    <div>
      <PageHeader eyebrow="Ownership tracker" title="My Outfit Combinations">
        Every recommended outfit, its components and whether you own each one. <b>{counts.complete}</b> complete, <b>{counts.almost}</b> almost complete, out of {outfits.length}. Required components count toward completion. Optional accessories never reduce it.
      </PageHeader>
      <div className="mb-4 flex flex-wrap gap-2">{filters.map((x) => <button key={x.id} onClick={() => setF(x.id)} className={`rounded-full border px-3 py-1 text-xs ${f === x.id ? 'border-olive bg-olive text-ivory' : 'border-camel-light bg-paper'}`}>{x.label}</button>)}</div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <input className={`${inputCls} max-w-xs`} placeholder="Search outfits…" value={q} onChange={(e) => setQ(e.target.value)} />
        <span className="text-sm text-choc-soft">{list.length} shown</span>
        <span className="ml-auto text-xs text-choc-soft"><Columns2 className="inline h-4 w-4" /> Tick two outfits to compare them side by side</span>
      </div>
      {compare.length === 2 && <Compare a={outfitById[compare[0]]} b={outfitById[compare[1]]} onClose={() => setCompare([])} />}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((o) => (
          <div key={o.id} className="relative">
            <label className="absolute right-12 top-3 z-10 flex items-center gap-1 rounded bg-paper/90 px-1.5 py-0.5 text-[10px]"><input type="checkbox" checked={compare.includes(o.id)} onChange={(e) => setCompare((c) => (e.target.checked ? [...c, o.id].slice(-2) : c.filter((x) => x !== o.id)))} /> compare</label>
            <OutfitCard o={o} detailed />
          </div>
        ))}
      </div>
    </div>
  );
}

function Compare({ a, b, onClose }: { a: Outfit; b: Outfit; onClose: () => void }) {
  const { state } = useStore();
  const col = (o: Outfit) => {
    const ev = evaluateOutfit(state, o); const c = completion(state, o); const comps = outfitComponents(state, o);
    return { ev, c, comps };
  };
  const A = col(a), B = col(b);
  const row = (label: string, fa: (x: typeof A, o: Outfit) => React.ReactNode) => [<b>{label}</b>, fa(A, a), fa(B, b)];
  return (
    <Card className="mb-8">
      <div className="mb-3 flex items-center justify-between"><h3 className="font-serif text-2xl">Side-by-side</h3><button className={btnGhost} onClick={onClose}>Close</button></div>
      <div className="grid grid-cols-2 gap-4">{[a, b].map((o) => <Link key={o.id} to={`/outfit/${o.id}`} className="rounded-lg bg-sand/50 pt-3 text-center"><OutfitVisual o={o} className="h-80" /><div className="pb-2 font-serif text-lg">{o.name}</div></Link>)}</div>
      <div className="mt-4"><Table head={['', a.id.toUpperCase(), b.id.toUpperCase()]} rows={[
        row('Score', (x) => x.ev.score),
        row('Ownership', (x) => <CompletionBadge status={x.c.status} pct={x.c.pct} />),
        row('Missing', (x) => x.c.missing.map((m) => m.piece?.name).join(', ') || '—'),
        row('Est. cost', (x) => inr(x.c.cost)),
        row('Formality', (x) => x.ev.formality),
        row('Seasons', (_, o) => o.seasons.join(', ')),
        row('Occasions', (_, o) => o.occasions.join(', ')),
        row('Impression', (_, o) => o.impression.join(', ')),
        row('Colour logic', (x) => <span className="text-xs">{x.ev.colourLogic}</span>),
        row('Warnings', (x) => <span className="text-xs">{x.ev.checks.filter((c) => c.status !== 'ok').map((c) => c.label).join(', ') || 'None'}</span>),
      ]} /></div>
    </Card>
  );
}

export function OutfitDetail() {
  const { id } = useParams();
  const { state, update } = useStore();
  const { toggleFav, isFav } = useOutfitActions();
  const o = outfitById[id ?? ''];
  const pool = ownedPool(state);
  if (!o) return <p>Outfit not found. <Link className="underline" to="/outfits">All outfits</Link></p>;
  const comps = outfitComponents(state, o);
  const c = completion(state, o);
  const ev = evaluateOutfit(state, o);
  const planned = state.planned.includes(o.id);
  const sub = (key: string, ref: string | null) => update((s) => {
    const cur = { ...(s.subs[o.id] ?? {}) };
    if (ref) cur[key] = ref; else delete cur[key];
    return { ...s, subs: { ...s.subs, [o.id]: cur } };
  });
  const options = (slot: string, kindWardrobe?: string) => (slot === 'accessory' ? pool.accessory.filter((p) => !kindWardrobe || p.kind.wardrobe === kindWardrobe) : pool[slot as 'top']);
  const onPhoto = async (file?: File) => { if (!file) return; const url = await compressImage(file, 1000); update((s) => ({ ...s, photos: { ...s.photos, [o.id]: url } })); };
  const groups: [string, string[]][] = [['TOP', ['top']], ['OUTERWEAR', ['outer']], ['BOTTOM', ['bottom']], ['SHOES', ['footwear']], ['ACCESSORIES', comps.filter((x) => x.slot === 'accessory').map((x) => x.key)]];
  return (
    <div>
      <Link to="/outfits" className="mb-4 inline-flex items-center gap-1 text-sm text-rust"><ArrowLeft className="h-4 w-4" /> My Outfit Combinations</Link>
      <PageHeader eyebrow={`Outfit ${o.id.toUpperCase()} · ${collections.find((x) => x.id === o.collection)?.name}`} title={o.name}>{o.why}</PageHeader>
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <div className="space-y-4">
          <Card className="bg-gradient-to-b from-sand to-paper"><OutfitVisual o={o} className="h-[520px]" /></Card>
          <div className="flex flex-wrap gap-2">
            <button className={btnGhost} onClick={() => toggleFav(o.id)}><Heart className={`h-4 w-4 ${isFav(o.id) ? 'fill-rust text-rust' : ''}`} /> {isFav(o.id) ? 'Saved' : 'Save to favourites'}</button>
            <button className={btnGhost} onClick={() => update((s) => ({ ...s, planned: planned ? s.planned.filter((x) => x !== o.id) : [...s.planned, o.id] }))}>{planned ? 'Planned ✓' : 'Plan this outfit'}</button>
            <button className={btnGhost} onClick={() => update((s) => ({ ...s, worn: { ...s.worn, [o.id]: [...(s.worn[o.id] ?? []), new Date().toISOString().slice(0, 10)] } }))}><Shirt className="h-4 w-4" /> Wore it today ({state.worn[o.id]?.length ?? 0})</button>
            <label className={`${btnGhost} cursor-pointer`}><Camera className="h-4 w-4" /> {state.photos[o.id] ? 'Replace my photo' : 'Add my photo in this outfit'}<input type="file" accept="image/*" className="hidden" onChange={(e) => onPhoto(e.target.files?.[0])} /></label>
            {state.photos[o.id] && <button className={btnGhost} onClick={() => update((s) => { const p = { ...s.photos }; delete p[o.id]; return { ...s, photos: p }; })}><Trash2 className="h-4 w-4" /> Remove photo</button>}
          </div>
        </div>
        <div className="space-y-6">
          <Card>
            <div className="flex flex-wrap items-center gap-3">
              <CompletionBadge status={c.status} pct={c.pct} />
              <span className="text-sm">{c.owned} of {c.required} required items owned · {c.missing.length} missing{c.missing.length ? ` · est. ${inr(c.cost)} (indicative)` : ''}</span>
            </div>
            {groups.map(([g, keys]) => {
              const rows = comps.filter((x) => keys.includes(x.key));
              if (!rows.length) return null;
              return (
                <div key={g} className="mt-4">
                  <div className="text-xs font-semibold tracking-widest text-choc-soft">{g}</div>
                  {rows.map((x) => (
                    <div key={x.key} className="mt-1 rounded-lg border border-camel-light/60 px-3">
                      {x.ref.startsWith('item:') ? (
                        <div className="flex items-center justify-between py-2 text-sm"><span>{x.piece?.name} <Badge tone="green">Owned · your item</Badge></span></div>
                      ) : <PieceStatusRow pieceId={x.ref} label={`${x.piece?.name ?? x.ref}${x.substituted ? ' (substitute)' : ''}`} required={x.required} />}
                      <div className="flex flex-wrap items-center gap-2 pb-2 text-xs text-choc-soft">
                        {x.piece && <><Swatch hex={x.piece.colour.hex} size="sm" /> {fabricById[x.piece.kind.fabric]?.name ?? x.piece.kind.fabric} · formality {x.piece.kind.formality}</>}
                        {(!x.owned || x.substituted) && (
                          <select className="ml-auto rounded border border-camel-light bg-white px-2 py-0.5" value={x.substituted ? x.ref : ''} onChange={(e) => sub(x.key, e.target.value || null)}>
                            <option value="">{x.substituted ? '↩ Restore original' : `Replace with something I own…`}</option>
                            {options(x.slot, x.slot === 'accessory' ? x.piece?.kind.wardrobe : undefined).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                          </select>
                        )}
                        {x.substituted && <button onClick={() => sub(x.key, null)} aria-label="Restore"><RotateCcw className="h-3.5 w-3.5" /></button>}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
            <p className="mt-3 text-xs text-choc-soft">Ownership is matched by exact garment type and colour, so owning "a similar shirt" does not count. Use Replace to swap in an item you actually own. The styling check below re-runs on the swap.</p>
          </Card>
          <Section title="Why does this outfit work?">
            <Card>
              <p className="text-sm">{ev.colourLogic}</p>
              <ul className="mt-2 divide-y divide-camel-light/50 text-sm">{ev.checks.map((x) => <CheckLine key={x.label} {...x} />)}</ul>
              <div className="mt-3 text-xs text-choc-soft">Score {ev.score}/100 · formality {ev.formality}/5 · seasons: {o.seasons.join(', ')} · weather: {o.weather} · impression: {o.impression.join(', ')} · difficulty {o.difficulty}/3</div>
            </Card>
          </Section>
          <Note>Grooming and fragrance for this look: see the matching occasion in <Link to="/occasions" className="underline">Occasion-Based Styling</Link>.</Note>
        </div>
      </div>
      <Section title="Similar outfits"><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{outfits.filter((x) => x.id !== o.id && x.occasions.some((t) => o.occasions.includes(t))).slice(0, 3).map((x) => <OutfitCard key={x.id} o={x} />)}</div></Section>
      <p className="text-xs text-choc-soft">{slotLabel.top}s, bottoms and shoes are always required. Belts are required where the outfit lists them. Watches, glasses and bags are optional.</p>
    </div>
  );
}
