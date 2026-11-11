import { Link, useParams } from 'react-router-dom';
import { occasions } from '../data/occasions';
import { outfits } from '../data/outfits';
import type { Occasion, Outfit } from '../data/types';
import { useStore } from '../lib/store';
import { completion, evaluateOutfit } from '../lib/engine';
import { Swatch } from '../components/ui';
import { Eyebrow, LookCard, LookImage } from '../components/Catalog';
import { useRenders } from '../components/OutfitCard';

const groups = ['Everyday and casual', 'Dates and relationships', 'Professional', 'Travel', 'Traditional and festive'] as const;

export function rankForOccasion(state: ReturnType<typeof useStore>['state'], o: Occasion, renders?: Set<string>): Outfit[] {
  return outfits
    .map((x) => {
      const ev = evaluateOutfit(state, x, { occasionRange: o.formality });
      let s = ev.score + (x.occasions.some((t) => o.tags.includes(t)) ? 40 : 0) + completion(state, x).pct / 20 + (renders?.has(x.id) ? 60 : 0);
      if (ev.checks.some((c) => c.label === 'Occasion' && c.status !== 'ok')) s -= 30;
      return { x, s };
    })
    .sort((a, b) => b.s - a.s)
    .slice(0, 5)
    .map((r) => r.x);
}

export function Occasions() {
  const { state } = useStore();
  const renders = useRenders();
  // Give every tile a distinct cover: the best-ranked photographed look not already used.
  const used = new Set<string>();
  const covers: Record<string, Outfit> = {};
  for (const oc of occasions) {
    const ranked = outfits
      .map((x) => ({ x, s: evaluateOutfit(state, x, { occasionRange: oc.formality }).score + (x.occasions.some((t) => oc.tags.includes(t)) ? 40 : 0) }))
      .sort((a, b) => b.s - a.s).map((r) => r.x);
    const pick = ranked.find((x) => renders.has(x.id) && !used.has(x.id)) ?? ranked.find((x) => renders.has(x.id)) ?? ranked[0];
    used.add(pick.id); covers[oc.id] = pick;
  }
  return (
    <div>
      <div className="mb-12 max-w-2xl"><Eyebrow>{occasions.length} occasions</Eyebrow><h1 className="mt-2 font-serif text-5xl md:text-6xl">Dress for the moment</h1><p className="mt-3 text-[15px] leading-relaxed text-choc-soft">From a coffee date to a reception: what the room expects, what to avoid, and five looks ranked for you.</p></div>
      {groups.map((g) => (
        <section key={g} className="mb-16">
          <h2 className="mb-6 border-b border-camel-light/70 pb-3 font-serif text-3xl">{g}</h2>
          <div className="grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-3 lg:grid-cols-5">
            {occasions.filter((o) => o.group === g).map((oc) => {
              const cover = covers[oc.id];
              return (
                <Link key={oc.id} to={`/occasions/${oc.id}`} className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden bg-sand"><div className="h-full transition duration-500 group-hover:scale-[1.04]"><LookImage o={cover} /></div></div>
                  <div className="mt-3 font-serif text-xl leading-tight">{oc.name}</div>
                  <div className="mt-1 flex gap-1">{oc.colours.slice(0, 4).map((c) => <Swatch key={c} id={c} size="sm" />)}</div>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

export function OccasionPage() {
  const { id } = useParams();
  const { state } = useStore();
  const renders = useRenders();
  const o = occasions.find((x) => x.id === id);
  if (!o) return <p>Not found. <Link to="/occasions" className="underline">Back</Link></p>;
  const top = rankForOccasion(state, o, renders);
  const hero = top.find((x) => renders.has(x.id)) ?? top[0];
  const brief: [string, React.ReactNode][] = [
    ['What to wear', o.clothing], ['What to avoid', o.avoid], ['Fabrics', o.fabrics], ['Footwear', o.footwear], ['Accessories', o.accessories], ['Grooming', o.grooming], ['Fragrance', o.fragrance],
  ];
  return (
    <div>
      <div className="mb-6 text-[11px] uppercase tracking-[0.2em] text-choc-soft"><Link to="/occasions" className="hover:text-choc">Occasions</Link> / {o.group}</div>
      <section className="grid gap-10 md:grid-cols-[1fr_1.1fr] md:gap-16">
        <Link to={`/outfit/${hero.id}`} className="relative block aspect-[3/4] overflow-hidden bg-sand"><LookImage o={hero} eager /></Link>
        <div>
          <Eyebrow>{o.group} · formality {o.formality[0]}–{o.formality[1]} of 5</Eyebrow>
          <h1 className="mt-3 font-serif text-5xl leading-[1.05] md:text-6xl">{o.name}</h1>
          {o.note && <p className="mt-4 font-serif text-xl leading-snug text-rust">{o.note}</p>}
          <div className="mt-6"><div className="text-[10px] uppercase tracking-[0.2em] text-choc-soft">Your colours for this</div><div className="mt-2 flex flex-wrap gap-4">{o.colours.map((c) => <Swatch key={c} id={c} label />)}</div></div>
          <dl className="mt-8 divide-y divide-camel-light/70 border-y border-camel-light/70">
            {brief.map(([k, v]) => <div key={k} className="grid gap-1 py-3 sm:grid-cols-[150px_1fr]"><dt className="text-[10px] uppercase tracking-[0.2em] text-choc-soft">{k}</dt><dd className="text-[15px] leading-relaxed">{v}</dd></div>)}
          </dl>
          <p className="mt-4 text-xs text-choc-soft">Fragrance is the last step: shower, clean clothes and deodorant come first.</p>
        </div>
      </section>
      <section className="mt-20">
        <div className="mb-6 border-b border-camel-light/70 pb-3"><Eyebrow>Ranked for you</Eyebrow><h2 className="mt-1 font-serif text-3xl">Five looks for {o.name.toLowerCase()}</h2></div>
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-5">{top.map((x) => <LookCard key={x.id} o={x} />)}</div>
      </section>
    </div>
  );
}
