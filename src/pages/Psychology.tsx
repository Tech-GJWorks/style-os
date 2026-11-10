import { useState } from 'react';
import { impressions, colourStories } from '../data/content';
import { colourById } from '../data/colours';
import { outfits } from '../data/outfits';
import { Card, Note, PageHeader, Section, Swatch } from '../components/ui';
import { OutfitCard } from '../components/OutfitCard';

export function Psychology() {
  const [sel, setSel] = useState('mature');
  const imp = impressions.find((i) => i.id === sel)!;
  const matches = outfits.filter((o) => o.impression.some((t) => imp.tags.includes(t))).slice(0, 6);
  return (
    <div>
      <PageHeader eyebrow="What your clothes communicate" title="Style Psychology & Personal Aura">Clothes send signals before you speak. These are <b>cultural and stylistic associations</b>, not scientifically guaranteed personality effects. They help you choose deliberately.</PageHeader>
      <Section title="How do I want to present myself today?">
        <div className="mb-5 flex flex-wrap gap-2">{impressions.map((i) => <button key={i.id} onClick={() => setSel(i.id)} className={`rounded-full border px-3 py-1 text-sm ${sel === i.id ? 'border-rust bg-rust text-ivory' : 'border-camel-light bg-paper'}`}>{i.name}</button>)}</div>
        <Card className="mb-6">
          <div className="font-serif text-3xl font-semibold">{imp.name}</div>
          <div className="mt-3 flex flex-wrap gap-3">{imp.colours.map((c) => <Swatch key={c} id={c} label />)}</div>
          <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm md:grid-cols-[160px_1fr]">
            {([['Garments', imp.garments], ['Fabrics', imp.fabrics], ['Accessories', imp.accessories], ['Grooming', imp.grooming], ['Footwear', imp.footwear], ['Occasions', imp.occasions], ['Avoid', imp.avoid], ['Why it reads this way', imp.why]] as [string, string][]).map(([k, v]) => <div key={k} className="contents"><dt className="font-medium text-choc-soft">{k}</dt><dd>{v}</dd></div>)}
          </dl>
        </Card>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{matches.map((o) => <OutfitCard key={o.id} o={o} />)}</div>
        {!matches.length && <Note>No catalogue outfit is tagged with this impression yet. Use the colours and garments above in the Builder.</Note>}
      </Section>
      <Section title="Colour pairings and the impression they give">
        <div className="grid gap-4 md:grid-cols-3">{colourStories.map((c) => <Card key={c.title}><div className="flex h-12 overflow-hidden rounded">{c.pair.map((p) => <div key={p} className="flex-1" style={{ background: colourById[p].hex }} />)}</div><div className="mt-2 font-medium">{c.title}</div><div className="text-sm text-rust">{c.reads}</div><p className="mt-1 text-xs text-choc-soft">{c.note}</p></Card>)}</div>
      </Section>
      <Section title="Signals you can control">
        <div className="grid gap-3 md:grid-cols-2">
          {[['Contrast', 'High contrast (navy and white) reads as authority and clarity. Low contrast (olive and beige) reads as calm and approachable.'], ['Structure', 'Padded shoulders and pressed creases read as formal and authoritative. Soft, unstructured pieces read as relaxed and creative.'], ['Texture', 'Matte, rich textures (suede, knit, linen) read as warmth and quiet luxury. Shine reads as evening or flash.'], ['Fit', 'Clothes that fit, neither tight nor baggy, read as self-respect more than any brand does.'], ['Grooming', 'Sharp beard lines read as disciplined. Freshness and smell are judged before the outfit is.'], ['Consistency', 'A recognisable personal palette (yours: earthy warm) reads as a mature, settled identity.']].map(([a, b]) => <Card key={a}><div className="font-medium">{a}</div><p className="mt-1 text-sm text-choc-soft">{b}</p></Card>)}
        </div>
      </Section>
    </div>
  );
}
