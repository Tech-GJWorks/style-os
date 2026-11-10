import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import { categories, garments, garmentById } from '../data/garments';
import { fabricById } from '../data/fabrics';
import { brands } from '../data/brands';
import { outfits } from '../data/outfits';
import { kinds } from '../data/kinds';
import { colourById } from '../data/colours';
import { useStore } from '../lib/store';
import { evaluate, completion } from '../lib/engine';
import { makePiece, pieceById } from '../lib/catalogue';
import type { GarmentType, Piece } from '../data/types';
import { Badge, Card, Dots, PageHeader, Section, Swatch, Table, inputCls } from '../components/ui';
import { OutfitFigure } from '../components/OutfitFigure';
import { OutfitCard, PieceStatusRow } from '../components/OutfitCard';

const prTone = { Essential: 'green', 'High priority': 'olive', 'Useful addition': 'sand', Optional: 'grey', 'Avoid buying': 'red' } as const;

export function Academy() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('all');
  const list = garments.filter((g) => (cat === 'all' || g.cat === cat) && (g.name + g.definition).toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <PageHeader eyebrow="Beginner → practical mastery" title="Clothing Education Academy">
        {garments.length} garment types, each on its own page: what it is, how it is built, which fabric, colour and fit to choose for your body, what to pair it with, where to wear it, how to care for it, and whether it is worth buying.
      </PageHeader>
      <div className="mb-6 flex flex-wrap gap-3">
        <div className="relative w-full max-w-xs"><Search className="absolute left-3 top-2.5 h-4 w-4 text-choc-soft" /><input className={`${inputCls} pl-9`} placeholder="Search garments…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <select className={`${inputCls} w-auto`} value={cat} onChange={(e) => setCat(e.target.value)}><option value="all">All categories</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.letter}. {c.name}</option>)}</select>
      </div>
      {categories.filter((c) => cat === 'all' || c.id === cat).map((c) => {
        const gs = list.filter((g) => g.cat === c.id);
        if (!gs.length) return null;
        return (
          <Section key={c.id} title={`${c.letter}. ${c.name}`} sub={c.intro}>
            {c.id === 'shirts' && <ShirtFabricCompare />}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {gs.map((g) => (
                <Link key={g.id} to={`/academy/${g.id}`}><Card className="h-full transition hover:border-camel">
                  <div className="flex items-start justify-between gap-2"><span className="font-serif text-lg font-semibold leading-tight">{g.name}</span>{g.priority && <Badge tone={prTone[g.priority]}>{g.priority}</Badge>}</div>
                  <p className="mt-1 line-clamp-2 text-xs text-choc-soft">{g.definition}</p>
                  <div className="mt-2 flex items-center gap-2 text-[11px] text-choc-soft">Formality <Dots n={g.formality} /></div>
                </Card></Link>
              ))}
            </div>
          </Section>
        );
      })}
    </div>
  );
}

function ShirtFabricCompare() {
  const rows = [
    ['Linen', 'Plain weave, flax', 'Matte, slubby', '★★★★★', '★', 'Summer, beach, dates', 'Will crease. Accept it or steam it.'],
    ['Linen-cotton', 'Plain weave, blend', 'Soft linen look', '★★★★', '★★★', 'Hot-weather office, travel', 'The best Bengaluru compromise'],
    ['Oxford cotton', 'Basket weave', 'Textured, soft', '★★★', '★★★', 'Office, dates, everything', 'Most versatile'],
    ['Poplin', 'Tight plain weave', 'Smooth, crisp', '★★★', '★★', 'Suits, interviews', 'Must be ironed'],
    ['Twill', 'Diagonal weave', 'Soft sheen, drapes', '★★★', '★★★★', 'AC office, dinner', 'Creases less, drapes best'],
    ['Chambray', 'Plain weave, coloured warp', 'Light denim look', '★★★★', '★★★', 'Weekends', 'Casual blue alternative'],
  ];
  return <div className="mb-5"><Table head={['Fabric', 'Construction', 'Look', 'Breathability', 'Crease resistance', 'Best for', 'Note']} rows={rows} /></div>;
}

