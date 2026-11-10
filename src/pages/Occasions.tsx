import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { occasions } from '../data/occasions';
import { outfits } from '../data/outfits';
import type { Occasion } from '../data/types';
import { useStore } from '../lib/store';
import { completion, evaluateOutfit } from '../lib/engine';
import { Card, Dots, Note, PageHeader, Section, Swatch } from '../components/ui';
import { OutfitCard } from '../components/OutfitCard';

const groups = ['Everyday and casual', 'Dates and relationships', 'Professional', 'Travel', 'Traditional and festive'] as const;

export function Occasions() {
  return (
    <div>
      <PageHeader eyebrow={`${occasions.length} occasions`} title="Occasion-Based Styling">Every occasion has its own guide: what to wear, what to avoid, colours, fabrics, shoes, accessories, grooming, fragrance and five ranked outfit combinations.</PageHeader>
      {groups.map((g) => (
        <Section key={g} title={g}>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {occasions.filter((o) => o.group === g).map((o) => (
              <Link key={o.id} to={`/occasions/${o.id}`}><Card className="h-full transition hover:border-camel">
                <div className="font-serif text-lg font-semibold">{o.name}</div>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-choc-soft">Formality <Dots n={o.formality[1]} /></div>
                <div className="mt-2 flex gap-1">{o.colours.map((c) => <Swatch key={c} id={c} size="sm" />)}</div>
              </Card></Link>
            ))}
          </div>
        </Section>
      ))}
    </div>
  );
}

export function rankForOccasion(state: ReturnType<typeof useStore>['state'], o: Occasion) {
  return outfits
    .map((x) => {
      const ev = evaluateOutfit(state, x, { occasionRange: o.formality });
      let s = ev.score + (x.occasions.some((t) => o.tags.includes(t)) ? 40 : 0) + completion(state, x).pct / 20;
      if (ev.checks.some((c) => c.label === 'Occasion' && c.status !== 'ok')) s -= 30;
      return { x, s };
    })
    .sort((a, b) => b.s - a.s)
    .slice(0, 5)
    .map((r) => r.x);
}

export function OccasionPage() {
  const { id } = useParams();
  const { state } = useStore();
  const o = occasions.find((x) => x.id === id);
  if (!o) return <p>Not found. <Link to="/occasions" className="underline">Back</Link></p>;
  const top = rankForOccasion(state, o);
  const rows: [string, React.ReactNode][] = [
    ['Appropriate clothing', o.clothing], ['Avoid', o.avoid], ['Colours', <div className="flex flex-wrap gap-3">{o.colours.map((c) => <Swatch key={c} id={c} label />)}</div>],
    ['Fabrics', o.fabrics], ['Footwear', o.footwear], ['Accessories', o.accessories], ['Grooming', o.grooming], ['Fragrance', o.fragrance],
    ['Formality', <span className="flex items-center gap-2"><Dots n={o.formality[1]} /> {o.formality[0]}–{o.formality[1]} of 5</span>],
  ];
  return (
    <div>
      <Link to="/occasions" className="mb-4 inline-flex items-center gap-1 text-sm text-rust"><ArrowLeft className="h-4 w-4" /> Occasions</Link>
      <PageHeader eyebrow={o.group} title={o.name}>{o.note}</PageHeader>
      <Card className="mb-10">
        <dl className="grid gap-x-6 gap-y-3 md:grid-cols-[200px_1fr]">{rows.map(([k, v]) => <div key={k} className="contents"><dt className="text-sm font-semibold uppercase tracking-wider text-choc-soft">{k}</dt><dd className="text-sm">{v}</dd></div>)}</dl>
      </Card>
      <Section title="Five outfit combinations" sub="Ranked by occasion fit, styling score and how much of each outfit you already own.">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{top.map((x) => <OutfitCard key={x.id} o={x} detailed />)}</div>
      </Section>
      <Note>Fragrance is the last step, not a substitute: shower, clean clothes and deodorant come first.</Note>
    </div>
  );
}
