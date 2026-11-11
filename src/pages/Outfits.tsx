import { useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Camera, ChevronDown, Heart, RotateCcw, Shirt, SlidersHorizontal, Trash2, X } from 'lucide-react';
import { collections, outfits, outfitById } from '../data/outfits';
import { colourById } from '../data/colours';
import { fabricById } from '../data/fabrics';
import type { Outfit, Season } from '../data/types';
import { useStore, compressImage } from '../lib/store';
import { completion, currentSeason, evaluateOutfit, inr, outfitComponents, ownedPool } from '../lib/engine';
import { stylistNotes } from '../lib/stylist';
import { CheckLine, StatusPicker } from '../components/ui';
import { pieceStatus } from '../lib/engine';
import { Eyebrow, LookCard, LookImage, Lightbox } from '../components/Catalog';
import { useOutfitActions, useRenders } from '../components/OutfitCard';
import { occasionEdits } from './Home';

const seasonsList: Season[] = ['summer', 'monsoon', 'transitional', 'winter'];

export function OutfitsPage() {
  const { state } = useStore();
  const renders = useRenders();
  const [params, setParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const f = {
    edit: params.get('edit') ?? '', c: params.get('c') ?? '', colour: params.get('colour') ?? '', season: params.get('season') ?? '',
    fabric: params.get('fabric') ?? '', own: params.get('own') ?? '', fav: params.get('fav') === '1', photo: params.get('photo') === '1', q: params.get('q') ?? '',
  };
  const set = (k: string, v: string) => { const p = new URLSearchParams(params); if (v) p.set(k, v); else p.delete(k); setParams(p, { replace: true }); };
  const piecesOf = (o: Outfit) => outfitComponents(state, o).filter((c) => c.slot !== 'accessory').map((c) => c.piece!).filter(Boolean);
  const list = useMemo(() => outfits.filter((o) => {
    const edit = occasionEdits.find((e) => e.id === f.edit);
    if (edit && !o.occasions.some((t) => edit.tags.includes(t)) && !(f.edit === 'traditional' && o.collection === 'traditional')) return false;
    if (f.c && o.collection !== f.c) return false;
    if (f.colour && !piecesOf(o).some((p) => p.colour.id === f.colour)) return false;
    if (f.season && !o.seasons.includes(f.season as Season)) return false;
    if (f.fabric && !piecesOf(o).some((p) => p.kind.fabric === f.fabric)) return false;
    const c = completion(state, o);
    if (f.own === 'complete' && c.status !== 'Complete') return false;
    if (f.own === 'missing' && c.status === 'Complete') return false;
    if (f.own === 'today' && !(c.status === 'Complete' && o.seasons.includes(currentSeason()))) return false;
    if (f.fav && !state.favourites.includes(o.id)) return false;
    if (f.photo && !renders.has(o.id)) return false;
    if (f.q && !(o.name + o.why + o.occasions.join(' ')).toLowerCase().includes(f.q.toLowerCase())) return false;
    return true;
  }), [params, state, renders]);
  const colourOpts = [...new Set(outfits.flatMap((o) => piecesOf(o).map((p) => p.colour.id)))];
  const fabricOpts = [...new Set(outfits.flatMap((o) => piecesOf(o).map((p) => p.kind.fabric)))];
  const active = Object.entries(f).filter(([, v]) => v);
  const title = occasionEdits.find((e) => e.id === f.edit)?.name ?? collections.find((c) => c.id === f.c)?.name ?? 'All looks';
  const sel = 'w-full border-0 border-b border-camel-light bg-transparent py-2 text-sm focus:border-choc focus:outline-none';

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div><Eyebrow>The catalogue</Eyebrow><h1 className="mt-2 font-serif text-5xl md:text-6xl">{title}</h1><p className="mt-2 text-sm text-choc-soft">{list.length} looks</p></div>
        <div className="flex items-center gap-3">
          <input className="w-48 border-b border-camel-light bg-transparent py-2 text-sm focus:border-choc focus:outline-none" placeholder="Search looks" value={f.q} onChange={(e) => set('q', e.target.value)} />
          <button onClick={() => setShowFilters((s) => !s)} className="flex items-center gap-2 border border-choc px-4 py-2 text-[11px] uppercase tracking-[0.2em]"><SlidersHorizontal className="h-3.5 w-3.5" /> Filter</button>
        </div>
      </div>
      <div className="mb-6 flex flex-wrap gap-2">
        {[['', 'All'], ...occasionEdits.map((e) => [e.id, e.name])].map(([id, name]) => (
          <button key={id} onClick={() => set('edit', id)} className={`px-3 py-1.5 text-[11px] uppercase tracking-[0.15em] ${f.edit === id ? 'bg-choc text-ivory' : 'border border-camel-light hover:border-choc'}`}>{name}</button>
        ))}
      </div>
      {showFilters && (
        <div className="mb-8 grid gap-6 border border-camel-light bg-paper p-6 sm:grid-cols-2 lg:grid-cols-4">
          <label className="text-[10px] uppercase tracking-[0.2em] text-choc-soft">Category<select className={sel} value={f.c} onChange={(e) => set('c', e.target.value)}><option value="">All</option>{collections.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
          <label className="text-[10px] uppercase tracking-[0.2em] text-choc-soft">Colour<select className={sel} value={f.colour} onChange={(e) => set('colour', e.target.value)}><option value="">Any</option>{colourOpts.map((c) => <option key={c} value={c}>{colourById[c]?.name}</option>)}</select></label>
          <label className="text-[10px] uppercase tracking-[0.2em] text-choc-soft">Season<select className={sel} value={f.season} onChange={(e) => set('season', e.target.value)}><option value="">Any</option>{seasonsList.map((s) => <option key={s}>{s}</option>)}</select></label>
          <label className="text-[10px] uppercase tracking-[0.2em] text-choc-soft">Fabric<select className={sel} value={f.fabric} onChange={(e) => set('fabric', e.target.value)}><option value="">Any</option>{fabricOpts.map((x) => <option key={x} value={x}>{fabricById[x]?.name ?? x}</option>)}</select></label>
          <label className="text-[10px] uppercase tracking-[0.2em] text-choc-soft">Ownership<select className={sel} value={f.own} onChange={(e) => set('own', e.target.value)}><option value="">Any</option><option value="complete">I own every piece</option><option value="today">Wear today (owned + in season)</option><option value="missing">Needs a purchase</option></select></label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.fav} onChange={(e) => set('fav', e.target.checked ? '1' : '')} /> Favourites only</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.photo} onChange={(e) => set('photo', e.target.checked ? '1' : '')} /> With photo only</label>
          {active.length > 0 && <button onClick={() => setParams({}, { replace: true })} className="text-left text-[11px] uppercase tracking-[0.2em] underline">Clear all</button>}
        </div>
      )}
      {list.length === 0 ? (
        <div className="border border-dashed border-camel-light py-20 text-center">
          <p className="font-serif text-2xl">No looks match these filters.</p>
          <button onClick={() => setParams({}, { replace: true })} className="mt-4 text-[11px] uppercase tracking-[0.2em] underline">Clear filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 lg:grid-cols-4">{list.map((o) => <LookCard key={o.id} o={o} />)}</div>
      )}
    </div>
  );
}

