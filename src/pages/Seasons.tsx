import { useState } from 'react';
import { environments, seasons } from '../data/content';
import { fabrics } from '../data/fabrics';
import { outfits } from '../data/outfits';
import { currentSeason } from '../lib/engine';
import type { Season } from '../data/types';
import { Card, Note, PageHeader, Section, Table, Tabs } from '../components/ui';
import { OutfitCard } from '../components/OutfitCard';

const bar = (n: number) => <span className="inline-flex gap-0.5">{Array.from({ length: 5 }, (_, i) => <span key={i} className={`h-2 w-2 rounded-sm ${i < n ? 'bg-olive' : 'bg-camel-light'}`} />)}</span>;

export function Seasons() {
  const [s, setS] = useState<Season>(currentSeason());
  const sz = seasons.find((x) => x.id === s)!;
  const list = outfits.filter((o) => o.seasons.includes(s) && (s !== 'summer' || o.seasons.length <= 3)).slice(0, 9);
  return (
    <div>
      <PageHeader eyebrow="Bengaluru-first" title="Seasonal Wardrobe">Bengaluru has no harsh winter and no extreme summer, but it does have humidity, a long monsoon and aggressive office AC. Fabric choice matters more than layering.</PageHeader>
      <Tabs tabs={seasons.map((x) => ({ id: x.id as Season, label: `${x.name} · ${x.months}` }))} value={s} onChange={setS} />
      <div className="mb-8 grid gap-4 md:grid-cols-2">
        <Card><div className="text-xs uppercase tracking-wider text-choc-soft">Climate</div><p className="mt-1">{sz.climate}</p><div className="mt-3 text-xs uppercase tracking-wider text-choc-soft">Fabrics</div><p className="mt-1">{sz.fabrics}</p></Card>
        <Card><div className="text-xs uppercase tracking-wider text-choc-soft">Wear</div><p className="mt-1">{sz.garments}</p><div className="mt-3 text-xs uppercase tracking-wider text-choc-soft">Avoid</div><p className="mt-1">{sz.avoid}</p><div className="mt-3 text-xs uppercase tracking-wider text-rust">Trade-off</div><p className="mt-1 text-sm">{sz.trade}</p></Card>
      </div>
      <Section title={`${sz.name} outfits`}><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{list.map((o) => <OutfitCard key={o.id} o={o} />)}</div></Section>
      <Section title="Environments">
        <div className="grid gap-4 md:grid-cols-3">{environments.map((e) => <Card key={e.name}><div className="font-serif text-lg font-semibold">{e.name}</div><p className="mt-1 text-sm text-choc-soft">{e.advice}</p></Card>)}</div>
      </Section>
      <Section title="Fabric performance in heat and humidity" sub="5 = best. Wrinkle = resistance to creasing. Heat = how much warmth it holds (low is good for summer).">
        <Table head={['Fabric', 'Breathability', 'Moisture absorption', 'Drying speed', 'Wrinkle resistance', 'Heat retention', 'Weight', 'Layering', 'Maintenance']} rows={fabrics.filter((f) => !['leather', 'suede'].includes(f.id)).map((f) => [<b>{f.name}</b>, bar(f.breathability), bar(f.moisture), bar(f.drying), bar(f.wrinkle), bar(f.heatRetention), <span className="text-xs">{f.weight}</span>, <span className="text-xs">{f.layering}</span>, <span className="text-xs">Iron: {f.iron} · {f.machineWash}</span>])} />
        <div className="mt-3"><Note>Heavy fabrics in hot, humid weather: denim, flannel and heavy wool trap heat and dry slowly. They are fine in AC or for an evening outdoors, but you will be uncomfortable in them at 2 pm on an MG Road pavement.</Note></div>
      </Section>
    </div>
  );
}
