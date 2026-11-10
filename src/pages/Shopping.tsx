import { useMemo, useState } from 'react';
import { Check, Download, Plus, Trash2 } from 'lucide-react';
import { useStore, uid, download } from '../lib/store';
import { pieceById } from '../lib/catalogue';
import { capsules } from '../data/content';
import { garments } from '../data/garments';
import { outfitById } from '../data/outfits';
import { countCombos, gapRanking, inr, isOwned, itemPieceId, ownedPool, wardrobeInsights } from '../lib/engine';
import type { WishItem } from '../data/types';
import { Badge, Card, Field, Note, PageHeader, Section, Table, Tabs, btn, btnGhost, inputCls } from '../components/ui';

const prio: WishItem['priority'][] = ['Essential', 'High priority', 'Useful addition', 'Optional'];

export function Shopping() {
  const [tab, setTab] = useState<'missing' | 'wishlist' | 'value' | 'capsules'>('missing');
  return (
    <div>
      <PageHeader eyebrow="Buy less, buy what unlocks outfits" title="Wardrobe Shopping Planner">The planner ranks purchases by how many new outfits they unlock with what you already own, never by "more is better". Your body is still changing, so favour adjustable and forgiving pieces (stretch chinos, knits, overshirts) over expensive tailoring for now.</PageHeader>
      <Tabs tabs={[{ id: 'missing', label: 'What am I missing?' }, { id: 'wishlist', label: 'Wishlist & budget' }, { id: 'value', label: 'Wardrobe value' }, { id: 'capsules', label: 'Capsule wardrobes' }]} value={tab} onChange={setTab} />
      {tab === 'missing' && <Missing />}
      {tab === 'wishlist' && <Wishlist />}
      {tab === 'value' && <Value />}
      {tab === 'capsules' && <Capsules />}
    </div>
  );
}

function Missing() {
  const { state, update } = useStore();
  const gaps = gapRanking(state);
  const ins = wardrobeInsights(state);
  const pool = ownedPool(state);
  const addWish = (pid: string, why: string) => update((s) => ({ ...s, wishlist: [...s.wishlist, { id: uid(), product: pieceById[pid].name, category: pieceById[pid].kind.wardrobe, colour: pieceById[pid].colour.name, pieceId: pid, price: pieceById[pid].kind.estPrice, why, priority: 'High priority' }], statuses: { ...s.statuses, [pid]: 'WANT' } }));
  const tier = (g: { completes: number; appears: number }) => (g.completes >= 3 ? 'Essential' : g.completes >= 1 ? 'High priority' : g.appears >= 4 ? 'Useful addition' : 'Optional');
  return (
    <div>
      <Card className="mb-6">
        <div className="text-sm">You own {pool.top.length} tops, {pool.bottom.length} bottoms, {pool.outer.length} layers, {pool.footwear.length} pairs of shoes and {pool.accessory.length} accessories, which make <b>{ins.combos}</b> well-scored combinations.</div>
        <ul className="mt-3 space-y-2 text-sm">{ins.insights.map((x) => <li key={x.text} className="flex gap-2"><Badge tone={x.level === 'gap' ? 'rust' : x.level === 'dup' ? 'amber' : 'green'}>{x.level === 'gap' ? 'Missing' : x.level === 'dup' ? 'Watch' : 'OK'}</Badge>{x.text}</li>)}</ul>
      </Card>
      <Section title="Purchases ranked by outfits unlocked" sub="'Completes' = outfits where this is the only missing required item. Prices are indicative estimates, not verified.">
        <Table head={['Priority', 'Item', 'Completes', 'Appears in', 'Est. price', '']} rows={gaps.slice(0, 25).map((g) => {
          const p = pieceById[g.pieceId]; const t = tier(g);
          const inWish = state.wishlist.some((w) => w.pieceId === g.pieceId);
          return [<Badge tone={t === 'Essential' ? 'green' : t === 'High priority' ? 'olive' : t === 'Useful addition' ? 'sand' : 'grey'}>{t}</Badge>, <b>{p?.name}</b>, <span title={g.outfitIds.map((o) => outfitById[o]?.name).join(', ')}>{g.completes}</span>, g.appears, inr(p?.kind.estPrice), inWish ? <span className="text-xs text-olive">In wishlist</span> : <button className={`${btnGhost} px-2 py-1 text-xs`} onClick={() => addWish(g.pieceId, `Completes ${g.completes} outfit(s): ${g.outfitIds.map((o) => outfitById[o]?.name).join(', ')}`)}><Plus className="h-3 w-3" /> Wishlist</button>];
        })} />
      </Section>
      <Section title="Avoid buying" sub="Reasonable-looking purchases that do not serve your profile right now.">
        <div className="grid gap-3 md:grid-cols-2">
          {garments.filter((g) => g.priority === 'Avoid buying').map((g) => <Card key={g.id}><div className="font-medium">{g.name}</div><p className="text-sm text-choc-soft">{g.verdict}</p></Card>)}
          <Card><div className="font-medium">Expensive made-to-measure suits right now</div><p className="text-sm text-choc-soft">Your waist dropped 3.1 in between Aug and Oct. Wait until your weight is stable, or buy pieces with generous seam allowance.</p></Card>
          <Card><div className="font-medium">A 5th casual T-shirt before a 3rd trouser</div><p className="text-sm text-choc-soft">Bottoms multiply every top. Extra tops of the same type add almost nothing.</p></Card>
        </div>
      </Section>
    </div>
  );
}

