import { useState } from 'react';
import { trends } from '../data/content';
import { Badge, Card, PageHeader } from '../components/ui';

const tone = { 'Highly suitable': 'green', 'Suitable with modifications': 'olive', 'Occasion-dependent': 'amber', 'Not recommended': 'red' } as const;

export function Trends() {
  const [f, setF] = useState('all');
  const list = trends.filter((t) => f === 'all' || t.verdict === f);
  return (
    <div>
      <PageHeader eyebrow="Evaluated against your profile" title="Trends & Personal Style Evolution">Current menswear directions, judged on whether they suit a warm deep-autumn, diamond-face, transitioning-oval frame, and whether they will still be wearable in a few years. A trend is not recommended just because it is popular.</PageHeader>
      <div className="mb-6 flex flex-wrap gap-2">{['all', ...Object.keys(tone)].map((x) => <button key={x} onClick={() => setF(x)} className={`rounded-full border px-3 py-1 text-xs ${f === x ? 'border-olive bg-olive text-ivory' : 'border-camel-light bg-paper'}`}>{x === 'all' ? 'All' : x}</button>)}</div>
      <div className="grid gap-4 md:grid-cols-2">
        {list.map((t) => (
          <Card key={t.name}>
            <div className="flex flex-wrap items-center justify-between gap-2"><span className="font-serif text-xl font-semibold">{t.name}</span><Badge tone={tone[t.verdict]}>{t.verdict}</Badge></div>
            <p className="mt-1 text-sm text-choc-soft">{t.what}</p>
            <p className="mt-2 text-sm"><b>For you:</b> {t.why}</p>
            <p className="mt-1 text-xs text-olive"><b>Longevity:</b> {t.longevity}</p>
          </Card>
        ))}
      </div>
      <p className="mt-6 text-xs text-choc-soft">Trend assessment reflects general menswear direction as of late 2026. It is guidance, not sourced market data.</p>
    </div>
  );
}
