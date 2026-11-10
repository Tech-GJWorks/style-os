import { useState } from 'react';
import { brands, bestForTables, BRAND_RESEARCH } from '../data/brands';
import { Badge, Card, Note, PageHeader, Section, Table, inputCls } from '../components/ui';

export function Brands() {
  const [q, setQ] = useState('');
  const [tier, setTier] = useState('all');
  const [origin, setOrigin] = useState('all');
  const list = brands.filter((b) => (tier === 'all' || b.tier === tier) && (origin === 'all' || b.origin === origin) && (b.name + b.positioning + b.bestKnown.join(' ')).toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <PageHeader eyebrow="Indian & international" title="Brand & Shopping Guide">{brands.length} brands available in the Indian market, described by positioning and best-known categories, so you know where to start looking for each garment.</PageHeader>
      <Note tone="warn"><b>Research status: pending.</b> {BRAND_RESEARCH.status} Last verified: {BRAND_RESEARCH.lastVerified ?? 'never'}. No product links, store addresses or size charts are listed, because none have been verified, and I will not invent them. Use the Brand size comparison tool (Body page) to record verified charts yourself.</Note>
      <div className="my-6 flex flex-wrap gap-3">
        <input className={`${inputCls} max-w-xs`} placeholder="Search brands…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className={`${inputCls} w-auto`} value={tier} onChange={(e) => setTier(e.target.value)}><option value="all">All tiers</option><option>Premium</option><option>Mid-range</option><option>Value</option></select>
        <select className={`${inputCls} w-auto`} value={origin} onChange={(e) => setOrigin(e.target.value)}><option value="all">Indian + International</option><option>Indian</option><option>International</option></select>
      </div>
      <div className="mb-12 grid gap-4 md:grid-cols-2">
        {list.map((b) => (
          <Card key={b.id}>
            <div className="flex flex-wrap items-center gap-2"><span className="font-serif text-xl font-semibold">{b.name}</span><Badge tone={b.tier === 'Premium' ? 'rust' : b.tier === 'Mid-range' ? 'olive' : 'sand'}>{b.tier}</Badge><Badge tone="grey">{b.origin}</Badge></div>
            <p className="mt-1 text-sm">{b.positioning}</p>
            <dl className="mt-3 grid grid-cols-[130px_1fr] gap-y-1 text-xs">
              {([['Best known for', b.bestKnown.join(', ')], ['Categories', b.categories.join(', ')], ['Fabric quality', b.quality], ['Fit', b.fit], ['Price tier', b.price], ['Size availability', b.sizes], ['Alterations', b.alterations], ['Online', b.online], ['Stores', b.stores]] as [string, string][]).map(([k, v]) => <div key={k} className="contents"><dt className="text-choc-soft">{k}</dt><dd className={v.startsWith('Research pending') ? 'text-amber-700' : ''}>{v}</dd></div>)}
            </dl>
          </Card>
        ))}
      </div>
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