function Wishlist() {
  const { state, update } = useStore();
  const [f, setF] = useState<WishItem>({ id: uid(), product: '', priority: 'High priority' });
  const add = () => { update((s) => ({ ...s, wishlist: [...s.wishlist, f] })); setF({ id: uid(), product: '', priority: 'High priority' }); };
  const month = new Date().toISOString().slice(0, 7);
  const spent = state.items.filter((i) => i.purchaseDate?.startsWith(month)).reduce((s, i) => s + (i.price ?? 0), 0);
  const planned = state.wishlist.filter((w) => !w.bought).reduce((s, w) => s + (w.price ?? 0), 0);
  const left = state.budget.monthly - spent;
  const markBought = (w: WishItem) => update((s) => ({
    ...s, wishlist: s.wishlist.map((x) => (x.id === w.id ? { ...x, bought: true } : x)),
    items: [...s.items, { id: uid(), name: w.product, brand: w.brand, price: w.price, slot: w.pieceId ? pieceById[w.pieceId].kind.slot : 'top', category: w.category ?? 'Other tops', kindId: w.pieceId?.split(':')[0], colourId: w.pieceId?.split(':')[1], colourText: w.colour, url: w.url, purchaseDate: new Date().toISOString().slice(0, 10), status: 'OWNED', createdAt: Date.now() }],
  }));
  const completesFor = (w: WishItem) => (w.pieceId ? gapRanking(state).find((g) => g.pieceId === w.pieceId)?.outfitIds.map((o) => outfitById[o]?.name).join(', ') : undefined);
  const exportCsv = () => download('shopping-list.csv', ['product,brand,price,category,colour,priority,why,bought', ...state.wishlist.map((w) => [w.product, w.brand, w.price, w.category, w.colour, w.priority, w.why, w.bought ? 'yes' : 'no'].map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','))].join('\n'), 'text/csv');
  return (
    <div>
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <Card><Field label="Monthly budget (₹)"><input type="number" step={500} className={inputCls} value={state.budget.monthly} onChange={(e) => update((s) => ({ ...s, budget: { monthly: Number(e.target.value) } }))} /></Field></Card>
        <Card><div className="text-xs uppercase text-choc-soft">Spent this month</div><div className="font-serif text-3xl">{inr(spent)}</div><div className="text-xs text-choc-soft">from purchase dates in My Wardrobe</div></Card>
        <Card><div className="text-xs uppercase text-choc-soft">Remaining</div><div className={`font-serif text-3xl ${left < 0 ? 'text-red-700' : 'text-olive'}`}>{inr(left)}</div></Card>
        <Card><div className="text-xs uppercase text-choc-soft">Planned (open wishlist)</div><div className="font-serif text-3xl">{inr(planned)}</div></Card>
      </div>
      <Card className="mb-6">
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <Field label="Product"><input className={inputCls} value={f.product} onChange={(e) => setF({ ...f, product: e.target.value })} /></Field>
          <Field label="Brand"><input className={inputCls} value={f.brand ?? ''} onChange={(e) => setF({ ...f, brand: e.target.value })} /></Field>
          <Field label="Price (₹)"><input type="number" className={inputCls} value={f.price ?? ''} onChange={(e) => setF({ ...f, price: Number(e.target.value) || undefined })} /></Field>
          <Field label="Category"><input className={inputCls} value={f.category ?? ''} onChange={(e) => setF({ ...f, category: e.target.value })} /></Field>
          <Field label="Colour"><input className={inputCls} value={f.colour ?? ''} onChange={(e) => setF({ ...f, colour: e.target.value })} /></Field>
          <Field label="Priority"><select className={inputCls} value={f.priority} onChange={(e) => setF({ ...f, priority: e.target.value as WishItem['priority'] })}>{prio.map((p) => <option key={p}>{p}</option>)}</select></Field>
          <div className="sm:col-span-3"><Field label="Why I need it"><input className={inputCls} value={f.why ?? ''} onChange={(e) => setF({ ...f, why: e.target.value })} /></Field></div>
          <div className="sm:col-span-2"><Field label="Product URL"><input className={inputCls} value={f.url ?? ''} onChange={(e) => setF({ ...f, url: e.target.value })} /></Field></div>
          <div className="flex items-end"><button className={btn} disabled={!f.product} onClick={add}><Plus className="h-4 w-4" /> Add</button></div>
        </div>
      </Card>
      <div className="mb-3 flex justify-end"><button className={btnGhost} onClick={exportCsv}><Download className="h-4 w-4" /> Export shopping list (CSV)</button></div>
      {prio.map((p) => {
        const ws = state.wishlist.filter((w) => w.priority === p);
        return ws.length ? (
          <Section key={p} title={p}>
            <Table head={['Product', 'Brand', 'Price', 'Category', 'Colour', 'Why', 'Completes', '']} rows={ws.map((w) => [<span className={w.bought ? 'line-through opacity-60' : ''}>{w.product}</span>, w.brand ?? '—', inr(w.price), w.category ?? '—', w.colour ?? '—', <span className="text-xs">{w.why}</span>, <span className="text-xs">{completesFor(w) ?? '—'}</span>,
              <div className="flex gap-2">{!w.bought && <button title="Mark as bought (adds it to My Wardrobe)" onClick={() => markBought(w)}><Check className="h-4 w-4 text-olive" /></button>}<button aria-label="Delete" onClick={() => confirm('Remove from wishlist?') && update((s) => ({ ...s, wishlist: s.wishlist.filter((x) => x.id !== w.id) }))}><Trash2 className="h-4 w-4 text-choc-soft" /></button></div>])} />
          </Section>) : null;
      })}
      {!state.wishlist.length && <Note>Your wishlist is empty. Add items here or from the "What am I missing?" tab.</Note>}
    </div>
  );
}

