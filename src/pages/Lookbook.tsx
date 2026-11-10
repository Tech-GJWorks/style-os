import { useState } from 'react';
import { Link } from 'react-router-dom';
import { collections, outfits } from '../data/outfits';
import { assetByOutfit } from '../data/imageAssets';
import { useStore } from '../lib/store';
import { completion, outfitComponents } from '../lib/engine';
import { fabricById } from '../data/fabrics';
import { Badge, Card, Dots, PageHeader } from '../components/ui';
import { OutfitVisual, useRenders } from '../components/OutfitCard';

export function Lookbook() {
  const [col, setCol] = useState(collections[0].id);
  const renders = useRenders();
  const c = collections.find((x) => x.id === col)!;
  const list = outfits.filter((o) => o.collection === col);
  return (
    <div>
      <PageHeader eyebrow="Image library · one sheet per collection" title="Outfit Lookbook">
        {collections.length} independent collections with {outfits.length} outfits, each shown head to toe with its full specification. Personalised photo renders: <b>{renders.size} of {outfits.length} available</b>. The rest show a proportion illustration drawn from your measurements until a render exists (see <Link to="/visualize" className="underline">Virtual Try-On</Link>).
      </PageHeader>
      <div className="mb-6 flex flex-wrap gap-2">
        {collections.map((x) => <button key={x.id} onClick={() => setCol(x.id)} className={`rounded-full border px-3 py-1 text-xs ${col === x.id ? 'border-olive bg-olive text-ivory' : 'border-camel-light bg-paper hover:border-camel'}`}>{x.name}</button>)}
      </div>
      <h2 className="font-serif text-3xl font-semibold">{c.name}</h2>
      <p className="mb-6 mt-1 text-sm text-choc-soft">{c.blurb}</p>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {list.map((o) => <SheetCard key={o.id} id={o.id} />)}
      </div>
    </div>
  );
}

export function SheetCard({ id }: { id: string }) {
  const { state } = useStore();
  const o = outfits.find((x) => x.id === id)!;
  const comps = outfitComponents(state, o);
  const get = (k: string) => comps.find((x) => x.key === k)?.piece;
  const top = get('top')!, bottom = get('bottom')!, shoes = get('footwear')!, outer = get('outer');
  const acc = comps.filter((x) => x.slot === 'accessory');
  const c = completion(state, o);
  const rows: [string, string][] = [
    ['Garment', top.kind.label + (outer ? ` + ${outer.kind.label.toLowerCase()}` : '')],
    ['Colour', `${top.colour.name}${outer ? ` / ${outer.colour.name}` : ''}`],
    ['Fabric', [top, outer].filter(Boolean).map((p) => fabricById[p!.kind.fabric]?.name ?? p!.kind.fabric).join(', ')],
    ['Fit', top.kind.body === 'careful' ? `Size for drape (${top.kind.bodyNote ?? ''})` : 'Regular, skims the body'],
    ['Trousers', bottom.name],
    ['Footwear', shoes.name],
    ['Accessories', acc.map((a) => a.piece?.name + (a.required ? '' : ' (optional)')).join(', ') || '—'],
    ['Season', o.seasons.join(', ')],
    ['Weather', o.weather],
    ['Occasion', o.occasions.join(', ')],
    ['Impression', o.impression.join(', ')],
    ['Price', o.price],
  ];
  return (
    <Card className="flex flex-col p-0">
      <Link to={`/outfit/${o.id}`} className="relative block bg-gradient-to-b from-sand to-paper px-6 pt-4">
        <OutfitVisual o={o} className="h-72" />
        <span className="absolute left-3 top-3 rounded bg-choc px-2 py-0.5 font-mono text-[11px] text-ivory">OUTFIT {o.id.toUpperCase()}</span>
      </Link>
      <div className="flex-1 p-4">
        <Link to={`/outfit/${o.id}`} className="font-serif text-xl font-semibold leading-tight hover:text-rust">{o.name}</Link>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <Badge tone={c.status === 'Complete' ? 'green' : c.status === 'Almost complete' ? 'amber' : 'grey'}>{c.status}</Badge>
          {o.source === 'report' && <Badge tone="teal">From your report</Badge>}
          {o.source === 'photo' && <Badge tone="rust">From your photo</Badge>}
          <span className="flex items-center gap-1 text-[11px] text-choc-soft">Difficulty <Dots n={o.difficulty} max={3} /></span>
        </div>
        <dl className="mt-3 grid grid-cols-[88px_1fr] gap-x-2 gap-y-1 text-xs">
          {rows.map(([k, v]) => <div key={k} className="contents"><dt className="text-choc-soft">{k}</dt><dd className="text-choc">{v}</dd></div>)}
        </dl>
        <p className="mt-3 border-t border-camel-light/60 pt-3 text-sm leading-relaxed text-choc-soft">{o.why}</p>
        <p className="mt-2 font-mono text-[10px] text-choc-soft/70">asset: {assetByOutfit[o.id].path}</p>
      </div>
    </Card>
  );
}