export function OutfitDetail() {
  const { id } = useParams();
  const { state, update } = useStore();
  const { toggleFav, isFav, setStatus } = useOutfitActions();
  const renders = useRenders();
  const [zoom, setZoom] = useState(false);
  const [cmp, setCmp] = useState('');
  const [showCheck, setShowCheck] = useState(false);
  const o = outfitById[id ?? ''];
  const pool = ownedPool(state);
  if (!o) return <p>Look not found. <Link className="underline" to="/outfits">All looks</Link></p>;
  const comps = outfitComponents(state, o);
  const c = completion(state, o);
  const ev = evaluateOutfit(state, o);
  const notes = stylistNotes(state, o);
  const col = collections.find((x) => x.id === o.collection)!;
  const planned = state.planned.includes(o.id);
  const sub = (key: string, ref: string | null) => update((s) => { const cur = { ...(s.subs[o.id] ?? {}) }; if (ref) cur[key] = ref; else delete cur[key]; return { ...s, subs: { ...s.subs, [o.id]: cur } }; });
  const options = (slot: string, w?: string) => (slot === 'accessory' ? pool.accessory.filter((p) => !w || p.kind.wardrobe === w) : pool[slot as 'top']);
  const onPhoto = async (file?: File) => { if (!file) return; const url = await compressImage(file, 1200); update((s) => ({ ...s, photos: { ...s.photos, [o.id]: url } })); };
  const similar = outfits.filter((x) => x.id !== o.id && x.occasions.some((t) => o.occasions.includes(t))).sort((a, b) => Number(renders.has(b.id)) - Number(renders.has(a.id))).slice(0, 4);
  const other = cmp ? outfitById[cmp] : undefined;
  const label: Record<string, string> = { top: 'Top', outer: 'Layer', bottom: 'Trousers', footwear: 'Shoes' };
  const facts: [string, string][] = [['Occasion', o.occasions.slice(0, 3).join(', ')], ['Season', o.seasons.length >= 4 ? 'All year' : o.seasons.join(', ')], ['Formality', `${ev.formality} / 5`], ['Weather', o.weather], ['Styling level', ['', 'Easy', 'Intermediate', 'Advanced'][o.difficulty]], ['Price band', o.price]];

  return (
    <div>
      <div className="mb-6 text-[11px] uppercase tracking-[0.2em] text-choc-soft"><Link to="/outfits" className="hover:text-choc">Looks</Link> / <Link to={`/outfits?c=${o.collection}`} className="hover:text-choc">{col.name}</Link> / {o.id}</div>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
        <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
          <div className="relative aspect-[3/4] overflow-hidden bg-sand"><LookImage o={o} eager onClick={() => setZoom(true)} /></div>
          <div className="mt-4 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.15em]">
            <button onClick={() => toggleFav(o.id)} className="flex items-center gap-2 border border-camel-light px-3 py-2 hover:border-choc"><Heart className={`h-3.5 w-3.5 ${isFav(o.id) ? 'fill-rust text-rust' : ''}`} />{isFav(o.id) ? 'Saved' : 'Save'}</button>
            <button onClick={() => update((s) => ({ ...s, planned: planned ? s.planned.filter((x) => x !== o.id) : [...s.planned, o.id] }))} className="border border-camel-light px-3 py-2 hover:border-choc">{planned ? 'Planned ✓' : 'Plan'}</button>
            <button onClick={() => update((s) => ({ ...s, worn: { ...s.worn, [o.id]: [...(s.worn[o.id] ?? []), new Date().toISOString().slice(0, 10)] } }))} className="flex items-center gap-2 border border-camel-light px-3 py-2 hover:border-choc"><Shirt className="h-3.5 w-3.5" />Wore it ({state.worn[o.id]?.length ?? 0})</button>
            <label className="flex cursor-pointer items-center gap-2 border border-camel-light px-3 py-2 hover:border-choc"><Camera className="h-3.5 w-3.5" />{state.photos[o.id] ? 'Replace my photo' : 'Add my real photo'}<input type="file" accept="image/*" className="hidden" onChange={(e) => onPhoto(e.target.files?.[0])} /></label>
            {state.photos[o.id] && <button onClick={() => update((s) => { const p = { ...s.photos }; delete p[o.id]; return { ...s, photos: p }; })} className="flex items-center gap-2 border border-camel-light px-3 py-2"><Trash2 className="h-3.5 w-3.5" /></button>}
          </div>
          <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-choc-soft">{state.photos[o.id] ? 'Your own photo' : renders.has(o.id) ? 'Personalised render · AI-generated from your photos' : 'Illustration · personalised photo pending'} · tap image to zoom</p>
        </div>

        <div className="min-w-0">
          <Eyebrow>{col.name} · {o.id.toUpperCase()}</Eyebrow>
          <h1 className="mt-3 font-serif text-5xl leading-[1.05] md:text-6xl">{o.name}</h1>
          <p className="mt-3 text-sm uppercase tracking-[0.2em] text-rust">{notes.headline}</p>
          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-camel-light/70 py-6 sm:grid-cols-3">
            {facts.map(([k, v]) => <div key={k}><dt className="text-[10px] uppercase tracking-[0.2em] text-choc-soft">{k}</dt><dd className="mt-1 text-sm capitalize">{v}</dd></div>)}
          </dl>

          <section className="mt-10">
            <div className="flex items-baseline justify-between"><h2 className="font-serif text-3xl">The look</h2><span className="text-[11px] uppercase tracking-[0.18em] text-choc-soft">{c.owned} of {c.required} owned{c.missing.length ? ` · est. ${inr(c.cost)} to complete` : ''}</span></div>
            <ul className="mt-4 divide-y divide-camel-light/70 border-y border-camel-light/70">
              {comps.map((x) => (
                <li key={x.key} className="flex gap-4 py-4">
                  <span className="mt-1 h-10 w-10 shrink-0 border border-black/10" style={{ background: x.piece?.colour.hex }} />
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-choc-soft">{label[x.slot] ?? 'Accessory'}{!x.required && ' · optional'}{x.substituted && ' · your substitute'}</div>
                    <div className="mt-0.5 text-[15px]">{x.piece?.name}</div>
                    <div className="text-xs text-choc-soft">{x.piece && (fabricById[x.piece.kind.fabric]?.name ?? x.piece.kind.fabric)}{x.piece?.kind.bodyNote && x.slot !== 'accessory' ? ` · ${x.piece.kind.bodyNote}` : ''}</div>
                    {(!x.owned || x.substituted) && (
                      <div className="mt-2 flex items-center gap-2">
                        <select className="max-w-full border-b border-camel-light bg-transparent py-1 text-xs" value={x.substituted ? x.ref : ''} onChange={(e) => sub(x.key, e.target.value || null)}>
                          <option value="">{x.substituted ? '↩ Restore original' : 'Swap in something I own…'}</option>
                          {options(x.slot, x.slot === 'accessory' ? x.piece?.kind.wardrobe : undefined).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                        {x.substituted && <button onClick={() => sub(x.key, null)} aria-label="Restore"><RotateCcw className="h-3.5 w-3.5" /></button>}
                      </div>
                    )}
                  </div>
                  <div className="shrink-0 self-start">{!x.ref.startsWith('item:') ? <StatusPicker compact value={pieceStatus(state, x.ref)} onChange={(s) => setStatus(x.ref, s)} /> : <span className="text-[10px] uppercase tracking-[0.15em] text-olive">Owned</span>}</div>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-12">
            <h2 className="font-serif text-3xl">Why it works</h2>
            <div className="mt-6 space-y-6">
              {notes.why.map((w, i) => (
                <div key={w.title} className="grid grid-cols-[2.5rem_1fr] gap-3">
                  <span className="font-serif text-2xl text-camel">0{i + 1}</span>
                  <div><div className="text-[10px] uppercase tracking-[0.25em] text-olive">{w.title}</div><p className="mt-1.5 text-[15px] leading-relaxed">{w.text}</p></div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-12 bg-sand/60 p-8">
            <h2 className="font-serif text-3xl">How to wear it</h2>
            <ul className="mt-5 space-y-3">{notes.how.map((h) => <li key={h} className="flex gap-3 text-[15px] leading-relaxed"><span className="mt-2.5 h-px w-4 shrink-0 bg-choc" />{h}</li>)}</ul>
          </section>

          <blockquote className="mt-12 border-l-2 border-rust pl-6">
            <div className="text-[10px] uppercase tracking-[0.25em] text-choc-soft">The stylist&apos;s verdict</div>
            <p className="mt-2 font-serif text-2xl leading-snug">{notes.verdict}</p>
          </blockquote>

          <section className="mt-12 border-t border-camel-light/70 pt-6">
            <button onClick={() => setShowCheck((v) => !v)} className="flex w-full items-center justify-between text-left">
              <span className="font-serif text-2xl">Styling check · {ev.score}/100</span><ChevronDown className={`h-5 w-5 transition ${showCheck ? 'rotate-180' : ''}`} />
            </button>
            {showCheck && <ul className="mt-3 divide-y divide-camel-light/50 text-sm">{ev.checks.map((x) => <CheckLine key={x.label} {...x} />)}</ul>}
          </section>

          <section className="mt-8 border-t border-camel-light/70 pt-6">
            <div className="font-serif text-2xl">Compare with another look</div>
            <select className="mt-3 w-full border-b border-camel-light bg-transparent py-2 text-sm" value={cmp} onChange={(e) => setCmp(e.target.value)}>
              <option value="">Choose a look…</option>
              {outfits.filter((x) => x.id !== o.id).map((x) => <option key={x.id} value={x.id}>{collections.find((cc) => cc.id === x.collection)?.name} · {x.name}</option>)}
            </select>
          </section>
        </div>
      </div>

      {other && <Compare a={o} b={other} onClose={() => setCmp('')} />}

      <section className="mt-20">
        <div className="mb-6 border-b border-camel-light/70 pb-3"><Eyebrow>Complete the edit</Eyebrow><h2 className="mt-1 font-serif text-3xl">More looks like this</h2></div>
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">{similar.map((x) => <LookCard key={x.id} o={x} />)}</div>
      </section>
      {zoom && <Lightbox o={o} onClose={() => setZoom(false)} />}
    </div>
  );
}

function Compare({ a, b, onClose }: { a: Outfit; b: Outfit; onClose: () => void }) {
  const { state } = useStore();
  const row = (o: Outfit) => { const ev = evaluateOutfit(state, o); const c = completion(state, o); return { ev, c, n: stylistNotes(state, o) }; };
  const A = row(a), B = row(b);
  const lines: [string, (x: typeof A, o: Outfit) => React.ReactNode][] = [
    ['Mood', (x) => x.n.headline], ['Occasion', (_, o) => o.occasions.slice(0, 3).join(', ')], ['Season', (_, o) => o.seasons.join(', ')],
    ['Formality', (x) => `${x.ev.formality} / 5`], ['Owned', (x) => `${x.c.owned} of ${x.c.required}`], ['To complete', (x) => (x.c.missing.length ? inr(x.c.cost) : 'Nothing')],
    ['Colour story', (x) => x.ev.colourLogic],
  ];
  return (
    <section className="mt-16 border-t border-choc pt-8">
      <div className="mb-6 flex items-center justify-between"><h2 className="font-serif text-3xl">Side by side</h2><button onClick={onClose} aria-label="Close"><X /></button></div>
      <div className="grid grid-cols-2 gap-6">
        {[a, b].map((o) => <Link key={o.id} to={`/outfit/${o.id}`}><div className="relative aspect-[3/4] overflow-hidden bg-sand"><LookImage o={o} /></div><div className="mt-3 font-serif text-xl">{o.name}</div></Link>)}
        {lines.map(([k, fn]) => (
          <div key={k} className="col-span-2 grid grid-cols-2 gap-6 border-t border-camel-light/70 pt-3 text-sm">
            <div><div className="text-[10px] uppercase tracking-[0.2em] text-choc-soft">{k}</div><div className="mt-1 capitalize">{fn(A, a)}</div></div>
            <div><div className="text-[10px] uppercase tracking-[0.2em] text-choc-soft">{k}</div><div className="mt-1 capitalize">{fn(B, b)}</div></div>
          </div>
        ))}
      </div>
    </section>
  );
}
