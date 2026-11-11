import { useMemo, useState } from 'react';
import { Copy, Pencil, Plus, Trash2, X } from 'lucide-react';
import { useStore, uid, compressImage } from '../lib/store';
import { groupSlot, kinds, wardrobeTree } from '../data/kinds';
import { colours } from '../data/colours';
import { fabrics } from '../data/fabrics';
import { pieces } from '../lib/catalogue';
import { pieceStatus, inr, itemPieceId } from '../lib/engine';
import type { Ownership, Season, WardrobeItem } from '../data/types';
import { Card, Field, PageHeader, STATUS, StatusPicker, Swatch, Tabs, btn, btnGhost, inputCls, Note } from '../components/ui';
import { PieceStatusRow } from '../components/OutfitCard';

const groupOf = (cat: string) => Object.entries(wardrobeTree).find(([, s]) => s.includes(cat))?.[0] ?? 'Tops';
const blank = (): WardrobeItem => ({ id: uid(), name: '', slot: 'top', category: 'T-shirts', status: 'OWNED', createdAt: Date.now() });

export function Wardrobe() {
  const { state, update } = useStore();
  const [tab, setTab] = useState<'items' | 'catalogue'>('catalogue');
  const [edit, setEdit] = useState<WardrobeItem | null>(null);
  const [q, setQ] = useState('');
  const [g, setG] = useState('all');
  const [st, setSt] = useState<Ownership | 'all'>('all');

  const items = state.items.filter((i) => (g === 'all' || groupOf(i.category) === g) && (st === 'all' || i.status === st) && (i.name + (i.brand ?? '') + (i.colourText ?? '') + i.category).toLowerCase().includes(q.toLowerCase()));
  const catPieces = pieces.filter((p) => (g === 'all' || groupOf(p.kind.wardrobe) === g) && (st === 'all' || pieceStatus(state, p.id) === st) && p.name.toLowerCase().includes(q.toLowerCase()));
  const save = (it: WardrobeItem) => { update((s) => ({ ...s, items: s.items.some((x) => x.id === it.id) ? s.items.map((x) => (x.id === it.id ? it : x)) : [...s.items, it] })); setEdit(null); };
  const del = (id: string) => { if (confirm('Delete this item permanently?')) update((s) => ({ ...s, items: s.items.filter((x) => x.id !== id) })); };
  const dup = (it: WardrobeItem) => setEdit({ ...it, id: uid(), name: `${it.name} (copy)`, createdAt: Date.now() });
  const setItemStatus = (id: string, status: Ownership) => update((s) => ({ ...s, items: s.items.map((x) => (x.id === id ? { ...x, status } : x)) }));

  const ownedCount = pieces.filter((p) => pieceStatus(state, p.id) === 'OWNED').length + state.items.filter((i) => i.status === 'OWNED' && !itemPieceId(i)).length;
  return (
    <div>
      <PageHeader eyebrow="Clothing · footwear · accessories" title="My Wardrobe">
        Two ways to record what you own. <b>Catalogue ownership</b>: mark the pieces this site's outfits use. <b>My items</b>: add your real clothes with brand, size, price and a photo, and optionally link each one to a catalogue piece so outfits recognise it. You currently own <b>{ownedCount}</b> recorded pieces.
      </PageHeader>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Tabs tabs={[{ id: 'catalogue', label: `Catalogue ownership (${pieces.length})` }, { id: 'items', label: `My items (${state.items.length})` }]} value={tab} onChange={setTab} />
        <button className={`${btn} mb-6 ml-auto`} onClick={() => { setTab('items'); setEdit(blank()); }}><Plus className="h-4 w-4" /> Add item</button>
      </div>
      <div className="mb-6 flex flex-wrap gap-3">
        <input className={`${inputCls} max-w-xs`} placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className={`${inputCls} w-auto`} value={g} onChange={(e) => setG(e.target.value)}><option value="all">All categories</option>{Object.keys(wardrobeTree).map((x) => <option key={x}>{x}</option>)}</select>
        <select className={`${inputCls} w-auto`} value={st} onChange={(e) => setSt(e.target.value as Ownership)}><option value="all">Any status</option>{(Object.keys(STATUS) as Ownership[]).map((x) => <option key={x} value={x}>{STATUS[x].label}</option>)}</select>
        <div className="flex items-center gap-3 text-xs">{(['OWNED', 'NOT_OWNED', 'WANT', 'PLANNED'] as Ownership[]).map((k) => <span key={k} className="flex items-center gap-1"><span className={`h-2.5 w-2.5 rounded-full ${STATUS[k].dot}`} />{STATUS[k].label}</span>)}</div>
      </div>

      {tab === 'catalogue' ? (
        <div className="space-y-8">
          {Object.entries(wardrobeTree).map(([grp, subs]) => {
            const ps = catPieces.filter((p) => groupOf(p.kind.wardrobe) === grp);
            if (!ps.length) return null;
            return (
              <div key={grp}>
                <h2 className="mb-3 font-serif text-2xl font-semibold">{grp}</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {subs.map((sub) => { const sp = ps.filter((p) => p.kind.wardrobe === sub); return sp.length ? (
                    <Card key={sub} className="min-w-0 p-4"><div className="mb-1 text-xs font-semibold uppercase tracking-wider text-choc-soft">{sub}</div>
                      <div className="divide-y divide-camel-light/50">{sp.map((p) => <div key={p.id} className="flex items-center gap-2"><Swatch hex={p.colour.hex} size="sm" /><div className="min-w-0 flex-1"><PieceStatusRow pieceId={p.id} label={p.name} /></div></div>)}</div>
                    </Card>) : null; })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <>
          {!items.length && <Card className="text-center text-sm text-choc-soft">No items yet. Add your first piece. Only the name and category are required.</Card>}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((i) => (
              <Card key={i.id} className="flex gap-3 p-3">
                {i.image ? <img src={i.image} alt={i.name} className="h-24 w-24 shrink-0 rounded-lg object-cover" /> : <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg" style={{ background: colours.find((c) => c.id === i.colourId)?.hex ?? '#EFE4D2' }} />}
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{i.name}</div>
                  <div className="text-xs text-choc-soft">{i.category}{i.brand ? ` · ${i.brand}` : ''}{i.size ? ` · ${i.size}` : ''}</div>
                  <div className="text-xs text-choc-soft">{[i.colourText ?? colours.find((c) => c.id === i.colourId)?.name, i.fabric, i.price ? inr(i.price) : ''].filter(Boolean).join(' · ')}</div>
                  {itemPieceId(i) && <div className="text-[11px] text-olive">Linked to catalogue: {pieces.find((p) => p.id === itemPieceId(i))?.name ?? itemPieceId(i)}</div>}
                  <div className="mt-2 flex items-center gap-2"><StatusPicker compact value={i.status} onChange={(s) => setItemStatus(i.id, s)} />
                    <button aria-label="Edit" onClick={() => setEdit(i)}><Pencil className="h-4 w-4 text-choc-soft" /></button>
                    <button aria-label="Duplicate" title="Duplicate / add in another colour" onClick={() => dup(i)}><Copy className="h-4 w-4 text-choc-soft" /></button>
                    <button aria-label="Delete" onClick={() => del(i.id)}><Trash2 className="h-4 w-4 text-choc-soft" /></button></div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
      {edit && <ItemForm item={edit} onCancel={() => setEdit(null)} onSave={save} />}
    </div>
  );
}

function ItemForm({ item, onSave, onCancel }: { item: WardrobeItem; onSave: (i: WardrobeItem) => void; onCancel: () => void }) {
  const [f, setF] = useState<WardrobeItem>(item);
  const [err, setErr] = useState('');
  const set = <K extends keyof WardrobeItem>(k: K, v: WardrobeItem[K]) => setF((x) => ({ ...x, [k]: v }));
  const grp = groupOf(f.category);
  const kindOpts = useMemo(() => kinds.filter((k) => k.wardrobe === f.category || groupSlot[grp] === k.slot), [f.category, grp]);
  const txt = (k: keyof WardrobeItem, label: string, ph = '') => <Field label={label}><input className={inputCls} placeholder={ph} value={(f[k] as string) ?? ''} onChange={(e) => set(k, e.target.value as never)} /></Field>;
  const onImg = async (file?: File) => { if (!file) return; try { set('image', await compressImage(file)); } catch { setErr('Could not read that image.'); } };
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4">
      <div className="w-full max-w-3xl rounded-2xl bg-ivory p-6">
        <div className="mb-4 flex items-center justify-between"><h3 className="font-serif text-2xl">{item.name ? 'Edit item' : 'Add item'}</h3><button aria-label="Close" onClick={onCancel}><X /></button></div>
        <Note>Only <b>name</b> and <b>category</b> are required. Link the item to a catalogue type and colour so outfits recognise it as owned.</Note>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {txt('name', 'Item name *', 'Navy Uniqlo OCBD')}
          <Field label="Category *"><select className={inputCls} value={f.category} onChange={(e) => { const c = e.target.value; setF((x) => ({ ...x, category: c, slot: groupSlot[groupOf(c)], kindId: undefined })); }}>{Object.entries(wardrobeTree).map(([gk, subs]) => <optgroup key={gk} label={gk}>{subs.map((s) => <option key={s}>{s}</option>)}</optgroup>)}</select></Field>
          {txt('subcategory', 'Subcategory')}
          <Field label="Catalogue garment type (for outfit matching)"><select className={inputCls} value={f.kindId ?? ''} onChange={(e) => set('kindId', e.target.value || undefined)}><option value="">— not linked —</option>{kindOpts.map((k) => <option key={k.id} value={k.id}>{k.label}</option>)}</select></Field>
          <Field label="Palette colour"><select className={inputCls} value={f.colourId ?? ''} onChange={(e) => set('colourId', e.target.value || undefined)}><option value="">— choose —</option>{colours.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>
          {txt('colourText', 'Colour (as you call it)')}
          {txt('secondaryColour', 'Secondary colour')}
          {txt('brand', 'Brand')}
          {txt('productName', 'Product name')}
          <Field label="Fabric"><select className={inputCls} value={f.fabric ?? ''} onChange={(e) => set('fabric', e.target.value || undefined)}><option value="">—</option>{fabrics.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select></Field>
          {txt('composition', 'Fabric composition', '98% cotton 2% elastane')}
          {txt('fit', 'Fit', 'Regular / slim…')}
          {txt('size', 'Size', 'XL / 40 / 44L')}
          <Field label="Purchase price (₹)"><input type="number" className={inputCls} value={f.price ?? ''} onChange={(e) => set('price', e.target.value ? Number(e.target.value) : undefined)} /></Field>
          <Field label="Purchase date"><input type="date" className={inputCls} value={f.purchaseDate ?? ''} onChange={(e) => set('purchaseDate', e.target.value)} /></Field>
          <Field label="Condition"><select className={inputCls} value={f.condition ?? ''} onChange={(e) => set('condition', e.target.value)}>{['', 'New', 'Excellent', 'Good', 'Worn', 'Needs repair'].map((x) => <option key={x}>{x}</option>)}</select></Field>
          <Field label="Last worn"><input type="date" className={inputCls} value={f.lastWorn ?? ''} onChange={(e) => set('lastWorn', e.target.value)} /></Field>
          <Field label="Times worn"><input type="number" className={inputCls} value={f.wearCount ?? ''} onChange={(e) => set('wearCount', e.target.value ? Number(e.target.value) : undefined)} /></Field>
          <Field label="Ownership"><StatusPicker value={f.status} onChange={(s) => set('status', s)} /></Field>
          <Field label="Seasons"><div className="flex flex-wrap gap-2 pt-1">{(['summer', 'monsoon', 'transitional', 'winter'] as Season[]).map((s) => <label key={s} className="flex items-center gap-1 text-xs"><input type="checkbox" checked={f.seasons?.includes(s) ?? false} onChange={(e) => set('seasons', e.target.checked ? [...(f.seasons ?? []), s] : (f.seasons ?? []).filter((x) => x !== s))} />{s}</label>)}</div></Field>
          {txt('occasions', 'Suitable occasions')}
          {txt('care', 'Care instructions')}
          {txt('wrinkle', 'Wrinkle resistance')}
          {txt('ironing', 'Ironing requirements')}
          {txt('url', 'Product URL')}
          <div className="sm:col-span-2">{txt('notes', 'Personal notes')}</div>
          <Field label="Photo"><input type="file" accept="image/*" className="text-xs" onChange={(e) => onImg(e.target.files?.[0])} /></Field>
          {f.image && <img src={f.image} alt="" className="h-24 w-24 rounded-lg object-cover" />}
        </div>
        {err && <p className="mt-2 text-sm text-red-700">{err}</p>}
        <div className="mt-6 flex justify-end gap-2"><button className={btnGhost} onClick={onCancel}>Cancel</button><button className={btn} disabled={!f.name.trim()} onClick={() => onSave({ ...f, slot: groupSlot[groupOf(f.category)] })}>Save</button></div>
      </div>
    </div>
  );
}