function comboPieces(g: GarmentType): { top: Piece; bottom: Piece; footwear: Piece; outer?: Piece }[] {
  const k = g.kind;
  if (!k) return [];
  const kind = kinds.find((x) => x.id === k)!;
  const cols = (g.colours.length ? g.colours : ['navy', 'olive', 'beige']).filter((c) => colourById[c]);
  const res: { top: Piece; bottom: Piece; footwear: Piece; outer?: Piece }[] = [];
  const bottoms = ['chinos:beige', 'chinos:stone', 'chinos:olive', 'jeans-slim-straight:indigo', 'chinos:navy', 'formal-trousers:charcoal', 'pleated:camel', 'chinos:chocolate'];
  const shoes = ['loafer-suede:brown', 'sneaker-white:white', 'loafer:brown', 'derby:brown', 'desert:camel', 'chelsea:brown'];
  const tops = ['oxford:warm-white', 'tee-crew:ivory', 'polo-knit:chocolate', 'henley:ivory', 'oxford:navy'];
  for (const c of cols) {
    const self = makePiece(`${k}:${c}`) ?? { id: `${k}:${c}`, kind, colour: colourById[c], name: `${colourById[c].name} ${kind.label}` };
    for (const b of bottoms) for (const s of shoes) {
      let parts: { top: Piece; bottom: Piece; footwear: Piece; outer?: Piece } | undefined;
      if (kind.slot === 'top') parts = { top: self, bottom: pieceById[b] ?? makePiece(b)!, footwear: pieceById[s] ?? makePiece(s)! };
      else if (kind.slot === 'bottom') parts = { top: makePiece(tops[res.length % tops.length])!, bottom: self, footwear: makePiece(s)! };
      else if (kind.slot === 'outer') parts = { top: makePiece(tops[res.length % tops.length])!, bottom: makePiece(b)!, footwear: makePiece(s)!, outer: self };
      if (!parts) continue;
      if (res.some((r) => r.bottom.id === parts!.bottom.id && r.top.colour.id === parts!.top.colour.id)) continue;
      const ev = evaluate({ ...parts, accessories: [makePiece('belt-leather:brown')!] });
      if (ev.score >= 80) { res.push(parts); break; }
    }
    if (res.length >= 6) break;
  }
  return res;
}

