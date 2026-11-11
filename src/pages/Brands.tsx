import { useState } from 'react';
import { brands, bestForTables, BRAND_RESEARCH, myntra } from '../data/brands';
import { Badge, Card, Note, PageHeader, Section, Table, inputCls } from '../components/ui';

export function Brands() {
  const [q, setQ] = useState('');
  const [tier, setTier] = useState('all');
  const [origin, setOrigin] = useState('all');
  const list = brands.filter((b) => (tier === 'all' || b.tier === tier) && (origin === 'all' || b.origin === origin) && (b.name + b.positioning + b.bestKnown.join(' ')).toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <PageHeader eyebrow="Indian & international" title="Brand & Shopping Guide">{brands.length} brands available in the Indian market, described by positioning and best-known categories, so you know where to start looking for each garment.</PageHeader>
      <Note><b>Live data · checked {BRAND_RESEARCH.lastVerified}.</b> {BRAND_RESEARCH.status} Prices change daily with sales, so treat ranges as a guide and check the product page before buying. Use the Brand size comparison tool (Body page) with each brand's own size chart.</Note>
      <div className="my-6 flex flex-wrap gap-3">
        <input className={`${inputCls} max-w-xs`} placeholder="Search brands…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className={`${inputCls} max-w-[200px]`} value={tier} onChange={(e) => setTier(e.target.value)}><option value="all">All tiers</option><option>Premium</option><option>Mid-range</option><option>Value</option></select>
        <select className={`${inputCls} max-w-[240px]`} value={origin} onChange={(e) => setOrigin(e.target.value)}><option value="all">Indian + International</option><option>Indian</option><option>International</option></select>
      </div>
      <div className="mb-12 grid gap-4 md:grid-cols-2">
        {list.map((b) => (
          <Card key={b.id}>
            <div className="flex flex-wrap items-center gap-2"><span className="font-serif text-xl font-semibold">{b.name}</span><Badge tone={b.tier === 'Premium' ? 'rust' : b.tier === 'Mid-range' ? 'olive' : 'sand'}>{b.tier}</Badge><Badge tone="grey">{b.origin}</Badge></div>
            <p className="mt-1 text-sm">{b.positioning}</p>
            <dl className="mt-3 grid grid-cols-[130px_1fr] gap-y-1 text-xs">
              {([['Best known for', b.bestKnown.join(', ')], ['Fabric quality', b.quality], ['Fit', b.fit], ['Price tier', b.price]] as [string, string][]).map(([k, v]) => <div key={k} className="contents"><dt className="text-choc-soft">{k}</dt><dd>{v}</dd></div>)}
            </dl>
            {(myntra[b.id] ?? []).length ? (
              <div className="mt-4 border-t border-camel-light/70 pt-3">
                <div className="text-[10px] uppercase tracking-[0.2em] text-olive">On Myntra · {BRAND_RESEARCH.lastVerified}</div>
                <table className="mt-2 w-full text-xs">
                  <thead className="text-left text-choc-soft"><tr><th className="py-1 font-normal">Category</th><th className="font-normal">Styles</th><th className="font-normal">Price (median)</th><th className="font-normal">Big sizes seen</th><th className="font-normal">Rating</th></tr></thead>
                  <tbody>{myntra[b.id].map((r) => <tr key={r.cat} className="border-t border-camel-light/40"><td className="py-1">{r.cat}</td><td>{r.styles.toLocaleString('en-IN')}</td><td>₹{r.min.toLocaleString('en-IN')}–{r.max.toLocaleString('en-IN')} <span className="text-choc-soft">(₹{r.median.toLocaleString('en-IN')})</span></td><td>{r.bigSizes || '—'}</td><td>{r.rating ?? '—'}</td></tr>)}</tbody>
                </table>
              </div>
            ) : <p className="mt-4 border-t border-camel-light/70 pt-3 text-xs text-amber-800">Not listed on Myntra ({BRAND_RESEARCH.lastVerified}). Buy through the brand's own website or stores.</p>}
          </Card>
        ))}
      </div>
      <Section title="Price comparison: shirts and trousers on Myntra" sub={`Median listed price per brand, ${BRAND_RESEARCH.lastVerified}. Lower median = better everyday value; premium labels sit to the right.`}>
        <Table head={['Brand', 'Shirts (median)', 'Trousers (median)', 'Shirt sizes 44+ in stock']} rows={brands.filter((b) => (myntra[b.id] ?? []).some((r) => r.cat === 'Shirts' || r.cat === 'Trousers')).map((b) => ({ b, sh: myntra[b.id].find((r) => r.cat === 'Shirts'), tr: myntra[b.id].find((r) => r.cat === 'Trousers') })).sort((x, y) => (x.sh?.median ?? 99999) - (y.sh?.median ?? 99999)).map(({ b, sh, tr }) => [<b>{b.name}</b>, sh ? `₹${sh.median.toLocaleString('en-IN')}` : '—', tr ? `₹${tr.median.toLocaleString('en-IN')}` : '—', sh?.bigSizes || '—'])} />
      </Section>
      <Section title="Where to start, by garment" sub="General guidance from brand positioning. Verify fabric composition and fit in store before buying.">
        <Table head={['Garment', 'Brands to look at first', 'Value-tier option']} rows={bestForTables.map((t) => {
          const bs = brands.filter((b) => b.bestFor.includes(t.key));
          return [<b>{t.label}</b>, bs.filter((b) => b.tier !== 'Value').map((b) => b.name).join(', ') || '—', bs.filter((b) => b.tier === 'Value').map((b) => b.name).join(', ') || '—'];
        })} />
      </Section>
      <Section title="How to judge a product in 60 seconds">
        <div className="grid gap-3 md:grid-cols-2">
          {['Read the composition label: for shirts, cotton or linen above 60%', 'Scrunch the fabric for 5 seconds and see how badly it creases', 'Hold it to the light: thin shirts show your skin and your vest', 'Check seams: are the stripes or checks matched at the pockets and yoke?', 'Buttons: sewn firmly and with a shank? Plastic buttons that wobble = low quality', 'Try it seated, not only standing', 'Size by garment measurement, not by the label (see the Body page)', 'Ask: does it complete at least 3 outfits with what I own? If not, skip it'].map((t) => <Card key={t} className="text-sm">{t}</Card>)}
        </div>
      </Section>
    </div>
  );
}
