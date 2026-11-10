import { useState } from 'react';
import { colours, colourById, paletteGroups } from '../data/colours';
import { colourStories, profile } from '../data/content';
import { kindById } from '../data/kinds';
import { useStore } from '../lib/store';
import { colourLogic, evaluate } from '../lib/engine';
import type { Piece } from '../data/types';
import { Badge, Card, CheckLine, Field, Note, PageHeader, Section, inputCls } from '../components/ui';
import { OutfitFigure } from '../components/OutfitFigure';

const verdictTone = { core: 'green', good: 'olive', caution: 'amber', avoid: 'red' } as const;
const mk = (k: string, c: string): Piece => ({ id: `${k}:${c}`, kind: kindById[k], colour: colourById[c], name: `${colourById[c].name} ${kindById[k].label}` });

export function ColourPage() {
  const { state } = useStore();
  const [t, setT] = useState('rust');
  const [b, setB] = useState('chocolate');
  const [s, setS] = useState('tan');
  const [o, setO] = useState('');
  const top = mk('oxford', t), bottom = mk('chinos', b), shoe = mk('loafer', s), outer = o ? mk('blazer-unstructured', o) : undefined;
  const ev = evaluate({ top, bottom, footwear: shoe, outer, accessories: [mk('belt-leather', s)] });
  const pick = (v: string, set: (x: string) => void, label: string, allowNone = false) => (
    <Field label={label}><select className={inputCls} value={v} onChange={(e) => set(e.target.value)}>{allowNone && <option value="">None</option>}{paletteGroups.map((g) => <optgroup key={g} label={g}>{colours.filter((c) => c.group === g && !c.id.includes('metal')).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</optgroup>)}</select></Field>
  );
  return (
    <div>
      <PageHeader eyebrow="From the report + my evaluation" title="My Colour Intelligence">
        <b>{profile.skinTone}</b> skin with <b>{profile.undertone.toLowerCase()}</b> → <b>{profile.season}</b>. Your colours are earthy, rich and slightly muted, and they echo the gold in your skin. Deep colours suit you better than pastels, and warm colours suit you better than icy ones.
      </PageHeader>

      {paletteGroups.map((g) => (
        <Section key={g} title={g === 'Practical extras' ? 'Practical wardrobe colours (my evaluation)' : `${g} (from your report)`} sub={g === 'Practical extras' ? 'Not explicitly in the report, but evaluated for your colouring. A useful colour is not rejected just because it is missing from the list.' : undefined}>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {colours.filter((c) => c.group === g).map((c) => (
              <Card key={c.id} className="flex gap-4 p-4">
                <div className="h-16 w-16 shrink-0 rounded-lg border border-black/10" style={{ background: c.hex }} />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2"><span className="font-medium">{c.name}</span><Badge tone={verdictTone[c.verdict]}>{c.verdict}</Badge></div>
                  <div className="text-xs text-choc-soft">{c.family} · {['', 'light', 'mid', 'dark'][c.depth]}</div>
                  {c.note && <p className="mt-1 text-xs leading-snug text-choc-soft">{c.note}</p>}
                </div>
              </Card>
            ))}
          </div>
        </Section>
      ))}

      <Section title="Colour combination tester" sub="Choose colours for each piece. The logic explains why a pairing works or does not on your body.">
        <div className="grid gap-6 md:grid-cols-[260px_1fr]">
          <Card className="flex justify-center"><OutfitFigure className="h-96" top={top} bottom={bottom} footwear={shoe} outer={outer} accessories={[mk('belt-leather', s)]} m={state.measurements} /></Card>
          <div>
            <div className="grid gap-3 sm:grid-cols-2">
              {pick(t, setT, 'Shirt')}{pick(o, setO, 'Open layer (optional)', true)}{pick(b, setB, 'Trousers')}{pick(s, setS, 'Shoes and belt')}
            </div>
            <Card className="mt-4">
              <div className="font-serif text-xl">Score {ev.score}</div>
              <p className="mt-1 text-sm">{colourLogic(top.colour, bottom.colour)}</p>
              <ul className="mt-2 divide-y divide-camel-light/50 text-sm">{ev.checks.filter((c) => ['Colour vs your palette', 'Colour count', 'Proportion at the waist', 'Vertical lines'].includes(c.label)).map((c) => <CheckLine key={c.label} {...c} />)}</ul>
            </Card>
          </div>
        </div>
      </Section>

      <Section title="What colour pairings communicate">
        <div className="grid gap-4 md:grid-cols-3">
          {colourStories.map((cs) => (
            <Card key={cs.title}>
              <div className="flex h-16 overflow-hidden rounded-lg">{cs.pair.map((p) => <div key={p} className="flex-1" style={{ background: colourById[p].hex }} />)}</div>
              <div className="mt-3 font-serif text-lg font-semibold">{cs.title}</div>
              <div className="text-sm text-rust">{cs.reads}</div>
              <p className="mt-1 text-xs text-choc-soft">{cs.note}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Colour rules for your body">
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ['Colour near the face', 'Put your best colours (rust, teal, olive, warm white, terracotta) at the collar. That is where they light up your skin.'],
            ['Darker or matched below', 'Darker or same-depth trousers ground the outfit. Light trousers under a dark top work only with a layer bridging them.'],
            ['Avoid a hard line at the stomach', 'The biggest single lesson from your photo: navy over beige draws a horizontal line exactly at the midsection. Tonal outfits and open layers fix it.'],
            ['Warm metals', `${profile.metals}. The report's silver-watch suggestions contradict its own jewellery advice.`],
            ['Black and grey', 'Use them, but warm them: brown leather, a cream shirt, a gold-tone watch.'],
            ['Pastels', 'Swap icy pastels for their warm cousins: pink → coral, baby blue → chambray, lavender → aubergine-burgundy.'],
          ].map(([a, b]) => <Card key={a}><div className="font-medium">{a}</div><p className="mt-1 text-sm text-choc-soft">{b}</p></Card>)}
        </div>
        <div className="mt-4"><Note>Hex swatches are screen representations. Real fabrics shift under shop lights, so judge a colour by holding it under your chin in daylight.</Note></div>
      </Section>
    </div>
  );
}
