import { useState } from 'react';
import { fabrics, weaves } from '../data/fabrics';
import { Badge, Card, Note, PageHeader, Section, Table, Tabs } from '../components/ui';

export function Fabrics() {
  const [t, setT] = useState<'Natural fibre' | 'Synthetic fibre' | 'Blend'>('Natural fibre');
  const easy = [...fabrics].filter((f) => !['leather', 'suede'].includes(f.id)).sort((a, b) => b.wrinkle + b.breathability - (a.wrinkle + a.breathability));
  return (
    <div>
      <PageHeader eyebrow="Textile school" title="Fabric & Textile Guide">Fibre is what the yarn is made of. Weave or knit is how the yarn is put together. Finish is what is done afterwards. All three decide how a garment looks, feels, creases and lasts.</PageHeader>
      <Tabs tabs={[{ id: 'Natural fibre', label: 'Natural fibres' }, { id: 'Synthetic fibre', label: 'Synthetic fibres' }, { id: 'Blend', label: 'Blends' }]} value={t} onChange={setT} />
      <div className="mb-12 grid gap-4 md:grid-cols-2">
        {fabrics.filter((f) => f.type === t).map((f) => (
          <Card key={f.id}>
            <div className="font-serif text-xl font-semibold">{f.name}</div>
            <p className="mt-1 text-sm">{f.what}</p>
            <p className="mt-1 text-xs italic text-choc-soft">{f.feel}</p>
            <dl className="mt-3 grid grid-cols-[150px_1fr] gap-y-1 text-xs">
              {([['Wrinkles easily?', f.wrinkle <= 2 ? 'Yes' : f.wrinkle === 3 ? 'Moderately' : 'No'], ['Needs ironing?', f.iron], ['Steam instead?', f.steam], ['Heat setting', f.heat], ['Machine wash', f.machineWash], ['Shrinks?', f.shrink], ['Holds shape?', f.shape], ['Travel', f.travel], ['Dry clean', f.dryClean], ['Storage', f.storage], ['Pilling', f.pilling ?? '—'], ['Fading', f.fading ?? '—']] as [string, string][]).map(([k, v]) => <div key={k} className="contents"><dt className="text-choc-soft">{k}</dt><dd>{v}</dd></div>)}
            </dl>
            <p className="mt-3 rounded bg-sand/60 p-2 text-xs"><b>Bengaluru:</b> {f.bengaluru}</p>
          </Card>
        ))}
      </div>

      <Section title="Fabric-care comparison">
        <Table head={['Fabric', 'Wrinkles', 'Iron', 'Steam', 'Heat', 'Machine wash', 'Shrinks', 'Travel', 'Dry clean']} rows={fabrics.map((f) => [<b>{f.name}</b>, `${f.wrinkle}/5 resist`, f.iron, <span className="text-xs">{f.steam}</span>, f.heat, <span className="text-xs">{f.machineWash}</span>, <span className="text-xs">{f.shrink}</span>, <span className="text-xs">{f.travel}</span>, <span className="text-xs">{f.dryClean}</span>])} />
      </Section>

      <Section title="Best low-maintenance clothes for my lifestyle" sub="Ranked by crease resistance plus breathability, which suits a Bengaluru office worker who does not want to iron every morning.">
        <div className="grid gap-3 md:grid-cols-2">
          {[
            ['Knitted and pique polos', 'Knits do not need ironing. Hang them to dry and they are ready.', 'green'],
            ['Merino knitwear', 'Resists creases and odour, so you can wear it twice between washes.', 'green'],
            ['Twill shirts', 'The diagonal weave hides creases. A 30-second steam is enough.', 'green'],
            ['Wool-blend trousers', 'Hold the crease and release wrinkles overnight on a hanger.', 'green'],
            ['Cotton-elastane chinos', 'Hang them straight from the wash. Minimal ironing.', 'olive'],
            ['Linen-cotton shirts', 'Creases about half as much as linen. Steaming is enough.', 'olive'],
            ['Oxford shirts', 'Looks fine slightly rumpled, because the texture hides creases.', 'olive'],
            ['Seersucker', 'Never needs ironing: the pucker is designed in.', 'green'],
            ['Pure linen', 'NOT low-maintenance and NOT wrinkle-free. It creases within an hour. Buy it because you like how it looks creased.', 'amber'],
            ['Poplin dress shirts', 'Must be ironed every wear. Keep them for formal days.', 'amber'],
          ].map(([a, b, c]) => <Card key={a} className="flex gap-3"><Badge tone={c as 'green'}>{c === 'amber' ? 'High care' : 'Easy'}</Badge><div><div className="font-medium">{a}</div><p className="text-sm text-choc-soft">{b}</p></div></Card>)}
        </div>
        <p className="mt-3 text-xs text-choc-soft">Fibres ranked by crease resistance + breathability: {easy.slice(0, 6).map((f) => f.name).join(' · ')}.</p>
      </Section>

      <Section title="Weaves, knits, measures and finishes">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {weaves.map((w) => <Card key={w.term}><div className="flex items-center justify-between"><span className="font-serif text-lg font-semibold">{w.term}</span><Badge>{w.kind}</Badge></div><p className="mt-1 text-sm text-choc-soft">{w.explain}</p><p className="mt-2 text-[11px] text-olive">Seen in: {w.seen}</p></Card>)}
        </div>
      </Section>

      <Section title="How weaves look (diagram)">
        <Card className="grid gap-6 sm:grid-cols-3">
          {[['Plain (poplin)', (x: number, y: number) => (x + y) % 2 === 0], ['Twill', (x: number, y: number) => (x + y) % 4 < 2], ['Basket (Oxford)', (x: number, y: number) => (Math.floor(x / 2) + Math.floor(y / 2)) % 2 === 0]].map(([name, fn]) => (
            <div key={name as string} className="text-center">
              <svg viewBox="0 0 80 80" className="mx-auto h-32 w-32">{Array.from({ length: 64 }, (_, i) => { const x = i % 8, y = Math.floor(i / 8); return <rect key={i} x={x * 10} y={y * 10} width={10} height={10} fill={(fn as (x: number, y: number) => boolean)(x, y) ? '#3E4A2F' : '#E6D3B5'} />; })}</svg>
              <div className="mt-2 text-sm">{name as string}</div>
            </div>
          ))}
        </Card>
        <div className="mt-3"><Note>Dark squares show where the warp (lengthwise yarn) passes over the weft. In twill the floats step by one each row, which is what makes the diagonal.</Note></div>
      </Section>
    </div>
  );
}
