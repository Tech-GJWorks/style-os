import { useMemo, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useStore } from '../lib/store';
import { pieces } from '../lib/catalogue';
import { evaluate, generateCombos, isOwned, itemAsPiece, currentSeason, ownedPool } from '../lib/engine';
import { occasions } from '../data/occasions';
import type { Piece, Season, Slot } from '../data/types';
import { Badge, Card, CheckLine, Field, Note, PageHeader, Section, Tabs, btnGhost, inputCls } from '../components/ui';
import { OutfitFigure } from '../components/OutfitFigure';

export function Builder() {
  const [tab, setTab] = useState<'build' | 'mine'>('build');
  return (
    <div>
      <PageHeader eyebrow="Learn the logic, not the score" title="Outfit Combination Builder">Pick each piece. The builder checks colour, fabric, occasion, season, formality, your body shape and proportion, then explains why the combination works or does not.</PageHeader>
      <Tabs tabs={[{ id: 'build', label: 'Build any outfit' }, { id: 'mine', label: 'Create outfits from my wardrobe' }]} value={tab} onChange={setTab} />
      {tab === 'build' ? <Build /> : <FromMine />}
    </div>
  );
}

function usePool() {
  const { state } = useStore();
  return useMemo(() => {
    const items = state.items.filter((i) => i.status === 'OWNED').map(itemAsPiece);
    const all = [...pieces, ...items];
    return { state, all, by: (s: Slot) => all.filter((p) => p.kind.slot === s) };
  }, [state]);
}

function PieceSelect({ label, list, value, onChange, optional }: { label: string; list: Piece[]; value?: string; onChange: (id: string) => void; optional?: boolean }) {
  const { state } = useStore();
  const groups = [...new Set(list.map((p) => p.kind.wardrobe))];
  return (
    <Field label={label}>
      <select className={inputCls} value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
        {optional && <option value="">None</option>}
        {groups.map((g) => <optgroup key={g} label={g}>{list.filter((p) => p.kind.wardrobe === g).map((p) => <option key={p.id} value={p.id}>{(p.id.startsWith('item:') || isOwned(state, p.id)) ? '● ' : ''}{p.name}</option>)}</optgroup>)}
      </select>
    </Field>
  );
}