export function GarmentPage() {
  const { id } = useParams();
  const { state } = useStore();
  const g = garmentById[id ?? ''];
  const related = useMemo(() => (g?.kind ? outfits.filter((o) => [o.top, o.bottom, o.outer].some((r) => r?.startsWith(`${g.kind}:`))) : []), [g]);
  const generated = useMemo(() => (g ? comboPieces(g) : []), [g]);
  if (!g) return <p>Garment not found. <Link to="/academy" className="underline">Back to the Academy</Link></p>;
  const fab = g.fabrics.map((f) => fabricById[f]).filter(Boolean);
  const cat = categories.find((c) => c.id === g.cat)!;
  const brandList = brands.filter((b) => b.categories.includes(g.cat === 'occasion' ? 'occasion' : g.cat === 'knits' ? 'knits' : g.cat));
  const yourPieces = g.kind ? Object.keys(pieceById).filter((p) => p.startsWith(`${g.kind}:`)) : [];
  const Item = ({ n, t, children }: { n: number; t: string; children: React.ReactNode }) => (
    <div className="border-t border-camel-light/60 py-4 first:border-t-0"><div className="flex gap-3"><span className="w-6 shrink-0 font-serif text-lg text-rust">{n}</span><div className="min-w-0 flex-1"><div className="text-sm font-semibold uppercase tracking-wider text-choc">{t}</div><div className="mt-1 text-sm leading-relaxed text-choc-soft">{children}</div></div></div></div>
  );
  const L = ({ xs }: { xs?: string[] }) => (xs?.length ? <ul className="list-disc space-y-0.5 pl-4">{xs.map((x) => <li key={x}>{x}</li>)}</ul> : <>—</>);
  return (
    <div>
      <Link to="/academy" className="mb-4 inline-flex items-center gap-1 text-sm text-rust"><ArrowLeft className="h-4 w-4" /> {cat.letter}. {cat.name}</Link>
      <PageHeader eyebrow={`${cat.name} · Academy`} title={g.name}>
        {g.definition}
        <div className="mt-3 flex flex-wrap items-center gap-2">{g.priority && <Badge tone={prTone[g.priority]}>{g.priority}</Badge>}<span className="flex items-center gap-2 text-xs">Formality <Dots n={g.formality} /></span></div>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <Card className="py-1">
          <Item n={1} t="Definition">{g.definition}</Item>
          <Item n={2} t="How it looks">{g.looks}</Item>
          <Item n={3} t="Construction">{g.construction}</Item>
          <Item n={4} t="Fabric variations">{fab.map((f) => <div key={f.id}><b>{f.name}</b>: {f.what}</div>)}</Item>
          <Item n={5} t="Collar variations"><L xs={g.collars} /></Item>
          <Item n={6} t="Sleeve variations"><L xs={g.sleeves} /></Item>
          <Item n={7} t="Fit variations"><L xs={g.fits} /></Item>
          <Item n={8} t="Length variations"><L xs={g.lengths} /></Item>
          <Item n={9} t="Seasonal suitability">{fab.map((f) => f.bengaluru).join(' ')}</Item>
          <Item n={10} t="Weather suitability">{fab.map((f) => `${f.name}: breathability ${f.breathability}/5, dries ${['', 'very slowly', 'slowly', 'moderately', 'quickly', 'very quickly'][f.drying]}, heat retention ${f.heatRetention}/5.`).join(' ')}</Item>
          <Item n={11} t="Formality level"><Dots n={g.formality} /> {['', 'Very casual', 'Casual', 'Smart casual', 'Business', 'Formal'][g.formality]}</Item>
          <Item n={12} t="Body-shape compatibility (for you)">{g.body}</Item>
          <Item n={13} t="Best colours for you"><div className="flex flex-wrap gap-3">{g.colours.map((c) => <Swatch key={c} id={c} label />)}</div></Item>
          <Item n={14} t="Matching trousers"><L xs={g.trousers} /></Item>
          <Item n={15} t="Matching footwear"><L xs={g.footwear} /></Item>
          <Item n={16} t="Matching accessories"><L xs={g.accessories} /></Item>
          <Item n={17} t="Where to wear it"><L xs={g.where} /></Item>
          <Item n={18} t="Where NOT to wear it"><L xs={g.avoid} /></Item>
          <Item n={19} t="Tuck or untuck">{g.tuck}</Item>
          <Item n={20} t="Rolling sleeves">{g.roll}</Item>
          <Item n={21} t="Layering">{g.layer}</Item>
          <Item n={22} t="Ironing">{fab.map((f) => `${f.name}: iron ${f.iron.toLowerCase()} · ${f.heat.toLowerCase()} heat · steam: ${f.steam}`).join(' | ')}</Item>
          <Item n={23} t="Wrinkle behaviour">{fab.map((f) => `${f.name}: crease resistance ${f.wrinkle}/5.`).join(' ')}</Item>
          <Item n={24} t="Washing and maintenance">{fab.map((f) => `${f.name}: ${f.machineWash}. Shrinkage: ${f.shrink}. Storage: ${f.storage}. Dry clean: ${f.dryClean}.`).join(' ')}</Item>
          <Item n={25} t="Brands that offer this category">{brandList.length ? brandList.map((b) => b.name).join(', ') : '—'}. <span className="text-xs">(Category-level positioning only. Whether a brand stocks this exact garment is research pending.)</span></Item>
          <Item n={26} t="Price ranges in India">{g.price} <span className="text-xs">(general market guidance, not verified prices)</span></Item>
          <Item n={27} t="Common styling mistakes"><L xs={g.mistakes} /></Item>
          <Item n={28} t="Outfit combinations">See the combinations below.</Item>
          <Item n={29} t="Final recommendation for you"><span className="text-choc">{g.verdict}</span></Item>
        </Card>
        <div className="space-y-4">
          <Card>
            <div className="text-xs uppercase tracking-wider text-choc-soft">On your proportions</div>
            {generated[0] ? <OutfitFigure className="mx-auto mt-2 h-80" {...generated[0]} accessories={[makePiece('belt-leather:brown')!, makePiece('glasses:gold-metal')!]} m={state.measurements} /> : <p className="mt-2 text-sm">A concept or dress code, not a single garment.</p>}
          </Card>
          {yourPieces.length > 0 && <Card><div className="mb-1 text-xs uppercase tracking-wider text-choc-soft">Do you own one?</div><div className="divide-y divide-camel-light/50">{yourPieces.map((p) => <PieceStatusRow key={p} pieceId={p} label={pieceById[p].name} />)}</div></Card>}
          <Card className="text-sm">
            <div className="text-xs uppercase tracking-wider text-choc-soft">The 14 questions, fast</div>
            <ol className="mt-2 list-decimal space-y-1 pl-4 text-xs text-choc-soft">
              <li>What is it? (1–3)</li><li>On your body (12)</li><li>Fabric (4)</li><li>Colours (13)</li><li>Combine with (14, 28)</li><li>Shoes and accessories (15–16)</li><li>When and where (17–18)</li><li>Impression (see Psychology)</li><li>Season and weather (9–10)</li><li>Brands (25)</li><li>Size (Body page)</li><li>Care and ironing (22–24)</li><li>Worth buying? ({g.priority ?? '—'})</li><li>Alternatives (29 and related garments)</li>
            </ol>
          </Card>
        </div>
      </div>

      <Section title="Outfit combinations" sub="Generated from your palette and checked by the styling engine (score 80+). Illustrations, not photos.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {generated.map((p, i) => (
            <Card key={i} className="flex gap-3 p-3">
              <OutfitFigure className="h-44 w-24 shrink-0" {...p} accessories={[makePiece('belt-leather:brown')!]} m={state.measurements} />
              <div className="text-sm"><div className="font-mono text-[10px] text-choc-soft">COMBO {i + 1}</div><ul className="mt-1 space-y-0.5">{[p.top, p.outer, p.bottom, p.footwear].filter(Boolean).map((x) => <li key={x!.id}>• {x!.name}</li>)}</ul><p className="mt-2 text-xs text-choc-soft">{evaluate({ ...p }).colourLogic}</p></div>
            </Card>
          ))}
        </div>
      </Section>
      {related.length > 0 && <Section title="From the lookbook"><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{related.slice(0, 6).map((o) => <OutfitCard key={o.id} o={o} />)}</div>{related.length > 6 && <p className="mt-3 text-xs text-choc-soft">+{related.length - 6} more in My Outfit Combinations. {related.filter((o) => completion(state, o).status === 'Complete').length} of them are complete with what you own.</p>}</Section>}
    </div>
  );
}