function Value() {
  const { state } = useStore();
  const owned = state.items.filter((i) => i.status === 'OWNED');
  const total = owned.reduce((s, i) => s + (i.price ?? 0), 0);
  const byGroup = (slot: string) => owned.filter((i) => i.slot === slot).length;
  const never = owned.filter((i) => !i.lastWorn && !i.wearCount);
  const cpw = owned.filter((i) => i.price && i.wearCount).map((i) => ({ i, v: i.price! / i.wearCount! })).sort((a, b) => b.v - a.v);
  const months: Record<string, number> = {};
  owned.forEach((i) => { if (i.purchaseDate && i.price) months[i.purchaseDate.slice(0, 7)] = (months[i.purchaseDate.slice(0, 7)] ?? 0) + i.price; });
  const pool = ownedPool(state);
  const max = Math.max(1, ...Object.values(months));
  return (
    <div>
      <Note>Value figures use only items added under My Wardrobe → My items with a price. Catalogue pieces marked Owned (e.g. the {pool.all.length - owned.length} seeded from your photo) count toward totals but have no price.</Note>
      <div className="my-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {[['Total value', inr(total)], ['Total items', String(pool.all.length)], ['Clothing', String(byGroup('top') + byGroup('bottom') + byGroup('outer'))], ['Footwear', String(byGroup('footwear'))], ['Accessories', String(byGroup('accessory'))], ['Planned purchases', String(state.wishlist.filter((w) => !w.bought).length)]].map(([a, b]) => <Card key={a}><div className="text-xs uppercase text-choc-soft">{a}</div><div className="font-serif text-2xl">{b}</div></Card>)}
      </div>
      <Section title="Monthly spending">
        {Object.keys(months).length ? <Card><div className="flex h-40 items-end gap-2">{Object.entries(months).sort().map(([m, v]) => <div key={m} className="flex flex-1 flex-col items-center gap-1"><div className="w-full rounded-t bg-olive" style={{ height: `${(v / max) * 120}px` }} title={inr(v)} /><span className="text-[10px]">{m}</span></div>)}</div></Card> : <p className="text-sm text-choc-soft">Add purchase dates and prices to see this.</p>}
      </Section>
      <Section title="Never worn">{never.length ? <ul className="text-sm">{never.map((i) => <li key={i.id}>• {i.name}</li>)}</ul> : <p className="text-sm text-choc-soft">Nothing flagged.</p>}</Section>
      <Section title="Cost per wear" sub="Price ÷ times worn. High numbers = wear it more or stop buying that kind of item.">{cpw.length ? <Table head={['Item', 'Price', 'Worn', 'Cost per wear']} rows={cpw.map(({ i, v }) => [i.name, inr(i.price), i.wearCount, inr(v)])} /> : <p className="text-sm text-choc-soft">Record "Times worn" on items to calculate this.</p>}</Section>
      <p className="text-xs text-choc-soft">Items linked to the catalogue: {owned.filter((i) => itemPieceId(i)).length} of {owned.length}.</p>
    </div>
  );
}