function Build() {
  const { state, all, by } = usePool();
  const [sel, setSel] = useState({ top: 'oxford:warm-white', bottom: 'chinos:olive', footwear: 'loafer:brown', outer: '' });
  const [acc, setAcc] = useState<string[]>(['belt-leather:brown', 'watch-leather:tan', 'glasses:gold-metal']);
  const [occ, setOcc] = useState('');
  const [season, setSeason] = useState<Season>(currentSeason());
  const get = (id?: string) => all.find((p) => p.id === id);
  const parts = { top: get(sel.top), bottom: get(sel.bottom), footwear: get(sel.footwear), outer: get(sel.outer), accessories: acc.map(get).filter(Boolean) as Piece[] };
  const o = occasions.find((x) => x.id === occ);
  const ev = evaluate(parts, { occasionRange: o?.formality, season });

  const alternatives = useMemo(() => {
    const res: { slot: string; p: Piece; score: number }[] = [];
    (['top', 'bottom', 'footwear', 'outer'] as const).forEach((slot) => {
      by(slot).forEach((p) => {
        if (p.id === sel[slot]) return;
        const s = evaluate({ ...parts, [slot]: p }, { occasionRange: o?.formality, season }).score;
        if (s > ev.score) res.push({ slot, p, score: s });
      });
    });
    const owned = (p: Piece) => p.id.startsWith('item:') || isOwned(state, p.id);
    return res.sort((a, b) => b.score - a.score || Number(owned(b.p)) - Number(owned(a.p))).slice(0, 6);
  }, [sel, acc, occ, season, state]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <Card>
          <div className="grid gap-3 sm:grid-cols-2">
            <PieceSelect label="Top (shirt, polo, T-shirt, henley, sweater, kurta)" list={by('top')} value={sel.top} onChange={(v) => setSel({ ...sel, top: v })} />
            <PieceSelect label="Outer layer (overshirt, jacket, blazer)" list={by('outer')} value={sel.outer} onChange={(v) => setSel({ ...sel, outer: v })} optional />
            <PieceSelect label="Bottom" list={by('bottom')} value={sel.bottom} onChange={(v) => setSel({ ...sel, bottom: v })} />
            <PieceSelect label="Footwear" list={by('footwear')} value={sel.footwear} onChange={(v) => setSel({ ...sel, footwear: v })} />
            <Field label="Occasion (optional)"><select className={inputCls} value={occ} onChange={(e) => setOcc(e.target.value)}><option value="">Any</option>{occasions.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select></Field>
            <Field label="Season"><select className={inputCls} value={season} onChange={(e) => setSeason(e.target.value as Season)}>{['summer', 'monsoon', 'transitional', 'winter'].map((s) => <option key={s}>{s}</option>)}</select></Field>
          </div>
          <div className="mt-4 text-sm font-medium">Accessories</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {by('accessory').map((p) => <label key={p.id} className={`flex cursor-pointer items-center gap-1 rounded-full border px-2.5 py-1 text-xs ${acc.includes(p.id) ? 'border-olive bg-olive/10' : 'border-camel-light'}`}><input type="checkbox" className="hidden" checked={acc.includes(p.id)} onChange={(e) => setAcc(e.target.checked ? [...acc, p.id] : acc.filter((x) => x !== p.id))} />{(p.id.startsWith('item:') || isOwned(state, p.id)) ? '● ' : ''}{p.name}</label>)}
          </div>
          <p className="mt-3 text-xs text-choc-soft">● = owned</p>
        </Card>
        <Section title="Why does this outfit work?">
          <Card>
            <div className="flex items-center gap-3"><span className="font-serif text-4xl text-olive">{ev.score}</span><span className="text-sm text-choc-soft">/ 100 · formality {ev.formality} · {ev.seasons.join(', ') || 'no shared season'}</span></div>
            <p className="mt-3 text-sm">{ev.colourLogic}</p>
            <ul className="mt-2 divide-y divide-camel-light/50 text-sm">{ev.checks.map((c) => <CheckLine key={c.label} {...c} />)}</ul>
          </Card>
        </Section>
        <Section title="Suggested alternatives" sub="Single swaps that raise the score. Owned pieces are listed first when scores tie.">
          {alternatives.length ? <div className="grid gap-3 sm:grid-cols-2">{alternatives.map((a) => (
            <button key={a.slot + a.p.id} onClick={() => setSel({ ...sel, [a.slot]: a.p.id })} className="rounded-lg border border-camel-light bg-paper p-3 text-left text-sm hover:border-camel">
              <span className="text-xs uppercase text-choc-soft">Swap {a.slot}</span><div className="font-medium">{a.p.name}</div><div className="text-xs text-olive">→ score {a.score}{(a.p.id.startsWith('item:') || isOwned(state, a.p.id)) ? ' · owned' : ''}</div>
            </button>))}</div> : <Note>No single swap improves this outfit. It is already well balanced.</Note>}
        </Section>
      </div>
      <Card className="sticky top-6 h-fit bg-gradient-to-b from-sand to-paper"><OutfitFigure className="mx-auto h-[480px]" {...parts} m={state.measurements} /><p className="text-center text-xs text-choc-soft">Preview · proportion illustration</p></Card>
    </div>
  );
}

function FromMine() {
  const { state, update } = useStore();
  const pool = ownedPool(state);
  const [season, setSeason] = useState<Season>(currentSeason());
  const [occ, setOcc] = useState('');
  const [fixed, setFixed] = useState<{ top?: string; bottom?: string; footwear?: string }>({});
  const [page, setPage] = useState(0);
  const o = occasions.find((x) => x.id === occ);
  const combos = useMemo(() => generateCombos(state, { season, occasionRange: o?.formality, minScore: 70, fixed }), [state, season, occ, fixed]);
  const wornKeys = new Set(state.journal.map((j) => j.outfitText));
  const ordered = [...combos.filter((c) => !wornKeys.has(c.key)), ...combos.filter((c) => wornKeys.has(c.key))];
  const per = 6;
  const shown = ordered.slice(page * per, page * per + per);
  const logWorn = (key: string, text: string) => update((s) => ({ ...s, journal: [...s.journal, { id: Math.random().toString(36).slice(2), date: new Date().toISOString().slice(0, 10), outfitText: key, occasion: occ || undefined, feeling: 4, notes: `Wore: ${text}` }] }));
  return (
    <div>
      <Note>Uses only items marked <b>Owned</b>, so you can wear any of these now without buying anything. Combinations you have already logged as worn move to the end, which keeps the same suggestion from repeating.</Note>
      <Card className="my-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Field label="Season"><select className={inputCls} value={season} onChange={(e) => { setSeason(e.target.value as Season); setPage(0); }}>{['summer', 'monsoon', 'transitional', 'winter'].map((s) => <option key={s}>{s}</option>)}</select></Field>
          <Field label="Occasion"><select className={inputCls} value={occ} onChange={(e) => { setOcc(e.target.value); setPage(0); }}><option value="">Any</option>{occasions.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select></Field>
          {(['top', 'bottom', 'footwear'] as const).map((s) => <Field key={s} label={`Fix ${s}`}><select className={inputCls} value={fixed[s] ?? ''} onChange={(e) => { setFixed({ ...fixed, [s]: e.target.value || undefined }); setPage(0); }}><option value="">Any</option>{pool[s].map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></Field>)}
        </div>
      </Card>
      <div className="mb-4 flex items-center justify-between"><span className="text-sm"><b>{combos.length}</b> good combinations from {pool.top.length} tops × {pool.bottom.length} bottoms × {pool.footwear.length} shoes (+ {pool.outer.length} layers)</span>{ordered.length > per && <button className={btnGhost} onClick={() => setPage((p) => (p + 1) % Math.ceil(ordered.length / per))}><RefreshCw className="h-4 w-4" /> Next set</button>}</div>
      {!combos.length && <Card className="text-sm text-choc-soft">Not enough owned items to build a well-scored outfit. You need at least one top, one bottom and one pair of shoes marked Owned. Your owned pieces: {pool.all.map((p) => p.name).join(', ') || 'none'}.</Card>}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {shown.map((c) => (
          <Card key={c.key} className="flex flex-col">
            <OutfitFigure className="mx-auto h-60" top={c.top} bottom={c.bottom} footwear={c.footwear} outer={c.outer} accessories={c.accessories} m={state.measurements} />
            <div className="mt-2 flex items-center gap-2"><Badge tone="green">All owned</Badge><Badge>Score {c.ev.score}</Badge>{wornKeys.has(c.key) && <Badge tone="grey">Worn before</Badge>}</div>
            <ul className="mt-2 text-sm">{[c.top, c.outer, c.bottom, c.footwear].filter(Boolean).map((p) => <li key={p!.id}>• {p!.name}</li>)}</ul>
            {c.accessories.length > 0 && <p className="mt-1 text-xs text-choc-soft">Best accessories you own: {c.accessories.map((a) => a.name).join(', ')}</p>}
            <p className="mt-2 text-xs text-choc-soft">{c.ev.colourLogic}</p>
            <button className={`${btnGhost} mt-auto self-start text-xs`} onClick={() => logWorn(c.key, [c.top, c.outer, c.bottom, c.footwear].filter(Boolean).map((p) => p!.name).join(' + '))}>Log as worn today</button>
          </Card>
        ))}
      </div>
    </div>
  );
}