function Capsules() {
  const { state } = useStore();
  const data = useMemo(() => capsules.map((c) => ({ c, n: countCombos(c.pieces) })), []);
  return (
    <div className="space-y-6">
      <Note>Outfit counts are the combinations of top × bottom × shoes (± layer) inside each capsule that score 75+ in the styling engine. Versatility beats size.</Note>
      {data.map(({ c, n }) => {
        const have = c.pieces.filter((p) => isOwned(state, p)).length;
        return (
          <Card key={c.id}>
            <div className="flex flex-wrap items-baseline justify-between gap-2"><span className="font-serif text-2xl font-semibold">{c.name}</span><span className="text-sm"><b className="font-serif text-3xl text-olive">{n}</b> outfits · you own {have}/{c.pieces.length}</span></div>
            <p className="text-sm text-choc-soft">{c.note}</p>
            <div className="mt-3 flex flex-wrap gap-2">{c.pieces.map((p) => <span key={p} className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs ${isOwned(state, p) ? 'border-emerald-300 bg-emerald-50' : 'border-camel-light'}`}><span className="h-2.5 w-2.5 rounded-full" style={{ background: pieceById[p]?.colour.hex }} />{pieceById[p]?.name}</span>)}</div>
          </Card>
        );
      })}
    </div>
  );
}
